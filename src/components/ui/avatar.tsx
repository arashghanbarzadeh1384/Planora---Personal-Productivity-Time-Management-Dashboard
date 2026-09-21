import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return <div aria-label={name} className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 text-xs font-bold text-white", className)}>{name.split(" ").map((piece) => piece[0]).join("").slice(0, 2)}</div>;
}
