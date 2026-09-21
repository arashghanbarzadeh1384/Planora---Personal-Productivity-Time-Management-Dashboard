import { cn } from "@/lib/utils";

const hues = {
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  slate: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

export function Badge({ children, tone = "slate", className }: { children: React.ReactNode; tone?: keyof typeof hues; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold", hues[tone], className)}>{children}</span>;
}
