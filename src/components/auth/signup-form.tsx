"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="glass-card w-full max-w-md rounded-[32px] p-8">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Authentication</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-3 text-sm text-muted">Start purchasing, renewing, and managing subscription access securely.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);

          try {
            const result = await authClient.signUp.email({ name, email, password });
            if (result.error) {
              setError(result.error.message ?? "Unable to create account");
              return;
            }
            router.push("/dashboard");
            router.refresh();
          } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "Unable to create account");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm text-muted" htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none transition focus:border-primary" placeholder="Your name" required />
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted" htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none transition focus:border-primary" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted" htmlFor="password">Password</label>
          <input id="password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none transition focus:border-primary" placeholder="Create a secure password" required />
        </div>
        {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div> : null}
        <Button className="w-full" size="lg" type="submit">{loading ? "Creating account..." : "Create account"}</Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <Link href="/login">Already have an account?</Link>
        <Link href="/forgot-password">Forgot password</Link>
      </div>
    </div>
  );
}
