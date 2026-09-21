"use client";

import { format } from "date-fns";
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare2,
  ChevronRight,
  CircleDot,
  Command,
  Focus,
  FolderKanban,
  Home,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  Plus,
  Search,
  Settings,
  Sun,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/brand";
import { QuickCreate } from "./quick-create";
import { useWorkspace } from "./workspace-provider";

const nav = [
  { href: "/app", label: "Overview", icon: Home, exact: true },
  { href: "/app/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/app/tasks", label: "Tasks", icon: CheckSquare2 },
  { href: "/app/projects", label: "Projects", icon: FolderKanban },
  { href: "/app/habits", label: "Habits", icon: CircleDot },
  { href: "/app/goals", label: "Goals", icon: Target },
  { href: "/app/focus", label: "Focus", icon: Focus },
  { href: "/app/notes", label: "Notes", icon: NotebookPen },
  { href: "/app/analytics", label: "Insights", icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { tasks, projects, schedules, goals, notes } = useWorkspace();
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    const entries = [
      ...tasks.map((item) => ({ type: "Task", title: item.title, href: "/app/tasks" })),
      ...projects.map((item) => ({ type: "Project", title: item.name, href: `/app/projects/${item.id}` })),
      ...schedules.map((item) => ({ type: "Schedule", title: item.title, href: "/app/schedule" })),
      ...goals.map((item) => ({ type: "Goal", title: item.title, href: "/app/goals" })),
      ...notes.map((item) => ({ type: "Note", title: item.title, href: "/app/notes" })),
    ];
    return search ? entries.filter((entry) => entry.title.toLowerCase().includes(search)).slice(0, 7) : entries.slice(0, 7);
  }, [goals, notes, projects, query, schedules, tasks]);
  const go = (href: string) => { router.push(href); setOpen(false); setQuery(""); };
  return <Dialog open={open} onOpenChange={setOpen}><button onClick={() => setOpen(true)} className="hidden h-10 min-w-56 items-center gap-2 rounded-xl border bg-[var(--card)] px-3 text-sm text-[var(--muted-foreground)] shadow-sm transition hover:border-violet-300 lg:flex"><Search className="size-4" /><span className="mr-auto">Search anything…</span><kbd className="rounded border bg-[var(--muted)] px-1.5 py-0.5 text-[10px]">⌘ K</kbd></button><DialogContent className="top-[18%] max-w-xl translate-y-0 p-0"><DialogTitle className="sr-only">Search your Planora workspace</DialogTitle><div className="flex items-center gap-3 border-b px-4"><Search className="size-5 text-[var(--muted-foreground)]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, projects, notes…" className="h-14 w-full bg-transparent text-sm outline-none" /></div><div className="p-2"><p className="px-2 py-2 text-[11px] font-bold uppercase tracking-[.14em] text-[var(--muted-foreground)]">{query ? "Results" : "Jump back in"}</p>{results.length ? results.map((result) => <button key={`${result.type}-${result.title}`} onClick={() => go(result.href)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[var(--muted)]"><span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-600"><Command className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{result.title}</span><span className="text-xs text-[var(--muted-foreground)]">{result.type}</span></span><ChevronRight className="size-4 text-[var(--muted-foreground)]" /></button>) : <div className="px-3 py-10 text-center text-sm text-[var(--muted-foreground)]">Nothing matches “{query}”.</div>}</div></DialogContent></Dialog>;
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const { notifications, markNotificationsRead } = useWorkspace();
  const unread = notifications.filter((item) => !item.read).length;
  return <Dialog open={open} onOpenChange={setOpen}><button onClick={() => { setOpen(true); markNotificationsRead(); }} className="relative grid size-10 place-items-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Open notifications"><Bell className="size-5" />{unread ? <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-[var(--card)]" /> : null}</button><DialogContent className="left-auto right-3 top-16 w-[calc(100%-1.5rem)] max-w-sm translate-x-0 translate-y-0 p-0 sm:right-5"><DialogTitle className="border-b px-5 py-4 text-base">Notifications</DialogTitle><div className="max-h-[370px] overflow-y-auto p-2">{notifications.map((notice) => <article key={notice.id} className={cn("rounded-xl p-3", !notice.read && "bg-violet-500/5")}><div className="flex gap-3"><span className={cn("mt-1 size-2 shrink-0 rounded-full", notice.kind === "SUCCESS" ? "bg-emerald-500" : notice.kind === "REMINDER" ? "bg-violet-500" : "bg-slate-400")} /><div><h3 className="text-sm font-medium">{notice.title}</h3><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{notice.body}</p></div></div></article>)}{notifications.length === 0 ? <p className="p-8 text-center text-sm text-[var(--muted-foreground)]">No notifications yet.</p> : null}</div></DialogContent></Dialog>;
}

function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className={cn("flex flex-col", mobile ? "gap-1" : "h-full px-3 py-5")} aria-label="Workspace navigation"><div className={cn("mb-8 px-2", mobile && "mb-5")}><Brand href="/app" /></div><div className="space-y-1">{nav.map((item) => { const active = isActive(pathname, item.href, item.exact); const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-violet-500/10 text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]")}><Icon className={cn("size-[18px]", active && "stroke-[2.4]")} /><span>{item.label}</span>{active ? <span className="ml-auto size-1.5 rounded-full bg-[var(--primary)]" /> : null}</Link>; })}</div><div className="mt-auto space-y-1 border-t pt-4"><Link href="/app/settings" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", pathname.startsWith("/app/settings") ? "bg-violet-500/10 text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]")}><Settings className="size-[18px]" />Settings</Link><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"><LogOut className="size-[18px]" />Exit workspace</Link></div></nav>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user } = useWorkspace();
  const hydrated = useSyncExternalStore(() => () => undefined, () => true, () => false);
  if (!hydrated) return <div className="min-h-screen bg-[var(--background)] p-6"><div className="mx-auto mt-16 max-w-6xl animate-pulse space-y-5"><div className="h-12 w-52 rounded-xl bg-[var(--muted)]" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-[var(--muted)]" />)}</div><div className="h-80 rounded-2xl bg-[var(--muted)]" /></div></div>;
  return <div className="min-h-screen bg-[var(--background)]"><aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-[var(--card)] lg:block"><Sidebar /></aside><header className="fixed inset-x-0 top-0 z-20 flex h-[73px] items-center justify-between border-b bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-4 backdrop-blur-xl lg:left-64 lg:px-8"><div className="flex items-center gap-3"><button className="grid size-10 place-items-center rounded-xl hover:bg-[var(--muted)] lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></button><div className="lg:hidden"><Brand href="/app" /></div><SearchPalette /></div><div className="flex items-center gap-1"><p className="mr-2 hidden text-sm text-[var(--muted-foreground)] xl:block">{format(new Date(), "EEEE, MMM d")}</p><QuickCreate compact /><button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="grid size-10 place-items-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Toggle appearance">{resolvedTheme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}</button><Notifications /><Avatar name={user.name} /></div></header><Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="left-0 top-0 h-full max-h-none w-72 translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0"><DialogClose className="right-4 top-4" aria-label="Close navigation"><X className="size-4" /></DialogClose><Sidebar mobile onNavigate={() => setMenuOpen(false)} /></DialogContent></Dialog><main className="px-4 pb-24 pt-[105px] lg:ml-64 lg:px-8 lg:pb-10">{children}</main><nav className="fixed inset-x-0 bottom-0 z-30 flex h-[66px] items-center justify-around border-t bg-[color-mix(in_srgb,var(--card)_92%,transparent)] px-2 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">{[nav[0], nav[1], nav[2], nav[5]].map((item) => { const active = isActive(pathname, item.href, item.exact); const Icon = item.icon; return <Link href={item.href} key={item.href} className={cn("grid min-w-12 place-items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium", active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")}><Icon className="size-[18px]" /><span>{item.label}</span></Link>; })}<button onClick={() => setMenuOpen(true)} className="grid min-w-12 place-items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--muted-foreground)]"><Plus className="size-[18px]" /><span>More</span></button></nav></div>;
}
