import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(98,84,232,.2)] hover:-translate-y-0.5 hover:brightness-110",
        secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-700",
        outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
        ghost: "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        danger: "bg-rose-600 text-white hover:bg-rose-700",
      },
      size: { sm: "h-8 px-3 text-xs", default: "h-10 px-4 text-sm", lg: "h-12 px-5 text-sm", icon: "size-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
