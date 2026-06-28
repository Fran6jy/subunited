type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
};

export function SupportTicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="glass-card rounded-[28px] p-6 text-sm text-muted">No support tickets created yet.</div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="font-medium">{ticket.subject}</div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{ticket.status}</div>
            </div>
            <div className="mt-3 text-sm text-muted">{ticket.message}</div>
            <div className="mt-3 text-xs text-muted">{new Date(ticket.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
