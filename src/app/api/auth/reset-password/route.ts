import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(20), password: z.string().min(10).max(128).regex(/[A-Z]/).regex(/[0-9]/) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Use a 10+ character password with a number and uppercase letter." }, { status: 400 });
  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!reset || reset.expires < new Date()) return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.$transaction([prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }), prisma.passwordResetToken.delete({ where: { id: reset.id } })]);
  return NextResponse.json({ ok: true });
}
