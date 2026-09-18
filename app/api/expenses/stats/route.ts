import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { currentMonthInTaipei, taipeiMonthRange } from "@/lib/date";
import { getCurrentUser } from "@/lib/auth";

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const monthParam = request.nextUrl.searchParams.get("month");
  const month = monthParam && MONTH_PATTERN.test(monthParam) ? monthParam : currentMonthInTaipei();

  await connectToDatabase();
  const { start, end: monthEnd } = taipeiMonthRange(month);
  const now = new Date();
  const end = now < monthEnd ? now : monthEnd;

  const [byCategory, totals] = await Promise.all([
    Expense.aggregate([
      { $match: { type: "expense", occurredAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]),
    Expense.aggregate([
      { $match: { occurredAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", amount: { $sum: "$amount" } } },
    ]),
  ]);

  const totalExpense = totals.find((t) => t._id === "expense")?.amount ?? 0;
  const totalIncome = totals.find((t) => t._id === "income")?.amount ?? 0;

  return NextResponse.json({
    month,
    totalExpense,
    totalIncome,
    byCategory: byCategory.map((c) => ({ category: c._id as string, amount: c.amount as number })),
  });
}
