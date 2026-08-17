"use client";

import { useEffect, useState } from "react";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Midnight at the end of the coming Sunday, in the visitor's own timezone. */
function nextDeadline(from: Date) {
  const end = new Date(from);
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7));
  return end;
}

function split(ms: number): Remaining {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

export default function CountdownTimer() {
  // Stays null through the server render and first paint so the markup matches.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const deadline = nextDeadline(new Date());
    const tick = () => setRemaining(split(deadline.getTime() - Date.now()));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      role="timer"
      aria-label="Time remaining in this sale"
    >
      {UNITS.map(({ key, label }, index) => (
        <div key={key} className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-[3.75rem] rounded-xl border border-white/15 bg-white/10 px-2 py-2 text-center backdrop-blur sm:min-w-[4.25rem] sm:py-2.5">
            <span className="block font-mono text-xl font-bold tabular-nums text-white sm:text-2xl">
              {remaining
                ? String(remaining[key]).padStart(2, "0")
                : "--"}
            </span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-white/60">
              {label}
            </span>
          </div>
          {index < UNITS.length - 1 && (
            <span aria-hidden className="text-lg font-bold text-white/30">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
