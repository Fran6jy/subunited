import { formatNaira } from "@/lib/utils";

type AdminOverviewProps = {
  metrics: {
    revenueKobo: number;
    activeUsers: number;
    products: number;
    activePurchases: number;
  };
};

export function AdminOverview({ metrics }: AdminOverviewProps) {
  const cards = [
    { title: "Revenue", value: formatNaira(metrics.revenueKobo) },
    { title: "Active Users", value: String(metrics.activeUsers) },
    { title: "Products", value: String(metrics.products) },
    { title: "Active Purchases", value: String(metrics.activePurchases) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="glass-card rounded-[28px] p-5">
          <div className="text-sm text-muted">{card.title}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
