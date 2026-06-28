import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const products = await prisma.subscriptionProduct
    .findMany({
      where: { deletedAt: null, status: "ACTIVE", visibility: "PUBLIC" },
      include: { category: true },
      orderBy: [{ popularityScore: "desc" }, { monthlyPriceKobo: "asc" }],
      take: 12,
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8 max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Pricing</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Transparent access plans</h1>
        <p className="mt-3 text-muted">Compare monthly, quarterly, and annual prices across verified digital subscription products.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="glass-card rounded-[28px] p-6">
            <div className="text-sm text-muted">{product.category.name}</div>
            <h2 className="mt-2 text-2xl font-semibold">{product.name}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{product.description}</p>
            <div className="mt-6 space-y-3">
              <PriceRow label="Monthly" value={product.monthlyPriceKobo} />
              <PriceRow label="Quarterly" value={product.quarterlyPriceKobo} />
              <PriceRow label="Annual" value={product.annualPriceKobo} />
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href="/marketplace">Buy access</Link>
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}

function PriceRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-semibold">{value ? formatNaira(value) : "On request"}</span>
    </div>
  );
}
