"use client";

import { addDaysToDateString, formatMonthLabel, getWeekDates, todayInTaipei } from "@/lib/date";

export function DateHeader({
  date,
  onChange,
  onOpenCalendar,
}: {
  date: string;
  onChange: (date: string) => void;
  onOpenCalendar: () => void;
}) {
  const today = todayInTaipei();
  const isCurrentWeek = getWeekDates(date).includes(today);

  function shiftWeek(delta: number) {
    onChange(addDaysToDateString(date, delta * 7));
  }

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        type="button"
        onClick={() => shiftWeek(-1)}
        aria-label="上一週"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 dark:text-zinc-400 dark:active:bg-white/10"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={onOpenCalendar}
        aria-label="選擇日期"
        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-violet-950 active:bg-violet-950/5 dark:text-zinc-50 dark:active:bg-white/10"
      >
        <span>{formatMonthLabel(date.slice(0, 7))}</span>
        <span aria-hidden>📅</span>
      </button>

      <button
        type="button"
        onClick={() => !isCurrentWeek && shiftWeek(1)}
        disabled={isCurrentWeek}
        aria-label="下一週"
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 disabled:opacity-30 dark:text-zinc-400 dark:active:bg-white/10"
      >
        ›
      </button>
    </div>
  );
}
