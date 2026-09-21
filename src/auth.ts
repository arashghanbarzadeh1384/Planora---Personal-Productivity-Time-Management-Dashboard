import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

const providers: Provider[] = [
  Credentials({
    name: "Email and password",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(input) {
      const parsed = credentialsSchema.safeParse(input);
      if (!parsed.success) return null;
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
      if (!user?.passwordHash) return null;
      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      return valid ? { id: user.id, name: user.name, email: user.email, image: user.image } : null;
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) providers.push(GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }));

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/sign-in" },
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
