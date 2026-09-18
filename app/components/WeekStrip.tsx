"use client";

import { WEEKDAY_LABELS, getWeekDates, todayInTaipei } from "@/lib/date";

export function WeekStrip({ date, onChange }: { date: string; onChange: (date: string) => void }) {
  const today = todayInTaipei();
  const weekDates = getWeekDates(date);

  return (
    <div className="grid grid-cols-7 px-4 pb-2">
      {weekDates.map((d, i) => {
        const isFuture = d > today;
        const isSelected = d === date;
        const isToday = d === today;
        const day = Number(d.slice(8, 10));

        return (
          <button
            key={d}
            type="button"
            disabled={isFuture}
            onClick={() => onChange(d)}
            className="flex flex-col items-center gap-1 py-1"
          >
            <span
              className={`text-xs ${isFuture ? "text-violet-900/15 dark:text-zinc-700" : "text-violet-900/40 dark:text-zinc-400"}`}
            >
              {WEEKDAY_LABELS[i]}
            </span>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isFuture
                  ? "text-violet-900/15 dark:text-zinc-700"
                  : isSelected
                    ? "bg-violet-500 text-white"
                    : isToday
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-violet-950 dark:text-zinc-50"
              }`}
            >
              {day}
            </span>
          </button>
        );
      })}
    </div>
  );
}
