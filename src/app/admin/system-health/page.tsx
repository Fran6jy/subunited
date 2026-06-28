import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSystemHealthPage() {
  const [failedPayments, failedJobs, webhooks] = await Promise.all([
    prisma.payment.count({ where: { status: "FAILED", deletedAt: null } }).catch(() => 0),
    prisma.backgroundJob.count({ where: { status: "FAILED", deletedAt: null } }).catch(() => 0),
    prisma.webhookEvent.count({ where: { deletedAt: null } }).catch(() => 0),
  ]);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">System health</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Operational reliability snapshot</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-[28px] p-5">
          <div className="text-sm text-muted">Failed payments</div>
          <div className="mt-3 text-3xl font-semibold">{failedPayments}</div>
        </div>
        <div className="glass-card rounded-[28px] p-5">
          <div className="text-sm text-muted">Failed jobs</div>
          <div className="mt-3 text-3xl font-semibold">{failedJobs}</div>
        </div>
        <div className="glass-card rounded-[28px] p-5">
          <div className="text-sm text-muted">Webhook events</div>
          <div className="mt-3 text-3xl font-semibold">{webhooks}</div>
        </div>
      </div>
    </main>
  );
}
