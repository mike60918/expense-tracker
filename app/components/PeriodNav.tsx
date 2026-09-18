"use client";

export function PeriodNav({
  label,
  isCurrent,
  onPrev,
  onNext,
  prevAriaLabel,
  nextAriaLabel,
}: {
  label: string;
  isCurrent: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevAriaLabel: string;
  nextAriaLabel: string;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevAriaLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 dark:text-zinc-400 dark:active:bg-white/10"
      >
        ‹
      </button>
      <span className="text-sm font-semibold text-violet-950 dark:text-zinc-50">
        {label}
        {isCurrent && (
          <span className="ml-1 text-xs font-normal text-violet-900/40 dark:text-zinc-500">（至今）</span>
        )}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={isCurrent}
        aria-label={nextAriaLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-violet-900/45 active:bg-violet-950/5 disabled:opacity-30 dark:text-zinc-400 dark:active:bg-white/10"
      >
        ›
      </button>
    </div>
  );
}
