"use client";

export function FabButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="新增記帳"
      className="absolute bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500 text-3xl leading-none text-white shadow-lg shadow-violet-500/35 transition-transform active:scale-95"
    >
      +
    </button>
  );
}
