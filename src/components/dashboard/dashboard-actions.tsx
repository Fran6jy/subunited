"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/fetcher";

export function DashboardActions({ purchaseId, userId }: { purchaseId: string; userId: string }) {
  const [otpResult, setOtpResult] = useState<string | null>(null);
  const [credentialResult, setCredentialResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<"otp" | "credential" | null>(null);

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <Button
        size="sm"
        variant="secondary"
        onClick={async () => {
          setLoading("otp");
          try {
            const result = await apiFetch<{ code: string }>("/api/otp", {
              method: "POST",
              headers: {
                "x-subunited-user-id": userId,
              },
              body: JSON.stringify({ purchaseId, userId }),
            });
            setOtpResult(result.code);
          } finally {
            setLoading(null);
          }
        }}
      >
        {loading === "otp" ? "Generating OTP..." : "Generate OTP"}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          setLoading("credential");
          try {
            const result = await apiFetch<{ email: string; password: string }>(`/api/credentials/${purchaseId}`, {
              headers: {
                "x-subunited-user-id": userId,
              },
            });
            setCredentialResult(`${result.email} / ${result.password}`);
          } finally {
            setLoading(null);
          }
        }}
      >
        {loading === "credential" ? "Loading..." : "Reveal credentials"}
      </Button>

      {otpResult ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">OTP: {otpResult}</div> : null}
      {credentialResult ? <div className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-foreground">{credentialResult}</div> : null}
    </div>
  );
}
