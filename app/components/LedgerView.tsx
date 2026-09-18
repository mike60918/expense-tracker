"use client";

import { useRef, useState } from "react";
import { DateHeader } from "@/app/components/DateHeader";
import { WeekStrip } from "@/app/components/WeekStrip";
import { CalendarPicker } from "@/app/components/CalendarPicker";
import { TransactionList } from "@/app/components/TransactionList";
import { addDaysToDateString, todayInTaipei } from "@/lib/date";

const SWIPE_THRESHOLD = 50;

export function LedgerView({
  date,
  onDateChange,
  refreshToken,
}: {
  date: string;
  onDateChange: (date: string) => void;
  refreshToken: number;
}) {
  const touchStartX = useRef<number | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (deltaX <= -SWIPE_THRESHOLD) {
      if (date !== todayInTaipei()) onDateChange(addDaysToDateString(date, 1));
    } else if (deltaX >= SWIPE_THRESHOLD) {
      onDateChange(addDaysToDateString(date, -1));
    }
  }

  return (
    <>
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <DateHeader date={date} onChange={onDateChange} onOpenCalendar={() => setShowCalendar(true)} />
        <WeekStrip date={date} onChange={onDateChange} />
        <TransactionList date={date} refreshToken={refreshToken} />
      </div>

      {showCalendar && (
        <CalendarPicker initialDate={date} onSelect={onDateChange} onClose={() => setShowCalendar(false)} />
      )}
    </>
  );
}
