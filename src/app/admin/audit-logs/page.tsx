import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog
    .findMany({
      where: { deletedAt: null },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Admin</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Audit logs</h1>
      </div>
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="glass-card rounded-[28px] p-8 text-muted">No audit events recorded yet.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="glass-card rounded-[24px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{log.action}</div>
                  <div className="mt-1 text-sm text-muted">{log.entityType} · {log.entityId}</div>
                </div>
                <div className="text-right text-sm text-muted">
                  <div>{log.user?.email ?? "System"}</div>
                  <div>{new Date(log.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
