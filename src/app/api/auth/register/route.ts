import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Registration is unavailable until DATABASE_URL is configured and Prisma migrations are applied." },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json().catch(() => null);
    const parsed = signUpSchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ error: "Please review the highlighted fields." }, { status: 400 });

    const email = parsed.data.email.toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (exists) return NextResponse.json({ error: "An account already exists for that email." }, { status: 409 });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json(
      { error: "We could not create the account. Check the database connection and Prisma migrations, then try again." },
      { status: 500 },
    );
  }
}
