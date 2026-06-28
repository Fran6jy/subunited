import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const events = await prisma.webhookEvent
    .findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Admin</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Webhook events</h1>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="glass-card rounded-[28px] p-8 text-muted">Payment webhook events will appear here after provider callbacks are received.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="glass-card rounded-[24px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{event.provider} · {event.eventType}</div>
                  <div className="mt-1 text-sm text-muted">{event.processedAt ? "Processed" : "Waiting for processing"}</div>
                </div>
                <div className="text-right text-sm text-muted">{new Date(event.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
