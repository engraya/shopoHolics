import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Money convention for this app:
 *   - Product prices and cart totals are WHOLE NAIRA  -> formatPrice()
 *   - Anything named *Cents (DB columns, Paystack amounts) is in MINOR UNITS
 *     i.e. kobo, where 1 NGN = 100 kobo                -> formatMinor()
 * Rule of thumb: an identifier ending in `Cents` is never passed to formatPrice.
 *
 * The `*Cents` DB columns are BigInt, so Prisma types them as `bigint`.
 * formatMinor accepts either, which lets a server component render a row
 * straight from Prisma without converting first.
 */
export function formatPrice(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
}

/** Format an amount held in minor units (kobo). */
export function formatMinor(minorUnits: number | bigint, currency = 'NGN'): string {
  return formatPrice(Number(minorUnits) / 100, currency);
}
