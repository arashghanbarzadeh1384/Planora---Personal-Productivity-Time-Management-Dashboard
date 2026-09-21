import bcrypt from "bcryptjs";
import { addDays, set } from "date-fns";
import { PrismaClient, Priority, ProjectStatus, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("PlanoraDemo2026", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@planora.app" },
    update: { name: "Planora Demo", passwordHash },
    create: { name: "Planora Demo", email: "demo@planora.app", passwordHash, timezone: "Asia/Tehran" },
  });
  await prisma.project.deleteMany({ where: { userId: user.id } });
  const frontend = await prisma.project.create({ data: { userId: user.id, name: "Frontend Mastery", description: "Build deeper frontend engineering and product-design instincts.", status: ProjectStatus.ACTIVE, priority: Priority.HIGH, color: "#6958e6", deadline: addDays(new Date(), 75) } });
  const portfolio = await prisma.project.create({ data: { userId: user.id, name: "Personal Website", description: "Turn recent work into a compelling portfolio narrative.", status: ProjectStatus.ACTIVE, priority: Priority.MEDIUM, color: "#ec8b47", deadline: addDays(new Date(), 38) } });
  await prisma.task.createMany({ data: [
    { userId: user.id, projectId: frontend.id, title: "Finish TypeScript utility types", status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, dueDate: new Date(), estimatedMinutes: 90 },
    { userId: user.id, projectId: portfolio.id, title: "Refine portfolio case study", status: TaskStatus.TODO, priority: Priority.MEDIUM, dueDate: new Date(), estimatedMinutes: 60 },
    { userId: user.id, projectId: frontend.id, title: "Ship responsive navigation", status: TaskStatus.DONE, priority: Priority.HIGH, completedAt: addDays(new Date(), -1), estimatedMinutes: 75 },
  ] });
  await prisma.schedule.createMany({ data: [
    { userId: user.id, title: "Deep work: Planora", startAt: set(new Date(), { hours: 9, minutes: 0 }), endAt: set(new Date(), { hours: 11, minutes: 0 }), category: "Work", color: "#6958e6", priority: Priority.HIGH },
    { userId: user.id, title: "Frontend practice", startAt: set(new Date(), { hours: 15, minutes: 0 }), endAt: set(new Date(), { hours: 16, minutes: 30 }), category: "Learning", color: "#2d9bf0", priority: Priority.HIGH },
  ] });
  console.log("Planora seed complete: demo@planora.app / PlanoraDemo2026");
}

main().finally(() => prisma.$disconnect());
