import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { streamCoachResponse } from "@/lib/ai-coach";

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  // Gate access behind a successful book purchase — the AI Coach is a
  // bundled perk of buying the book, not a separate free feature.
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "success")
    .limit(1)
    .maybeSingle();

  if (!purchase) {
    return new Response(
      JSON.stringify({ error: "The AI Coach is available after you purchase the book." }),
      { status: 403 }
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
  const { message } = parsed.data;
  let { conversationId } = parsed.data;

  if (!conversationId) {
    const { data: conv, error } = await supabase
      .from("coach_conversations")
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select("id")
      .single();
    if (error || !conv) {
      return new Response(JSON.stringify({ error: "Couldn't start conversation" }), {
        status: 500,
      });
    }
    conversationId = conv.id;
  }

  const { data: history } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  await supabase.from("coach_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      // Send the conversation id first so the client can persist it for
      // the next message in this same thread.
      controller.enqueue(
        encoder.encode(`event: conversation\ndata: ${conversationId}\n\n`)
      );

      try {
        for await (const textChunk of streamCoachResponse(
          message,
          (history ?? []).map((h) => ({
            role: h.role as "user" | "assistant",
            content: h.content,
          }))
        )) {
          fullResponse += textChunk;
          controller.enqueue(
            encoder.encode(`event: chunk\ndata: ${JSON.stringify(textChunk)}\n\n`)
          );
        }

        await supabase.from("coach_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: fullResponse,
        });

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify(
              err instanceof Error ? err.message : "Something went wrong"
            )}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
