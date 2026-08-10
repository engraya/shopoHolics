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
 */
export function formatPrice(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
}

/** Format an amount held in minor units (kobo). */
export function formatMinor(minorUnits: number, currency = 'NGN'): string {
  return formatPrice(minorUnits / 100, currency);
}
