import { prisma } from "@/lib/db/prisma";
import { AdminOverview } from "@/components/admin/admin-overview";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [payments, users, products, activePurchases] = await Promise.all([
    prisma.payment.findMany({ where: { status: "SUCCESS", deletedAt: null } }).catch(() => []),
    prisma.user.count({ where: { deletedAt: null } }).catch(() => 0),
    prisma.subscriptionProduct.count({ where: { deletedAt: null } }).catch(() => 0),
    prisma.purchase.count({ where: { status: "ACTIVE", deletedAt: null } }).catch(() => 0),
  ]);

  const revenueKobo = payments.reduce((sum, payment) => sum + payment.amountKobo, 0);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Admin</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Operational overview</h1>
        <p className="mt-3 text-muted">Monitor the marketplace, payments, user growth, and subscription delivery health.</p>
      </div>
      <AdminOverview
        metrics={{
          revenueKobo,
          activeUsers: users,
          products,
          activePurchases,
        }}
      />
    </main>
  );
}
