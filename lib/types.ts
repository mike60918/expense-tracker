import type { TransactionCategory, TransactionType } from "@/lib/openai";

export interface Transaction {
  _id: string;
  rawText: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: TransactionCategory;
  description: string;
  occurredAt: string;
  createdAt: string;
  userName: string;
}
