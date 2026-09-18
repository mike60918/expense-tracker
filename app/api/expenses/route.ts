import { NextRequest, NextResponse } from "next/server";
import { analyzeExpenseText } from "@/lib/openai";
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { taipeiDayRange, todayInTaipei } from "@/lib/date";
import { getCurrentUser } from "@/lib/auth";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const body = await request.json();
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "請輸入記帳文字" }, { status: 400 });
  }

  const analysis = await analyzeExpenseText(text);

  if (analysis.items.length === 0) {
    return NextResponse.json({ summary: analysis.summary, expenses: [] });
  }

  await connectToDatabase();
  const saved = await Expense.insertMany(
    analysis.items.map((item) => ({
      rawText: text,
      type: item.type,
      amount: item.amount,
      currency: item.currency,
      category: item.category,
      description: item.description,
      occurredAt: taipeiDayRange(item.occurredAt ?? todayInTaipei()).start,
      userId: user.userId,
      userName: user.name,
    }))
  );

  return NextResponse.json({ summary: analysis.summary, expenses: saved });
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const dateParam = request.nextUrl.searchParams.get("date");
  const date = dateParam && DATE_PATTERN.test(dateParam) ? dateParam : todayInTaipei();

  await connectToDatabase();
  const { start, end } = taipeiDayRange(date);
  const expenses = await Expense.find({
    occurredAt: { $gte: start, $lt: end },
  }).sort({ createdAt: 1 });

  return NextResponse.json({ date, expenses });
}
