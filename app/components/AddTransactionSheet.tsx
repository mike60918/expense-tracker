"use client";

import { useState } from "react";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

export function AddTransactionSheet({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSupported: voiceSupported, isListening, start: startListening, stop: stopListening } =
    useSpeechRecognition(setText);

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening(text);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    if (isListening) stopListening();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "發生錯誤");
      }

      if (data.expenses.length === 0) {
        setError(data.summary || "沒有偵測到可記帳的內容，請換個說法試試");
        return;
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-violet-950/30 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-[#1c1930]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-violet-950/10 dark:bg-white/15" />
        <h2 className="mb-3 text-base font-semibold text-violet-950 dark:text-zinc-50">新增一筆記帳</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例如：午餐吃拉麵花了150元"
              rows={3}
              className="w-full resize-none rounded-xl border border-violet-950/10 bg-violet-50/60 p-3 pr-12 text-violet-950 outline-none focus:border-violet-400 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-50"
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={isListening ? "停止語音輸入" : "語音輸入"}
                className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors ${
                  isListening
                    ? "animate-pulse bg-rose-500 text-white"
                    : "bg-violet-950/5 text-violet-900/60 active:bg-violet-950/10 dark:bg-white/10 dark:text-zinc-300"
                }`}
              >
                🎤
              </button>
            )}
          </div>
          {isListening && (
            <p className="text-sm text-violet-600 dark:text-violet-400">聆聽中...再次點擊麥克風結束</p>
          )}
          {error && <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="rounded-xl bg-violet-500 py-3 text-sm font-medium text-white shadow-md shadow-violet-500/30 transition-colors active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "分析中..." : "送出"}
          </button>
        </form>
      </div>
    </div>
  );
}
