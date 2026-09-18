import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("請在 .env.local 中設定 OPENAI_API_KEY");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const TRANSACTION_CATEGORIES = [
  "餐飲",
  "交通",
  "購物",
  "娛樂",
  "居家生活",
  "醫療保健",
  "教育學習",
  "訂閱服務",
  "旅遊",
  "薪資",
  "投資",
  "其他",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];
export type TransactionType = "expense" | "income";

export interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  currency: string;
  category: TransactionCategory;
  description: string;
  occurredAt: string | null;
}

export interface ExpenseAnalysis {
  items: ParsedTransaction[];
  summary: string;
}

const INSTRUCTIONS = `你是一個記帳助理，負責把使用者用自然語言描述的花費或收入，解析成結構化資料。

規則：
- 一段文字可能包含多筆帳，請逐筆拆開。
- amount 一律為正數，用 type 區分支出（expense）與收入（income）。
- 金額若使用「一百二」「兩千」等中文數字，請換算成阿拉伯數字。
- 未特別說明幣別時，currency 使用 TWD。
- category 只能從允許的清單中挑選，無法判斷時用「其他」。
- 只在文字明確提到日期或時間時才填 occurredAt（例如「昨天」也要換算成實際日期），否則為 null。
- 若文字完全沒有可記帳的內容，items 回傳空陣列，並在 summary 說明原因。`;

export async function analyzeExpenseText(text: string): Promise<ExpenseAnalysis> {
  const today = new Date().toISOString().slice(0, 10);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `${INSTRUCTIONS}\n\n今天的日期是 ${today}，換算相對日期時以此為準。category 允許的清單：${TRANSACTION_CATEGORIES.join("、")}。occurredAt 有值時請用 YYYY-MM-DD 格式。`,
      },
      { role: "user", content: text },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "expense_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["expense", "income"] },
                  amount: { type: "number", minimum: 0 },
                  currency: { type: "string" },
                  category: { type: "string", enum: TRANSACTION_CATEGORIES },
                  description: { type: "string" },
                  occurredAt: { type: ["string", "null"] },
                },
                required: ["type", "amount", "currency", "category", "description", "occurredAt"],
                additionalProperties: false,
              },
            },
            summary: { type: "string" },
          },
          required: ["items", "summary"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI 分析失敗，請稍後再試");
  }

  return JSON.parse(content) as ExpenseAnalysis;
}
