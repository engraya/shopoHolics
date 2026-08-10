"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand mark: a shopping bag with the Shopoholics "S" knocked out of it.
 * Geometry and colours are shared with `src/app/icon.svg` and
 * `scripts/generate-icons.js` — change all three together. The gradient is
 * deliberately fixed rather than theme-reactive, so the in-app logo, the
 * favicon and the app icon stay identical.
 */
export function LogoMark({ className }: { className?: string }) {
  // Instances share a document, so gradient/mask refs must be unique per render.
  const uid = useId();
  const gradientId = `logo-gradient-${uid}`;
  const maskId = `logo-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="0" x2="62" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0284C7" />
          <stop offset="0.5" stopColor="#0891B2" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
        <mask id={maskId}>
          <rect width="64" height="64" fill="#000" />
          {/* handle */}
          <path
            d="M20.892 27.524A11.5 11.5 0 0 1 43.108 27.524"
            fill="none"
            stroke="#fff"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          {/* body */}
          <rect x="14" y="25" width="36" height="28" rx="5.5" fill="#fff" />
          {/* "S", knocked back out of the body */}
          <path
            d="M38.1 32.2C37 30.3 34.6 29.6 32 29.6C28.7 29.6 25.9 31.9 25.9 34.6C25.9 37.2 28.2 38.4 32 39C35.8 39.6 38.1 40.8 38.1 43.4C38.1 46.1 35.3 48.4 32 48.4C29.4 48.4 27 47.7 25.9 45.8"
            fill="none"
            stroke="#000"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${gradientId})`} />
      <rect width="64" height="64" fill="#fff" mask={`url(#${maskId})`} />
    </svg>
  );
}

interface LogoProps {
  /** Hide the wordmark and render the mark alone (tight headers, avatars). */
  markOnly?: boolean;
  className?: string;
  markClassName?: string;
}

/** Horizontal lockup: mark + wordmark, sized by the surrounding text scale. */
export function Logo({ markOnly = false, className, markClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      {markOnly ? (
        <span className="sr-only">Shopoholics</span>
      ) : (
        <span className="text-lg font-bold tracking-tight text-foreground">Shopoholics</span>
      )}
    </span>
  );
}
