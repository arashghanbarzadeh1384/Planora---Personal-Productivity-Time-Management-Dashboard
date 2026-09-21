import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function percent(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
