"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({ email: z.string().email("Enter a valid email."), password: z.string().min(1, "Enter your password.") });
const signUpSchema = z.object({ name: z.string().min(2, "Enter your name."), email: z.string().email("Enter a valid email."), password: z.string().min(10, "Use 10+ characters.").regex(/[A-Z]/, "Add an uppercase letter.").regex(/[0-9]/, "Add a number.") });
type SignInValues = z.infer<typeof signInSchema>; type SignUpValues = z.infer<typeof signUpSchema>;

export function AuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up"; const router = useRouter(); const params = useSearchParams(); const [error, setError] = useState("");
  const form = useForm<SignInValues | SignUpValues>({ resolver: zodResolver(isSignUp ? signUpSchema : signInSchema), defaultValues: isSignUp ? { name: "", email: "", password: "" } : { email: "", password: "" } });
  const submit = async (values: SignInValues | SignUpValues) => {
    setError("");
    try {
      if (isSignUp) {
        const response = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
        const result = await readApiPayload(response);
        if (!response.ok) { setError(result.error ?? "Could not create your account. Please try again."); return; }
      }
      const result = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
      if (result?.error) { setError("That email and password don’t match."); return; }
      const callback = params.get("callbackUrl");
      router.push(callback?.startsWith("/") ? callback : "/app");
      router.refresh();
    } catch {
      setError("We could not reach the registration service. Please try again.");
    }
  };
  return <main className="grid min-h-screen bg-[#f8f9fd] lg:grid-cols-2 dark:bg-[#10131d]"><section className="relative hidden overflow-hidden bg-gradient-to-br from-[#171536] via-[#262050] to-[#16395f] p-12 text-white lg:flex lg:flex-col"><div className="absolute inset-0 grid-fade opacity-20" /><Brand className="relative text-white [&>span:last-child]:text-white" /><div className="relative my-auto max-w-md"><p className="text-sm font-semibold text-violet-200">Plan with clarity</p><h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-[-.06em]">Build a rhythm that has room for you.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-violet-100">Your schedule, focus sessions, goals, and small rituals—finally in one considered place.</p><div className="mt-10 space-y-4">{["A calm home for your day", "Secure by default", "Built for meaningful momentum"].map((text) => <div key={text} className="flex items-center gap-3 text-sm text-violet-100"><span className="grid size-6 place-items-center rounded-full bg-white/10"><CheckCircle2 className="size-3.5" /></span>{text}</div>)}</div></div><p className="relative text-xs text-violet-200">© {new Date().getFullYear()} Planora</p></section><section className="flex items-center justify-center p-5 sm:p-8"><div className="w-full max-w-md"><Brand className="mb-12 lg:hidden" /><div><p className="text-sm font-semibold text-[var(--primary)]">Welcome {isSignUp ? "to Planora" : "back"}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em]">{isSignUp ? "Create your workspace." : "Your day is waiting."}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{isSignUp ? "Start with a clear place for the things that matter most." : "Sign in to return to your personal operating system."}</p></div><form className="mt-8 space-y-4" onSubmit={form.handleSubmit(submit)}>{isSignUp ? <Field label="Your name" error={(form.formState.errors as Record<string, { message?: string }>).name?.message}><input autoComplete="name" placeholder="Arash Ghanbarzadeh" className="auth-input" {...form.register("name" as never)} /></Field> : null}<Field label="Email" error={form.formState.errors.email?.message}><input autoComplete="email" type="email" placeholder="you@example.com" className="auth-input" {...form.register("email")} /></Field><Field label="Password" error={form.formState.errors.password?.message}><input autoComplete={isSignUp ? "new-password" : "current-password"} type="password" placeholder="••••••••••" className="auth-input" {...form.register("password")} /></Field>{!isSignUp ? <Link href="/forgot-password" className="block text-right text-xs font-medium text-[var(--primary)] hover:underline">Forgot password?</Link> : <p className="text-xs leading-5 text-[var(--muted-foreground)]">Use at least 10 characters, including an uppercase letter and a number.</p>}{error ? <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600">{error}</p> : null}<Button type="submit" className="mt-2 w-full" size="lg" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>{isSignUp ? "Create workspace" : "Sign in"}<ArrowRight className="size-4" /></>}</Button></form><p className="mt-7 text-center text-sm text-[var(--muted-foreground)]">{isSignUp ? "Already have an account?" : "New to Planora?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-[var(--primary)] hover:underline">{isSignUp ? "Sign in" : "Create an account"}</Link></p></div></section></main>;
}

export function RecoveryCard({ reset = false }: { reset?: boolean }) {
  const params = useSearchParams(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle"); const [message, setMessage] = useState(""); const router = useRouter();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("loading");
    try {
      const endpoint = reset ? "/api/auth/reset-password" : "/api/auth/forgot-password";
      const body = reset ? { token: params.get("token"), password } : { email };
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await readApiPayload(response);
      if (!response.ok) { setState("error"); setMessage(result.error ?? "Something went wrong."); return; }
      setState("done");
      setMessage(reset ? "Your password is updated. You can now sign in." : "If that account exists, a secure reset link is on its way.");
      if (reset) window.setTimeout(() => router.push("/sign-in"), 1400);
    } catch {
      setState("error");
      setMessage("We could not reach the recovery service. Please try again.");
    }
  };
  return <main className="grid min-h-screen place-items-center bg-[#f8f9fd] p-5 dark:bg-[#10131d]"><div className="w-full max-w-md"><Brand /><div className="mt-12 rounded-2xl border bg-[var(--card)] p-6 shadow-xl shadow-slate-950/5 sm:p-8"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-[var(--primary)]">{reset ? <LockKeyhole className="size-5" /> : <Mail className="size-5" />}</span><h1 className="mt-5 text-2xl font-semibold tracking-tight">{reset ? "Choose a new password" : "Reset your password"}</h1><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{reset ? "Use a strong password you haven’t used elsewhere." : "We’ll send you a secure link to get back into your workspace."}</p><form className="mt-6 space-y-4" onSubmit={submit}><input type={reset ? "password" : "email"} required value={reset ? password : email} onChange={(event) => reset ? setPassword(event.target.value) : setEmail(event.target.value)} placeholder={reset ? "New password" : "you@example.com"} className="auth-input" />{message ? <p className={state === "error" ? "rounded-xl bg-rose-500/10 p-3 text-sm text-rose-600" : "rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300"}>{message}</p> : null}<Button className="w-full" size="lg" disabled={state === "loading" || state === "done"}>{state === "loading" ? <Loader2 className="size-4 animate-spin" /> : reset ? "Update password" : "Send reset link"}</Button></form><Link href="/sign-in" className="mt-6 block text-center text-sm font-medium text-[var(--primary)] hover:underline">Back to sign in</Link></div></div></main>;
}

async function readApiPayload(response: Response): Promise<{ error?: string }> {
  const body = await response.text();
  if (!body) return {};
  try { return JSON.parse(body) as { error?: string }; } catch { return {}; }
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium">{label}<span className="mt-2 block">{children}</span>{error ? <span className="mt-1 block text-xs font-normal text-rose-600">{error}</span> : null}</label>; }
