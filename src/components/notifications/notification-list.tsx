type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
};

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="glass-card rounded-[28px] p-6 text-sm text-muted">No notifications yet.</div>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="glass-card rounded-[28px] p-5">
            <div className="font-medium">{notification.title}</div>
            <div className="mt-2 text-sm text-muted">{notification.message}</div>
            <div className="mt-3 text-xs text-muted">{new Date(notification.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
