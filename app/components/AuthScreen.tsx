"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const FEATURES = [
  { icon: "🎙️", label: "語音輸入" },
  { icon: "🤖", label: "AI 自動分類" },
  { icon: "👨‍👩‍👧", label: "家人共用帳本" },
];

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const err = mode === "login" ? await login(email, password) : await register(email, password, name, inviteCode);

    setLoading(false);
    if (err) setError(err);
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-violet-50 dark:bg-[#100e1a]">
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-700/20" />
      <div className="pointer-events-none absolute top-40 -right-20 h-64 w-64 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />

      <div className="relative flex-1 overflow-y-auto px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-lg shadow-violet-300/40 dark:bg-zinc-900 dark:shadow-none dark:ring-1 dark:ring-white/10">
            💜
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-violet-950 dark:text-zinc-50">
            KUN &amp; THU 的家庭記帳本
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-violet-900/60 dark:text-zinc-400">
            用一句話記帳，AI 自動幫你拆分品項、分類與整理，全家人一起共用同一本帳。
          </p>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.label}
              className="card-surface flex flex-col items-center gap-1.5 rounded-2xl px-2 py-4 text-center"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-xs font-medium text-violet-950/80 dark:text-zinc-300">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="card-surface mt-7 rounded-3xl p-5">
          <div className="mb-4 text-center">
            <h2 className="text-base font-semibold text-violet-950 dark:text-zinc-50">
              {mode === "login" ? "登入你的帳號" : "建立新帳號"}
            </h2>
            <p className="mt-1 text-xs text-violet-900/50 dark:text-zinc-500">
              {mode === "login" ? "歡迎回來，繼續記錄今天的花費" : "加入家庭帳本，需要邀請驗證碼"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "register" && (
              <>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="名稱"
                  className="w-full rounded-xl border border-violet-950/10 bg-violet-50/60 p-3 text-violet-950 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="驗證碼"
                  className="w-full rounded-xl border border-violet-950/10 bg-violet-50/60 p-3 text-violet-950 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-violet-950/10 bg-violet-50/60 p-3 text-violet-950 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              className="w-full rounded-xl border border-violet-950/10 bg-violet-50/60 p-3 text-violet-950 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-50"
            />

            {error && <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-violet-500 py-3 text-sm font-medium text-white shadow-md shadow-violet-500/30 transition-colors active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "處理中..." : mode === "login" ? "登入" : "註冊"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="mt-4 w-full text-center text-sm text-violet-600 dark:text-violet-400"
          >
            {mode === "login" ? "還沒有帳號？註冊一個" : "已經有帳號？登入"}
          </button>
        </div>
      </div>
    </div>
  );
}
