import { Aperture } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-[-0.04em] text-[var(--foreground)]",
        className,
      )}
      aria-label="Planora home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 text-white shadow-[0_8px_20px_rgba(98,84,232,.28)]">
        <Aperture className="size-5" strokeWidth={2.4} />
      </span>
      <span className="text-xl">planora</span>
    </Link>
  );
}
