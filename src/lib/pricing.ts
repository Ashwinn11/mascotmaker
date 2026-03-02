export interface Plan {
  name: string;
  credits: number;
  priceLabel: string;
  variantId: string;
  popular: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Starter",
    credits: 100,
    priceLabel: "$4.99/mo",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_100 || "",
    popular: false,
  },
  {
    name: "Pro",
    credits: 500,
    priceLabel: "$19.99/mo",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_500 || "",
    popular: true,
  },
  {
    name: "Ultra",
    credits: 1500,
    priceLabel: "$49.99/mo",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_1500 || "",
    popular: false,
  },
];

export function getPlanByVariantId(variantId: string): Plan | undefined {
  return PLANS.find((p) => p.variantId === variantId);
}

export function getPlanCredits(variantId: string): number {
  return getPlanByVariantId(variantId)?.credits ?? 100;
}
