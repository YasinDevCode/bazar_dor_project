export function formatBanglaNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number): string {
  return `৳${formatBanglaNumber(value)}`;
}