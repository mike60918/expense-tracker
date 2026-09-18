import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "admin" | "member";

export interface UserDocument extends mongoose.Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true }
);

export default models.User || model<UserDocument>("User", UserSchema);
