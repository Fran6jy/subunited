import { getOptionalViewer } from "@/lib/auth/viewer";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to manage account settings.</div>
      </main>
    );
  }

  const settings = [
    ["Email", viewer.email],
    ["Role", viewer.role],
    ["Email verified", viewer.emailVerified ? "Verified" : "Pending"],
    ["Two-factor authentication", viewer.twoFactorEnabled ? "Enabled" : "Disabled"],
    ["Referral code", viewer.referralCode ?? "Generated after first purchase"],
  ];

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8 max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Settings</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Account and security</h1>
        <p className="mt-3 text-muted">Review your identity, trusted access controls, and notification preferences.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-card rounded-[28px] p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl font-semibold text-emerald-300">
            {(viewer.name ?? viewer.email).slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-5 text-2xl font-semibold">{viewer.name ?? "SubUnited customer"}</h2>
          <p className="mt-2 text-sm text-muted">Member since {new Date(viewer.createdAt).toLocaleDateString()}</p>
        </section>

        <section className="glass-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Profile details</h2>
          <div className="mt-5 divide-y divide-white/10">
            {settings.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-4">
                <div className="text-sm text-muted">{label}</div>
                <div className="text-right text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
