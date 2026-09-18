"use client";

import { useState } from "react";
import { MonthStats } from "@/app/components/MonthStats";
import { YearStats } from "@/app/components/YearStats";
import { currentMonthInTaipei, currentYearInTaipei } from "@/lib/date";

type Period = "month" | "year";

export function StatsView({ refreshToken }: { refreshToken: number }) {
  const [period, setPeriod] = useState<Period>("month");
  const [month, setMonth] = useState(currentMonthInTaipei());
  const [year, setYear] = useState(currentYearInTaipei());

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 pt-1">
      <div className="flex rounded-full bg-violet-100/70 p-1 text-sm dark:bg-zinc-900">
        <PeriodButton label="月" isActive={period === "month"} onClick={() => setPeriod("month")} />
        <PeriodButton label="年" isActive={period === "year"} onClick={() => setPeriod("year")} />
      </div>

      {period === "month" ? (
        <MonthStats month={month} onMonthChange={setMonth} refreshToken={refreshToken} />
      ) : (
        <YearStats year={year} onYearChange={setYear} refreshToken={refreshToken} />
      )}
    </div>
  );
}

function PeriodButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
        isActive
          ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-700 dark:text-violet-400"
          : "text-violet-900/40 dark:text-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}
