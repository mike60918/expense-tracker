"use client";

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
      <TabButton label="記帳" icon="📋" isActive={active === "ledger"} onClick={() => onChange("ledger")} />
      <TabButton label="統計" icon="📊" isActive={active === "stats"} onClick={() => onChange("stats")} />
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
  icon: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
        isActive ? "text-violet-600 dark:text-violet-400" : "text-violet-900/35 dark:text-zinc-500"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </button>
  );
}
