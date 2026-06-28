import { formatDistanceToNowStrict } from "date-fns";
import { formatNaira } from "@/lib/utils";
import type { getDashboardData } from "@/lib/services/dashboard";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export function DashboardShell({ data, customerName }: { data: DashboardData; customerName: string }) {
  const cards = [
    {
      title: "Wallet Balance",
      value: formatNaira(data.walletBalanceKobo),
      helper: "Available for purchases and renewals",
    },
    {
      title: "Active Subscriptions",
      value: String(data.stats.activeSubscriptions),
      helper: "Currently unlocked products",
    },
    {
      title: "Pending Renewals",
      value: String(data.stats.pendingRenewals),
      helper: "Expiring within 7 days",
    },
    {
      title: "OTP Enabled",
      value: String(data.stats.otpEnabledProducts),
      helper: "Products with secure one-time codes",
    },
  ];

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-muted">Dashboard</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Welcome back, {customerName}</h1>
          <p className="mt-3 text-muted">Manage access, renew subscriptions, reveal credentials, and monitor activity in real time.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="glass-card rounded-[28px] p-5">
            <div className="text-sm text-muted">{card.title}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
            <div className="mt-2 text-sm text-muted">{card.helper}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Current subscriptions</h2>
          <div className="mt-5 space-y-4">
            {data.purchases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-muted">
                No subscriptions yet. Your purchases will appear here after payment and activation.
              </div>
            ) : (
              data.purchases.map((purchase) => (
                <div key={purchase.id} className="rounded-3xl border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{purchase.product.name}</div>
                      <div className="mt-1 text-sm text-muted">
                        {purchase.expiresAt
                          ? `Expires ${formatDistanceToNowStrict(new Date(purchase.expiresAt), { addSuffix: true })}`
                          : "Awaiting activation window"}
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                      {purchase.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="glass-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Recent notifications</h2>
          <div className="mt-5 space-y-4 text-sm text-muted">
            {data.notifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-4">No notifications yet.</div>
            ) : (
              data.notifications.map((notification) => (
                <div key={notification.id} className="rounded-3xl border border-white/10 p-4">
                  <div className="font-medium text-foreground">{notification.title}</div>
                  <div className="mt-1">{notification.message}</div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
