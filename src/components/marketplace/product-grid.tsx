"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { usePurchaseInitialization } from "@/hooks/use-purchase-actions";

type Product = {
  id: string;
  name: string;
  description: string;
  monthlyPriceKobo: number;
  quarterlyPriceKobo: number | null;
  annualPriceKobo: number | null;
  requiresOtp: boolean;
  category: { name: string };
};

export function ProductGrid({ products }: { products: Product[] }) {
  const [email, setEmail] = useState("customer@subunited.app");
  const purchaseMutation = usePurchaseInitialization();

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[28px] p-5">
        <label className="mb-2 block text-sm text-muted">Checkout email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 outline-none transition focus:border-primary"
          placeholder="customer@subunited.app"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="glass-card rounded-[28px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-muted">{product.category.name}</div>
                <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{product.requiresOtp ? "OTP" : "Standard"}</div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">{product.description}</p>
            <div className="mt-5 text-2xl font-semibold">{formatNaira(product.monthlyPriceKobo)}</div>
            <div className="mt-1 text-sm text-muted">Monthly plan</div>
            <Button
              className="mt-5 w-full"
              onClick={async () => {
                const result = await purchaseMutation.mutateAsync({
                  productId: product.id,
                  billingCycle: "monthly",
                  provider: "PAYSTACK",
                  email,
                });

                if (result.authorizationUrl) {
                  window.open(result.authorizationUrl, "_blank", "noopener,noreferrer");
                }
              }}
            >
              {purchaseMutation.isPending ? "Preparing checkout..." : "Buy now"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
