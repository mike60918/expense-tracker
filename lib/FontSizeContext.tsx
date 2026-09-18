"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type FontSize = "small" | "medium" | "large";

const STORAGE_KEY = "fontSize";

export const FONT_SIZE_PX: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

type FontSizeContextValue = {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
};

const FontSizeContext = createContext<FontSizeContextValue | null>(null);

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = FONT_SIZE_PX[size];
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "small" || stored === "medium" || stored === "large") {
      setFontSizeState(stored);
    }
  }, []);

  const setFontSize = useCallback((next: FontSize) => {
    setFontSizeState(next);
    applyFontSize(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return <FontSizeContext.Provider value={{ fontSize, setFontSize }}>{children}</FontSizeContext.Provider>;
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
