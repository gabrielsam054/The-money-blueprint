"use client";

import { Loader2, Check, AlertCircle } from "lucide-react";
import type { SaveStatus } from "@/lib/use-worksheet-autosave";

export function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      {status === "saving" && (
        <>
          <Loader2 size={13} className="animate-spin text-slate-muted" />
          <span className="text-slate-muted">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check size={13} className="text-emerald" />
          <span className="text-emerald">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle size={13} className="text-error" />
          <span className="text-error">Couldn&apos;t save</span>
        </>
      )}
    </div>
  );
}
