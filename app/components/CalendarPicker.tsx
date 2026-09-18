"use client";

import { useState } from "react";
import {
  WEEKDAY_LABELS,
  currentMonthInTaipei,
  formatMonthLabel,
  shiftMonthString,
  taipeiMonthDays,
  todayInTaipei,
} from "@/lib/date";

export function CalendarPicker({
  initialDate,
  onSelect,
  onClose,
}: {
  initialDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const [viewMonth, setViewMonth] = useState(initialDate.slice(0, 7));
  const today = todayInTaipei();
  const isCurrentMonth = viewMonth === currentMonthInTaipei();
  const days = taipeiMonthDays(viewMonth);
  const leadingBlanks = days[0]?.weekday ?? 0;

  return (
    <div className="absolute inset-0 z-30 flex items-start bg-violet-950/30 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="w-full rounded-b-3xl bg-white p-5 shadow-2xl dark:bg-[#1c1930]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(shiftMonthString(viewMonth, -1))}
            aria-label="上個月"
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 dark:text-zinc-400 dark:active:bg-white/10"
          >
            ‹
          </button>
          <span className="text-base font-semibold text-violet-950 dark:text-zinc-50">
            {formatMonthLabel(viewMonth)}
          </span>
          <button
            type="button"
            onClick={() => !isCurrentMonth && setViewMonth(shiftMonthString(viewMonth, 1))}
            disabled={isCurrentMonth}
            aria-label="下個月"
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 disabled:opacity-30 dark:text-zinc-400 dark:active:bg-white/10"
          >
            ›
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-xs text-violet-900/40 dark:text-zinc-500">
          {WEEKDAY_LABELS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map(({ day, dateStr }) => {
            const isFuture = dateStr > today;
            const isToday = dateStr === today;
            const isSelected = dateStr === initialDate;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isFuture}
                onClick={() => {
                  onSelect(dateStr);
                  onClose();
                }}
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isFuture
                    ? "text-violet-900/15 dark:text-zinc-700"
                    : isSelected
                      ? "bg-violet-500 text-white"
                      : isToday
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-violet-950 active:bg-violet-950/5 dark:text-zinc-50 dark:active:bg-white/10"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
