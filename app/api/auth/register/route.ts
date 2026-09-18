import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { signAuthToken, setAuthCookie } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_CODE = "love";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim() : "";

  if (inviteCode !== INVITE_CODE) {
    return NextResponse.json({ error: "驗證碼錯誤" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "請輸入有效的 Email" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "密碼至少需要 8 個字元" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "請輸入名稱" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "這個 Email 已經被註冊過了" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name, role: "member" });

  const token = await signAuthToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await setAuthCookie(token);

  return NextResponse.json({
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  });
}
