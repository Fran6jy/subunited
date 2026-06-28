import { NotificationList } from "@/components/notifications/notification-list";
import { getOptionalViewer } from "@/lib/auth/viewer";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="glass-card max-w-xl rounded-[28px] p-8 text-muted">Sign in to view your notification feed.</div>
      </main>
    );
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: viewer.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Notifications</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Your activity feed</h1>
      </div>
      <NotificationList notifications={notifications} />
    </main>
  );
}
