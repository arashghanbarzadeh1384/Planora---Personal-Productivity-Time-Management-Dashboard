import { format, subDays } from "date-fns";
import type { WorkspaceState } from "./types";

const isoDay = (date: Date) => format(date, "yyyy-MM-dd");

export function createEmptyWorkspace(): WorkspaceState {
  return {
    projects: [],
    tasks: [],
    schedules: [],
    habits: [],
    goals: [],
    focusSessions: [],
    notes: [],
    notifications: [],
  };
}

export function createSeedWorkspace(): WorkspaceState {
  const today = new Date();
  const day = isoDay(today);
  const yesterday = isoDay(subDays(today, 1));
  const twoDaysAgo = isoDay(subDays(today, 2));
  const fourDaysAgo = isoDay(subDays(today, 4));

  return {
    projects: [
      { id: "frontend", name: "Frontend Mastery", description: "A focused path from strong fundamentals to production-ready craft.", status: "ACTIVE", priority: "HIGH", progress: 64, color: "#6958e6", deadline: isoDay(new Date(today.getFullYear(), today.getMonth() + 2, 28)) },
      { id: "portfolio", name: "Personal Website", description: "A portfolio that tells the story behind the work.", status: "ACTIVE", priority: "MEDIUM", progress: 38, color: "#ec8b47", deadline: isoDay(new Date(today.getFullYear(), today.getMonth() + 1, 12)) },
      { id: "university", name: "University", description: "A calm, structured semester plan.", status: "ACTIVE", priority: "HIGH", progress: 72, color: "#35a97a", deadline: isoDay(new Date(today.getFullYear(), today.getMonth() + 3, 1)) },
    ],
    tasks: [
      { id: "task-1", title: "Finish the TypeScript utility types", description: "Extract reusable API response and form types.", status: "IN_PROGRESS", priority: "HIGH", projectId: "frontend", dueDate: day, estimatedMinutes: 90, tags: ["TypeScript", "Learning"] },
      { id: "task-2", title: "Refine portfolio case study", status: "TODO", priority: "MEDIUM", projectId: "portfolio", dueDate: day, estimatedMinutes: 60, tags: ["Writing"] },
      { id: "task-3", title: "Review database lecture notes", status: "TODO", priority: "HIGH", projectId: "university", dueDate: day, estimatedMinutes: 45, tags: ["Study"] },
      { id: "task-4", title: "Ship responsive navigation", status: "DONE", priority: "HIGH", projectId: "portfolio", dueDate: yesterday, estimatedMinutes: 75, completedAt: yesterday, tags: ["UI"] },
      { id: "task-5", title: "Plan next week’s study blocks", status: "BACKLOG", priority: "LOW", projectId: "university", estimatedMinutes: 30, tags: ["Planning"] },
      { id: "task-6", title: "Write project README", status: "DONE", priority: "MEDIUM", projectId: "frontend", dueDate: twoDaysAgo, estimatedMinutes: 35, completedAt: twoDaysAgo, tags: ["Docs"] },
    ],
    schedules: [
      { id: "schedule-1", title: "Morning reset", date: day, startTime: "07:30", endTime: "08:00", category: "Personal", color: "#f7b84b", priority: "MEDIUM", repeat: "DAILY" },
      { id: "schedule-2", title: "Deep work: Planora", description: "Finish the focus flow and project dashboard.", date: day, startTime: "09:00", endTime: "11:00", category: "Work", color: "#6958e6", priority: "HIGH", repeat: "WEEKLY" },
      { id: "schedule-3", title: "University lecture", date: day, startTime: "11:30", endTime: "13:00", category: "Study", color: "#35a97a", priority: "HIGH", location: "Engineering hall", repeat: "WEEKLY" },
      { id: "schedule-4", title: "Lunch and walk", date: day, startTime: "13:00", endTime: "14:00", category: "Personal", color: "#ec8b47", priority: "LOW", repeat: "DAILY" },
      { id: "schedule-5", title: "Frontend practice", date: day, startTime: "15:00", endTime: "16:30", category: "Learning", color: "#2d9bf0", priority: "HIGH", repeat: "WEEKLY" },
      { id: "schedule-6", title: "Strength training", date: day, startTime: "18:00", endTime: "19:00", category: "Health", color: "#ef5b7a", priority: "MEDIUM", repeat: "WEEKLY" },
    ],
    habits: [
      { id: "read", name: "Read", icon: "BookOpen", color: "#6958e6", frequency: "Daily", target: 1, completedDates: [day, yesterday, twoDaysAgo, fourDaysAgo], longestStreak: 14 },
      { id: "code", name: "Code", icon: "Code2", color: "#2d9bf0", frequency: "Daily", target: 1, completedDates: [day, yesterday, twoDaysAgo], longestStreak: 21 },
      { id: "exercise", name: "Exercise", icon: "Dumbbell", color: "#ef5b7a", frequency: "4× weekly", target: 4, completedDates: [yesterday, twoDaysAgo, fourDaysAgo], longestStreak: 9 },
      { id: "english", name: "English", icon: "Languages", color: "#35a97a", frequency: "Daily", target: 1, completedDates: [day, yesterday], longestStreak: 8 },
    ],
    goals: [
      { id: "goal-1", title: "Become a professional frontend developer", description: "Build depth, taste, and a credible body of shipped work.", category: "Career", progress: 58, deadline: isoDay(new Date(today.getFullYear(), 11, 31)), milestones: [{ id: "m1", title: "Master TypeScript", done: true }, { id: "m2", title: "Build three case-study projects", done: true }, { id: "m3", title: "Publish a portfolio", done: false }, { id: "m4", title: "Land a professional role", done: false }] },
      { id: "goal-2", title: "Study abroad", description: "Prepare a competitive application and language score.", category: "Education", progress: 34, deadline: isoDay(new Date(today.getFullYear() + 1, 6, 1)), milestones: [{ id: "m5", title: "Research programs", done: true }, { id: "m6", title: "Language exam plan", done: false }, { id: "m7", title: "Submit applications", done: false }] },
    ],
    focusSessions: [
      { id: "focus-1", minutes: 75, date: day, label: "Planora architecture" },
      { id: "focus-2", minutes: 50, date: day, label: "TypeScript practice" },
      { id: "focus-3", minutes: 60, date: yesterday, label: "Portfolio writing" },
      { id: "focus-4", minutes: 45, date: twoDaysAgo, label: "University notes" },
    ],
    notes: [],
    notifications: [
      { id: "notice-1", title: "Deep work begins in 25 minutes", body: "Planora project block · 09:00 — 11:00", read: false, createdAt: day, kind: "REMINDER" },
      { id: "notice-2", title: "You completed your Code habit", body: "Your current streak is 3 days. Keep the rhythm.", read: false, createdAt: day, kind: "SUCCESS" },
      { id: "notice-3", title: "Weekly review is ready", body: "You protected 6h 10m of focus time this week.", read: true, createdAt: yesterday, kind: "INFO" },
    ],
  };
}
