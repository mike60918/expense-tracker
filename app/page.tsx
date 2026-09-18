"use client";

import { useState } from "react";
import { BottomTabBar, type Tab } from "@/app/components/BottomTabBar";
import { FabButton } from "@/app/components/FabButton";
import { AddTransactionSheet } from "@/app/components/AddTransactionSheet";
import { LedgerView } from "@/app/components/LedgerView";
import { StatsView } from "@/app/components/StatsView";
import { AuthScreen } from "@/app/components/AuthScreen";
import { SettingsSheet } from "@/app/components/SettingsSheet";
import { useAuth } from "@/lib/AuthContext";
import { todayInTaipei } from "@/lib/date";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("ledger");
  const [selectedDate, setSelectedDate] = useState(todayInTaipei());
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-violet-50 dark:bg-[#100e1a]">
        <p className="text-sm text-violet-900/50 dark:text-zinc-500">載入中...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-violet-50 dark:bg-[#100e1a]">
      <header className="flex items-center justify-between gap-3 border-b border-violet-950/5 px-4 py-3 dark:border-white/10">
        <h1 className="truncate text-base font-semibold text-violet-950 dark:text-zinc-50">
          KUN &amp; THU 的家庭記帳本
        </h1>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            aria-label="設定"
            className="text-lg text-violet-900/40 active:text-violet-900/70 dark:text-zinc-500 dark:active:text-zinc-300"
          >
            ⚙️
          </button>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-violet-900/40 active:text-violet-900/70 dark:text-zinc-500 dark:active:text-zinc-300"
          >
            {user.name}・登出
          </button>
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto pb-24">
        {activeTab === "ledger" ? (
          <LedgerView date={selectedDate} onDateChange={setSelectedDate} refreshToken={refreshToken} />
        ) : (
          <StatsView refreshToken={refreshToken} />
        )}
      </main>

      <FabButton onClick={() => setShowAddSheet(true)} />
      <BottomTabBar active={activeTab} onChange={setActiveTab} />

      {showAddSheet && (
        <AddTransactionSheet
          onClose={() => setShowAddSheet(false)}
          onSaved={() => {
            setSelectedDate(todayInTaipei());
            setRefreshToken((n) => n + 1);
          }}
        />
      )}

      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}
