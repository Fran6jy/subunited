import { formatNaira } from "@/lib/utils";

type BillingSummaryProps = {
  walletBalanceKobo: number;
  totalSpentKobo: number;
  successfulPayments: number;
};

export function BillingSummary({ walletBalanceKobo, totalSpentKobo, successfulPayments }: BillingSummaryProps) {
  const cards = [
    { title: "Wallet balance", value: formatNaira(walletBalanceKobo) },
    { title: "Total spent", value: formatNaira(totalSpentKobo) },
    { title: "Successful payments", value: String(successfulPayments) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="glass-card rounded-[28px] p-5">
          <div className="text-sm text-muted">{card.title}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
