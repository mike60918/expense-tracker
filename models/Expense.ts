import mongoose, { Schema, models, model } from "mongoose";
import { TRANSACTION_CATEGORIES, type TransactionCategory, type TransactionType } from "@/lib/openai";

export interface ExpenseDocument extends mongoose.Document {
  rawText: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: TransactionCategory;
  description: string;
  occurredAt: Date;
  userId: mongoose.Types.ObjectId;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<ExpenseDocument>(
  {
    rawText: { type: String, required: true },
    type: { type: String, required: true, enum: ["expense", "income"] },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "TWD" },
    category: { type: String, required: true, enum: TRANSACTION_CATEGORIES },
    description: { type: String, required: true },
    occurredAt: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

ExpenseSchema.index({ occurredAt: 1 });

export default models.Expense || model<ExpenseDocument>("Expense", ExpenseSchema);
