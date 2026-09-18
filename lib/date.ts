const TAIPEI_OFFSET = "+08:00";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toTaipeiParts(date: Date) {
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

export function todayInTaipei(): string {
  const { year, month, day } = toTaipeiParts(new Date());
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function currentMonthInTaipei(): string {
  return todayInTaipei().slice(0, 7);
}

export function currentYearInTaipei(): string {
  return todayInTaipei().slice(0, 4);
}

export function shiftMonthString(monthStr: string, delta: number): string {
  const [year, month] = monthStr.split("-").map(Number);
  const total = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return `${newYear}-${pad(newMonth)}`;
}

export function shiftYearString(yearStr: string, delta: number): string {
  return String(Number(yearStr) + delta);
}

export function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number);
  return `${year}年${month}月`;
}

export function formatYearLabel(yearStr: string): string {
  return `${yearStr}年`;
}

export function taipeiDayRange(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00${TAIPEI_OFFSET}`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export function taipeiMonthRange(monthStr: string) {
  const [year, month] = monthStr.split("-").map(Number);
  const start = new Date(`${monthStr}-01T00:00:00${TAIPEI_OFFSET}`);
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const end = new Date(`${nextYear}-${pad(nextMonth)}-01T00:00:00${TAIPEI_OFFSET}`);
  return { start, end };
}

export function taipeiYearRange(yearStr: string) {
  const year = Number(yearStr);
  const start = new Date(`${yearStr}-01-01T00:00:00${TAIPEI_OFFSET}`);
  const end = new Date(`${year + 1}-01-01T00:00:00${TAIPEI_OFFSET}`);
  return { start, end };
}

export function addDaysToDateString(dateStr: string, delta: number): string {
  const { start } = taipeiDayRange(dateStr);
  const shifted = new Date(start.getTime() + delta * 24 * 60 * 60 * 1000);
  const { year, month, day } = toTaipeiParts(shifted);
  return `${year}-${pad(month)}-${pad(day)}`;
}

export const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function weekdayOf(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function getWeekDates(dateStr: string): string[] {
  const sunday = addDaysToDateString(dateStr, -weekdayOf(dateStr));
  return Array.from({ length: 7 }, (_, i) => addDaysToDateString(sunday, i));
}

export function taipeiMonthDays(monthStr: string): { day: number; dateStr: string; weekday: number }[] {
  const [year, month] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
    return { day, dateStr, weekday: weekdayOf(dateStr) };
  });
}
