"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/types";
import { CATEGORY_EMOJI } from "@/lib/categoryMeta";

export function TransactionList({ date, refreshToken }: { date: string; refreshToken: number }) {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/expenses?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setExpenses(data.expenses ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, refreshToken]);

  if (loading) {
    return <p className="px-4 py-12 text-center text-sm text-violet-900/40 dark:text-zinc-500">載入中...</p>;
  }

  const totalExpense = expenses.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = expenses.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {expenses.length > 0 && (
        <div className="card-surface flex justify-around rounded-2xl py-3 text-sm">
          <span className="text-rose-500 dark:text-rose-400">支出 NT$ {totalExpense.toLocaleString()}</span>
          <span className="text-emerald-500 dark:text-emerald-400">收入 NT$ {totalIncome.toLocaleString()}</span>
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-violet-900/40 dark:text-zinc-500">這天還沒有記帳紀錄</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense._id} className="card-surface flex items-center gap-3 rounded-2xl p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100/80 text-lg dark:bg-zinc-800">
              {CATEGORY_EMOJI[expense.category]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-violet-950 dark:text-zinc-50">
                {expense.description}
              </p>
              <p className="text-xs text-violet-900/40 dark:text-zinc-500">
                {expense.category} · {expense.userName}
              </p>
            </div>
            <span
              className={`shrink-0 text-sm font-semibold ${
                expense.type === "income"
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-violet-950 dark:text-zinc-50"
              }`}
            >
              {expense.type === "income" ? "+" : "-"}
              {expense.amount.toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
