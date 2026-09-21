import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128).regex(/[A-Z]/, "Use at least one uppercase letter.").regex(/[0-9]/, "Use at least one number."),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(10_000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
  estimatedMinutes: z.coerce.number().int().min(0).max(1_440).optional(),
});
