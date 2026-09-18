"use client";

import { useEffect, useState } from "react";
import { StatsBody } from "@/app/components/StatsBody";
import { PeriodNav } from "@/app/components/PeriodNav";
import { currentMonthInTaipei, currentYearInTaipei, formatYearLabel, shiftYearString } from "@/lib/date";
import type { TransactionCategory } from "@/lib/openai";

type CategoryStat = { category: TransactionCategory; amount: number };
type MonthPoint = { month: string; amount: number };

type YearStatsData = {
  year: string;
  totalExpense: number;
  totalIncome: number;
  byCategory: CategoryStat[];
  byMonth: MonthPoint[];
};

export function YearStats({
  year,
  onYearChange,
  refreshToken,
}: {
  year: string;
  onYearChange: (year: string) => void;
  refreshToken: number;
}) {
  const [stats, setStats] = useState<YearStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const isCurrent = year === currentYearInTaipei();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/expenses/stats/yearly?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, refreshToken]);

  const visibleMonths = stats?.byMonth.filter((m) => !isCurrent || m.month <= currentMonthInTaipei()) ?? [];
  const maxMonthAmount = Math.max(...visibleMonths.map((m) => m.amount), 1);

  return (
    <div className="flex flex-col gap-4">
      <PeriodNav
        label={formatYearLabel(year)}
        isCurrent={isCurrent}
        onPrev={() => onYearChange(shiftYearString(year, -1))}
        onNext={() => onYearChange(shiftYearString(year, 1))}
        prevAriaLabel="上一年"
        nextAriaLabel="下一年"
      />

      {loading || !stats ? (
        <p className="px-4 py-12 text-center text-sm text-violet-900/40 dark:text-zinc-500">載入中...</p>
      ) : (
        <>
          <div className="card-surface rounded-2xl p-4">
            <p className="mb-3 text-sm font-medium text-violet-950 dark:text-zinc-50">每月支出趨勢</p>
            <div className="flex flex-col gap-2">
              {visibleMonths.map((point) => (
                <div key={point.month} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 text-xs text-violet-900/50 dark:text-zinc-400">
                    {Number(point.month.slice(5))}月
                  </span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-violet-100/70 dark:bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-[var(--series-1)]"
                      style={{
                        width: point.amount > 0 ? `${Math.max((point.amount / maxMonthAmount) * 100, 4)}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-medium text-violet-950 dark:text-zinc-50">
                    {point.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <StatsBody
            totalExpense={stats.totalExpense}
            totalIncome={stats.totalIncome}
            byCategory={stats.byCategory}
            emptyLabel="今年還沒有支出紀錄"
          />
        </>
      )}
    </div>
  );
}
