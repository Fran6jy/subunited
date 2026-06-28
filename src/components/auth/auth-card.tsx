import Link from "next/link";
import { Button } from "@/components/ui/button";

type AuthCardProps = {
  title: string;
  description: string;
  primaryLabel: string;
  footer?: React.ReactNode;
};

export function AuthCard({ title, description, primaryLabel, footer }: AuthCardProps) {
  return (
    <div className="glass-card w-full max-w-md rounded-[32px] p-8">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Authentication</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted">{description}</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-muted" htmlFor="email">Email</label>
          <input id="email" type="email" className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none ring-0 transition focus:border-primary" placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted" htmlFor="password">Password</label>
          <input id="password" type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none ring-0 transition focus:border-primary" placeholder="••••••••" />
        </div>
        <Button className="w-full" size="lg" type="submit">{primaryLabel}</Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <Link href="/forgot-password">Forgot password</Link>
        <Link href="/signup">Create account</Link>
      </div>

      {footer ? <div className="mt-6 text-sm text-muted">{footer}</div> : null}
    </div>
  );
}
