"use client";

import { CATEGORY_EMOJI } from "@/lib/categoryMeta";
import type { TransactionCategory } from "@/lib/openai";

type CategoryStat = { category: TransactionCategory; amount: number };

export function StatsBody({
  totalExpense,
  totalIncome,
  byCategory,
  emptyLabel,
}: {
  totalExpense: number;
  totalIncome: number;
  byCategory: CategoryStat[];
  emptyLabel: string;
}) {
  const maxAmount = Math.max(...byCategory.map((c) => c.amount), 1);

  return (
    <>
      <div className="flex gap-3">
        <div className="card-surface flex-1 rounded-2xl p-4">
          <p className="text-xs text-violet-900/40 dark:text-zinc-500">支出</p>
          <p className="mt-1 text-2xl font-semibold text-violet-950 dark:text-zinc-50">
            NT$ {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="card-surface flex-1 rounded-2xl p-4">
          <p className="text-xs text-violet-900/40 dark:text-zinc-500">收入</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-500 dark:text-emerald-400">
            NT$ {totalIncome.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card-surface rounded-2xl p-4">
        <p className="mb-3 text-sm font-medium text-violet-950 dark:text-zinc-50">各項目花費</p>
        {byCategory.length === 0 ? (
          <p className="py-6 text-center text-sm text-violet-900/40 dark:text-zinc-500">{emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {byCategory.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <span className="w-6 text-center text-base">{CATEGORY_EMOJI[item.category]}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex justify-between text-xs text-violet-900/50 dark:text-zinc-400">
                    <span>{item.category}</span>
                    <span className="font-medium text-violet-950 dark:text-zinc-50">
                      NT$ {item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-violet-100/70 dark:bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-[var(--series-1)]"
                      style={{ width: `${Math.max((item.amount / maxAmount) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
