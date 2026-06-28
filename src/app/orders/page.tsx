import { getOptionalViewer } from "@/lib/auth/viewer";
import { prisma } from "@/lib/db/prisma";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to view your orders.</div>
      </main>
    );
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: viewer.id, deletedAt: null },
    include: { product: true, payments: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Orders</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Purchase history</h1>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{purchase.product.name}</div>
                <div className="mt-1 text-sm text-muted">{purchase.status}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatNaira(purchase.pricePaidKobo)}</div>
                <div className="text-xs text-muted">{new Date(purchase.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
