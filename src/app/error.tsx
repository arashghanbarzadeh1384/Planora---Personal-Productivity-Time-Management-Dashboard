"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6"><div className="max-w-md text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-500/10 text-amber-600"><TriangleAlert className="size-7" /></span><h1 className="mt-6 text-2xl font-semibold tracking-tight">A small detour.</h1><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">Planora hit an unexpected error. Nothing has been changed—please try again.</p><Button className="mt-7" onClick={reset}><RefreshCw className="size-4" />Try again</Button></div></main>;
}
