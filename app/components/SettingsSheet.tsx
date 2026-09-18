"use client";

import { useTheme } from "@/lib/ThemeContext";
import { useFontSize, type FontSize } from "@/lib/FontSizeContext";

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: "small", label: "小" },
  { value: "medium", label: "中" },
  { value: "large", label: "大" },
];

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-violet-950/30 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-[#1c1930]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-violet-950/10 dark:bg-white/15" />
        <h2 className="mb-4 text-base font-semibold text-violet-950 dark:text-zinc-50">設定</h2>

        <p className="mb-2 text-xs text-violet-900/50 dark:text-zinc-500">外觀</p>
        <div className="mb-5 flex rounded-full bg-violet-100/70 p-1 text-sm dark:bg-zinc-900">
          <OptionButton label="☀️ 淺色" isActive={theme === "light"} onClick={() => setTheme("light")} />
          <OptionButton label="🌙 深色" isActive={theme === "dark"} onClick={() => setTheme("dark")} />
        </div>

        <p className="mb-2 text-xs text-violet-900/50 dark:text-zinc-500">字體大小</p>
        <div className="flex rounded-full bg-violet-100/70 p-1 text-sm dark:bg-zinc-900">
          {FONT_SIZE_OPTIONS.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              isActive={fontSize === option.value}
              onClick={() => setFontSize(option.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full py-2 font-medium transition-colors ${
        isActive
          ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-700 dark:text-violet-400"
          : "text-violet-900/40 dark:text-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}
