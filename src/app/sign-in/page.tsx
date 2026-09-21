import { Suspense } from "react";
import { AuthCard } from "@/features/auth/auth-card";

export default function SignInPage() { return <Suspense><AuthCard mode="sign-in" /></Suspense>; }
