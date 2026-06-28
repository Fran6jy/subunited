import { BillingSummary } from "@/components/billing/billing-summary";
import { prisma } from "@/lib/db/prisma";
import { getOptionalViewer } from "@/lib/auth/viewer";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to view billing history and wallet activity.</div>
      </main>
    );
  }

  const [wallet, payments] = await Promise.all([
    prisma.wallet.findFirst({ where: { userId: viewer.id, deletedAt: null } }),
    prisma.payment.findMany({
      where: {
        purchase: { userId: viewer.id },
        deletedAt: null,
      },
      include: { purchase: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const successfulPayments = payments.filter((payment) => payment.status === "SUCCESS");
  const totalSpentKobo = successfulPayments.reduce((sum, payment) => sum + payment.amountKobo, 0);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Billing</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Wallets, invoices, and payments</h1>
      </div>

      <BillingSummary
        walletBalanceKobo={wallet?.balanceKobo ?? 0}
        totalSpentKobo={totalSpentKobo}
        successfulPayments={successfulPayments.length}
      />

      <div className="mt-8 space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{payment.purchase?.product.name ?? "Marketplace order"}</div>
                <div className="mt-1 text-sm text-muted">{payment.provider} • {payment.status}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatNaira(payment.amountKobo)}</div>
                <div className="text-xs text-muted">{new Date(payment.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
