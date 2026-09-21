import { Compass } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6"><div className="max-w-md text-center"><Brand className="justify-center" /><span className="mx-auto mt-12 grid size-14 place-items-center rounded-2xl bg-violet-500/10 text-[var(--primary)]"><Compass className="size-7" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">404 · Lost in the plan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">This page isn’t on your map.</h1><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">It may have moved, been archived, or never existed in the first place.</p><Link href="/app" className="mt-7 inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white">Return to overview</Link></div></main>;
}
