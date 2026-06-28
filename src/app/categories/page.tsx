import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category
    .findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      include: {
        products: {
          where: { deletedAt: null, status: "ACTIVE", visibility: "PUBLIC" },
          orderBy: { popularityScore: "desc" },
          take: 4,
        },
      },
      orderBy: { name: "asc" },
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8 max-w-3xl">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Categories</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Browse by subscription type</h1>
        <p className="mt-3 text-muted">Explore AI, streaming, education, VPN, cloud, and productivity products from one curated catalog.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link key={category.id} href="/marketplace" className="glass-card rounded-[28px] p-6 transition hover:border-primary/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{category.products.length} live</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {category.products.map((product) => (
                <span key={product.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{product.name}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
