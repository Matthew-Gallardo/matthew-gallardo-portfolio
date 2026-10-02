"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="copy-control js-required">
      <button className="button button-secondary" onClick={copy}>
        {status === "success" ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {status === "success" ? "Copied" : "Copy email"}
      </button>
      <p className="copy-feedback" aria-live="polite" role="status">
        {status === "success"
          ? "Email address copied."
          : status === "error"
            ? "Couldn’t copy the email address. Select it above or open your mail app."
            : ""}
      </p>
    </div>
  );
}
