import { prisma } from "@/lib/db/prisma";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [payments, purchases] = await Promise.all([
    prisma.payment.findMany({ where: { deletedAt: null, status: "SUCCESS" } }).catch(() => []),
    prisma.purchase.findMany({ where: { deletedAt: null }, include: { product: true } }).catch(() => []),
  ]);

  const revenueKobo = payments.reduce((sum, payment) => sum + payment.amountKobo, 0);
  const topProducts = Object.values(
    purchases.reduce<Record<string, { name: string; count: number }>>((accumulator, purchase) => {
      const current = accumulator[purchase.productId] ?? { name: purchase.product.name, count: 0 };
      current.count += 1;
      accumulator[purchase.productId] = current;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Admin analytics</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Revenue and product trends</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-card rounded-[28px] p-6">
          <div className="text-sm text-muted">Gross revenue</div>
          <div className="mt-3 text-4xl font-semibold">{formatNaira(revenueKobo)}</div>
          <div className="mt-3 text-sm text-muted">Based on successful recorded payments.</div>
        </section>

        <section className="glass-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Popular products</h2>
          <div className="mt-5 space-y-4">
            {topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-3xl border border-white/10 p-4">
                <div>{product.name}</div>
                <div className="text-sm text-muted">{product.count} purchases</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
