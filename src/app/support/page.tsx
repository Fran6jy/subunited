import { SupportTicketList } from "@/components/support/support-ticket-list";
import { getOptionalViewer } from "@/lib/auth/viewer";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to access support tickets and service updates.</div>
      </main>
    );
  }

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: viewer.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Support</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Help and issue tracking</h1>
      </div>
      <SupportTicketList tickets={tickets} />
    </main>
  );
}
