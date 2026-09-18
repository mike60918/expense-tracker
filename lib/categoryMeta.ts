import type { TransactionCategory } from "@/lib/openai";

export const CATEGORY_EMOJI: Record<TransactionCategory, string> = {
  餐飲: "🍜",
  交通: "🚗",
  購物: "🛍️",
  娛樂: "🎮",
  居家生活: "🏠",
  醫療保健: "💊",
  教育學習: "📚",
  訂閱服務: "📱",
  旅遊: "✈️",
  薪資: "💰",
  投資: "📈",
  其他: "🗂️",
};
