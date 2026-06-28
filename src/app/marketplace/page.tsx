import { prisma } from "@/lib/db/prisma";
import { ProductGrid } from "@/components/marketplace/product-grid";

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

      <ProductGrid products={products} />
    </main>
  );
}
