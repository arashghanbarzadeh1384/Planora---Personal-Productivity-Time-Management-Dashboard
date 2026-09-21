import { createHash, randomBytes } from "crypto";
import { addHours } from "date-fns";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  // Always return the same response to prevent account enumeration.
  const response = NextResponse.json({ ok: true });
  if (!email) return response;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
  if (!user?.email) return response;
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expires: addHours(new Date(), 1) } });
  try {
    await sendPasswordResetEmail({ to: user.email, url: `${process.env.AUTH_URL ?? new URL(request.url).origin}/reset-password?token=${token}` });
  } catch {
    // Never disclose mail-provider configuration or delivery details.
  }
  return response;
}
