import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Today is fixed at June 10, 2026 for deterministic prototype
export const TODAY = new Date('2026-06-10T00:00:00.000Z');

export function subtractDays(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function daysSince(isoDate: string): number {
  const then = new Date(isoDate);
  const diff = TODAY.getTime() - then.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function todayLabel(): string {
  return TODAY.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}
