// A product without a stock value doesn't track inventory and is always
// available. This matches the checks in createCheckoutSession and the webhook.
type Stocked = { stock?: number | null };

export const isOutOfStock = (product?: Stocked | null) =>
  typeof product?.stock === "number" && product.stock <= 0;

export const canAddMore = (product: Stocked | null | undefined, inCart: number) =>
  typeof product?.stock !== "number" || product.stock > inCart;
