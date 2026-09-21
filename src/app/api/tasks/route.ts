import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await prisma.task.findMany({ where: { userId: session.user.id }, orderBy: [{ status: "asc" }, { dueDate: "asc" }], include: { tags: { include: { tag: true } }, project: { select: { id: true, name: true } } } });
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = taskSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid task input", issues: parsed.error.flatten() }, { status: 400 });
  const task = await prisma.task.create({ data: { ...parsed.data, userId: session.user.id } });
  return NextResponse.json({ task }, { status: 201 });
}
