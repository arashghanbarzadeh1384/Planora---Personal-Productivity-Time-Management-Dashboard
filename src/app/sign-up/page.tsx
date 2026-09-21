import { Suspense } from "react";
import { AuthCard } from "@/features/auth/auth-card";

export default function SignUpPage() { return <Suspense><AuthCard mode="sign-up" /></Suspense>; }
