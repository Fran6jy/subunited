import { getOptionalViewer } from "@/lib/auth/viewer";
import { getDashboardData } from "@/lib/services/dashboard";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to manage subscriptions.</div>
      </main>
    );
  }

  const data = await getDashboardData(viewer.id);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Subscriptions</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Active and expiring access</h1>
      </div>

      <div className="space-y-4">
        {data.purchases.map((purchase) => (
          <div key={purchase.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{purchase.product.name}</div>
                <div className="mt-1 text-sm text-muted">{purchase.expiresAt ? new Date(purchase.expiresAt).toLocaleString() : "Pending activation"}</div>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{purchase.status}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
