import { prisma } from "@/lib/db/prisma";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const products = await prisma.subscriptionProduct
    .findMany({
      where: {
        deletedAt: null,
        visibility: "PUBLIC",
        status: "ACTIVE",
      },
      include: { category: true },
      orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
      take: 24,
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8 max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">
          Marketplace
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Browse premium digital access products
        </h1>
        <p className="mt-3 text-muted">
          Instant activation, localized payments, secure credentials, and
          automated renewals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product: (typeof products)[number]) => (
          <div key={product.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-muted">
                  {product.category.name}
                </div>
                <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                {product.requiresOtp ? "OTP" : "Instant"}
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
              {product.description}
            </p>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-sm text-muted">Starting at</div>
                <div className="text-2xl font-semibold">
                  {formatNaira(product.monthlyPriceKobo)}
                </div>
              </div>
              <div className="text-sm text-emerald-300">Available</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
