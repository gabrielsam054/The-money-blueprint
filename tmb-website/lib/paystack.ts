/**
 * Shared Paystack integration. All amounts are in the smallest currency
 * unit (pesewas for GHS — 1 GHS = 100 pesewas), which is what Paystack's
 * API expects everywhere.
 */

export const BOOK_PRICE_GHS = 340; // GHS 340 — adjust here to change the price
export const BOOK_PRICE_PESEWAS = BOOK_PRICE_GHS * 100;
export const CURRENCY = "GHS";

// Display-only. The site shows this price; Paystack actually charges
// BOOK_PRICE_GHS above (that's what the connected Paystack account is
// set up to settle in). These two numbers are set independently — this
// isn't a live currency conversion, so if GHS 340 is changed, check
// whether this should move too rather than assuming it updates itself.
export const BOOK_PRICE_USD_DISPLAY = 29;

// Membership — recurring billing infrastructure only; no perk decided
// yet, so nothing in the app currently checks subscription status to
// gate anything. GHS 50/month is a placeholder, adjust freely.
export const MEMBERSHIP_PRICE_GHS = 50;
export const MEMBERSHIP_PRICE_PESEWAS = MEMBERSHIP_PRICE_GHS * 100;

// Same display-only relationship as the book price above.
export const MEMBERSHIP_PRICE_USD_DISPLAY = 5;

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set — checkout can't work without it."
    );
  }
  return key;
}

export const paystackConfigured = !!process.env.PAYSTACK_SECRET_KEY;

interface InitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(params: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
  /** When provided, Paystack automatically creates a recurring
   * subscription tied to this plan after the first successful charge —
   * used for membership signup, omitted for the one-time book purchase. */
  planCode?: string;
}): Promise<InitializeResponse["data"]> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountPesewas,
      currency: CURRENCY,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      ...(params.planCode ? { plan: params.planCode } : {}),
    }),
  });

  const json: InitializeResponse = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction");
  }
  return json.data;
}

interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
    metadata: Record<string, unknown> | null;
  };
}

export async function verifyTransaction(
  reference: string
): Promise<VerifyResponse["data"]> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    }
  );

  const json: VerifyResponse = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction");
  }
  return json.data;
}

/** Verifies Paystack's webhook signature (HMAC SHA512 of the raw body,
 * using the secret key) — required before trusting any webhook payload. */
export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): Promise<boolean> {
  if (!signatureHeader) return false;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(getSecretKey());
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  );
  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signatureHeader;
}
