import { cn } from "@/lib/utils";

export function Progress({ value, className, barClassName }: { value: number; className?: string; barClassName?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return <div className={cn("h-2 overflow-hidden rounded-full bg-[var(--muted)]", className)} role="progressbar" aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}><div className={cn("h-full rounded-full bg-[var(--primary)] transition-all duration-500", barClassName)} style={{ width: `${safeValue}%` }} /></div>;
}
