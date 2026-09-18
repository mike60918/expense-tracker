import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { currentYearInTaipei, taipeiYearRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/auth";

const YEAR_PATTERN = /^\d{4}$/;

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const yearParam = request.nextUrl.searchParams.get("year");
  const year = yearParam && YEAR_PATTERN.test(yearParam) ? yearParam : currentYearInTaipei();

  await connectToDatabase();
  const { start, end: yearEnd } = taipeiYearRange(year);
  const now = new Date();
  const end = now < yearEnd ? now : yearEnd;

  const [byCategory, totals, byMonthRaw] = await Promise.all([
    Expense.aggregate([
      { $match: { type: "expense", occurredAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]),
    Expense.aggregate([
      { $match: { occurredAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", amount: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { type: "expense", occurredAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$occurredAt", timezone: "+08:00" } },
          amount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const totalExpense = totals.find((t) => t._id === "expense")?.amount ?? 0;
  const totalIncome = totals.find((t) => t._id === "income")?.amount ?? 0;

  const monthMap = new Map<string, number>(byMonthRaw.map((m) => [m._id as string, m.amount as number]));
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const month = `${year}-${String(i + 1).padStart(2, "0")}`;
    return { month, amount: monthMap.get(month) ?? 0 };
  });

  return NextResponse.json({
    year,
    totalExpense,
    totalIncome,
    byCategory: byCategory.map((c) => ({ category: c._id as string, amount: c.amount as number })),
    byMonth,
  });
}
