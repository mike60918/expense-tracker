"use client";

import type { ReactNode } from "react";

export type Tab = "ledger" | "stats";

export function BottomTabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex border-t border-violet-950/5 bg-white/90 backdrop-blur pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-zinc-950/90">
      <TabButton
        label="記帳"
        icon={<LedgerIcon />}
        isActive={active === "ledger"}
        onClick={() => onChange("ledger")}
      />
      <TabButton label="統計" icon={<StatsIcon />} isActive={active === "stats"} onClick={() => onChange("stats")} />
    </nav>
  );
}

function TabButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
        isActive ? "text-violet-600 dark:text-violet-400" : "text-violet-900/35 dark:text-zinc-500"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all ${
          isActive ? "scale-110 bg-violet-100 dark:bg-violet-400/15" : "scale-100"
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function LedgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="6.5" y="3" width="14" height="18" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="3.4" cy="7.5" r="1.1" fill="currentColor" />
      <circle cx="3.4" cy="12" r="1.1" fill="currentColor" />
      <circle cx="3.4" cy="16.5" r="1.1" fill="currentColor" />
      <path d="M10.5 9h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 17h3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="4" y="12" width="4.2" height="8.5" rx="2.1" fill="currentColor" />
      <rect x="9.9" y="7" width="4.2" height="13.5" rx="2.1" fill="currentColor" />
      <rect x="15.8" y="3.5" width="4.2" height="17" rx="2.1" fill="currentColor" />
    </svg>
  );
}
