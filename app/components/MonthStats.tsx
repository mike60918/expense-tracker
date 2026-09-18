"use client";

import { useEffect, useState } from "react";
import { StatsBody } from "@/app/components/StatsBody";
import { PeriodNav } from "@/app/components/PeriodNav";
import { currentMonthInTaipei, formatMonthLabel, shiftMonthString } from "@/lib/date";
import type { TransactionCategory } from "@/lib/openai";

type CategoryStat = { category: TransactionCategory; amount: number };

type MonthStatsData = {
  month: string;
  totalExpense: number;
  totalIncome: number;
  byCategory: CategoryStat[];
};

export function MonthStats({
  month,
  onMonthChange,
  refreshToken,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  refreshToken: number;
}) {
  const [stats, setStats] = useState<MonthStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const isCurrent = month === currentMonthInTaipei();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/expenses/stats?month=${month}`)
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
  }, [month, refreshToken]);

  return (
    <div className="flex flex-col gap-4">
      <PeriodNav
        label={formatMonthLabel(month)}
        isCurrent={isCurrent}
        onPrev={() => onMonthChange(shiftMonthString(month, -1))}
        onNext={() => onMonthChange(shiftMonthString(month, 1))}
        prevAriaLabel="上個月"
        nextAriaLabel="下個月"
      />

      {loading || !stats ? (
        <p className="px-4 py-12 text-center text-sm text-violet-900/40 dark:text-zinc-500">載入中...</p>
      ) : (
        <StatsBody
          totalExpense={stats.totalExpense}
          totalIncome={stats.totalIncome}
          byCategory={stats.byCategory}
          emptyLabel="這個月還沒有支出紀錄"
        />
      )}
    </div>
  );
}
