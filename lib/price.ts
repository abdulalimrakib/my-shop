// `price` in Sanity is what the customer pays; `discount` is the percentage
// already taken off. So the original price is price / (1 - discount/100).
export const originalPrice = (price: number, discount?: number | null) => {
  if (!discount || discount <= 0 || discount >= 100) return price;
  return Math.round((price / (1 - discount / 100)) * 100) / 100;
};
