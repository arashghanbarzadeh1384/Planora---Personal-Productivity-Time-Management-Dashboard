import { auth } from "@/auth";

export default auth((request) => {
  const isWorkspace = request.nextUrl.pathname.startsWith("/app");
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (isWorkspace && !request.auth && !demo) {
    const signIn = new URL("/sign-in", request.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", request.nextUrl.href);
    return Response.redirect(signIn);
  }
});

export const config = { matcher: ["/app/:path*"] };
