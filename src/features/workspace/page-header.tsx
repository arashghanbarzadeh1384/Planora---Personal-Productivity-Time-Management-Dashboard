import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, actions, className }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode; className?: string }) {
  return <header className={cn("flex flex-col justify-between gap-4 sm:flex-row sm:items-end", className)}><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">{eyebrow ?? "Workspace"}</p><h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{description}</p> : null}</div>{actions ? <div className="flex items-center gap-2">{actions}</div> : null}</header>;
}
