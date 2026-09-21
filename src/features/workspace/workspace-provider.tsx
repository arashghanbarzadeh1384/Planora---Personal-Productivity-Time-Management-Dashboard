"use client";

import { format } from "date-fns";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createEmptyWorkspace } from "./seed";
import type {
  FocusSession,
  Goal,
  Habit,
  Note,
  Project,
  ScheduleItem,
  Task,
  TaskStatus,
  WorkspaceState,
} from "./types";

const STORAGE_PREFIX = "planora-workspace-v2";

type WorkspaceContextValue = WorkspaceState & {
  user: { id: string; name: string; email?: string | null };
  ready: boolean;
  addTask: (task: Omit<Task, "id" | "tags"> & { tags?: string[] }) => void;
  updateTask: (taskId: string, changes: Partial<Omit<Task, "id">>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addProject: (project: Omit<Project, "id" | "progress"> & { progress?: number }) => void;
  updateProject: (projectId: string, changes: Partial<Omit<Project, "id">>) => void;
  deleteProject: (projectId: string) => void;
  addSchedule: (schedule: Omit<ScheduleItem, "id">) => void;
  updateSchedule: (scheduleId: string, changes: Partial<Omit<ScheduleItem, "id">>) => void;
  deleteSchedule: (scheduleId: string) => void;
  addHabit: (habit: Omit<Habit, "id" | "completedDates" | "longestStreak"> & { completedDates?: string[]; longestStreak?: number }) => void;
  updateHabit: (habitId: string, changes: Partial<Omit<Habit, "id">>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabit: (habitId: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "progress" | "milestones"> & { progress?: number; milestones?: Goal["milestones"] }) => void;
  updateGoal: (goalId: string, changes: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (goalId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addFocusSession: (session: Omit<FocusSession, "id" | "date"> & { date?: string }) => void;
  updateFocusSession: (sessionId: string, changes: Partial<Omit<FocusSession, "id">>) => void;
  deleteFocusSession: (sessionId: string) => void;
  saveNote: (note: Omit<Note, "id" | "updatedAt"> & { id?: string }) => void;
  deleteNote: (noteId: string) => void;
  markNotificationsRead: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function parseWorkspace(value: string | null): WorkspaceState {
  if (!value) return createEmptyWorkspace();
  try {
    const parsed = JSON.parse(value) as Partial<WorkspaceState>;
    return {
      ...createEmptyWorkspace(),
      ...parsed,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      schedules: Array.isArray(parsed.schedules) ? parsed.schedules : [],
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      focusSessions: Array.isArray(parsed.focusSessions) ? parsed.focusSessions : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  } catch {
    return createEmptyWorkspace();
  }
}

function withGoalProgress(goal: Goal): Goal {
  const completed = goal.milestones.filter((milestone) => milestone.done).length;
  return { ...goal, progress: goal.milestones.length ? Math.round((completed / goal.milestones.length) * 100) : 0 };
}

function withProjectProgress(state: WorkspaceState): WorkspaceState {
  return {
    ...state,
    projects: state.projects.map((project) => {
      const tasks = state.tasks.filter((task) => task.projectId === project.id);
      const complete = tasks.filter((task) => task.status === "DONE").length;
      return { ...project, progress: tasks.length ? Math.round((complete / tasks.length) * 100) : 0 };
    }),
  };
}

export function WorkspaceProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; name: string; email?: string | null };
}) {
  const [state, setState] = useState<WorkspaceState>(() => {
    if (typeof window === "undefined") return createEmptyWorkspace();
    return parseWorkspace(localStorage.getItem(storageKey(user.id)));
  });
  const ready = typeof window !== "undefined";

  useEffect(() => {
    localStorage.setItem(storageKey(user.id), JSON.stringify(state));
  }, [ready, state, user.id]);

  const addTask = useCallback((task: Omit<Task, "id" | "tags"> & { tags?: string[] }) => {
    setState((current) => withProjectProgress({ ...current, tasks: [{ ...task, id: id(), tags: task.tags ?? [] }, ...current.tasks] }));
  }, []);
  const updateTask = useCallback((taskId: string, changes: Partial<Omit<Task, "id">>) => {
    setState((current) => withProjectProgress({
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId
        ? {
            ...task,
            ...changes,
            completedAt: changes.status === "DONE"
              ? format(new Date(), "yyyy-MM-dd")
              : changes.status
                ? undefined
                : task.completedAt,
          }
        : task),
    }));
  }, []);
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setState((current) => withProjectProgress({
      ...current,
      tasks: current.tasks.map((task) => task.id === taskId
        ? { ...task, status, completedAt: status === "DONE" ? format(new Date(), "yyyy-MM-dd") : undefined }
        : task),
    }));
  }, []);
  const deleteTask = useCallback((taskId: string) => {
    setState((current) => withProjectProgress({ ...current, tasks: current.tasks.filter((task) => task.id !== taskId) }));
  }, []);

  const addProject = useCallback((project: Omit<Project, "id" | "progress"> & { progress?: number }) => {
    setState((current) => ({ ...current, projects: [{ ...project, id: id(), progress: project.progress ?? 0 }, ...current.projects] }));
  }, []);
  const updateProject = useCallback((projectId: string, changes: Partial<Omit<Project, "id">>) => {
    setState((current) => ({ ...current, projects: current.projects.map((project) => project.id === projectId ? { ...project, ...changes } : project) }));
  }, []);
  const deleteProject = useCallback((projectId: string) => {
    setState((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== projectId),
      tasks: current.tasks.map((task) => task.projectId === projectId ? { ...task, projectId: undefined } : task),
    }));
  }, []);

  const addSchedule = useCallback((schedule: Omit<ScheduleItem, "id">) => {
    setState((current) => ({ ...current, schedules: [...current.schedules, { ...schedule, id: id() }] }));
  }, []);
  const updateSchedule = useCallback((scheduleId: string, changes: Partial<Omit<ScheduleItem, "id">>) => {
    setState((current) => ({ ...current, schedules: current.schedules.map((schedule) => schedule.id === scheduleId ? { ...schedule, ...changes } : schedule) }));
  }, []);
  const deleteSchedule = useCallback((scheduleId: string) => {
    setState((current) => ({ ...current, schedules: current.schedules.filter((schedule) => schedule.id !== scheduleId) }));
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, "id" | "completedDates" | "longestStreak"> & { completedDates?: string[]; longestStreak?: number }) => {
    setState((current) => ({ ...current, habits: [{ ...habit, id: id(), completedDates: habit.completedDates ?? [], longestStreak: habit.longestStreak ?? 0 }, ...current.habits] }));
  }, []);
  const updateHabit = useCallback((habitId: string, changes: Partial<Omit<Habit, "id">>) => {
    setState((current) => ({ ...current, habits: current.habits.map((habit) => habit.id === habitId ? { ...habit, ...changes } : habit) }));
  }, []);
  const deleteHabit = useCallback((habitId: string) => {
    setState((current) => ({ ...current, habits: current.habits.filter((habit) => habit.id !== habitId) }));
  }, []);
  const toggleHabit = useCallback((habitId: string) => {
    setState((current) => {
      const today = format(new Date(), "yyyy-MM-dd");
      return {
        ...current,
        habits: current.habits.map((habit) => habit.id !== habitId
          ? habit
          : {
              ...habit,
              completedDates: habit.completedDates.includes(today)
                ? habit.completedDates.filter((date) => date !== today)
                : [...habit.completedDates, today],
            }),
      };
    });
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id" | "progress" | "milestones"> & { progress?: number; milestones?: Goal["milestones"] }) => {
    const next = withGoalProgress({ ...goal, id: id(), progress: goal.progress ?? 0, milestones: goal.milestones ?? [] });
    setState((current) => ({ ...current, goals: [next, ...current.goals] }));
  }, []);
  const updateGoal = useCallback((goalId: string, changes: Partial<Omit<Goal, "id">>) => {
    setState((current) => ({ ...current, goals: current.goals.map((goal) => goal.id === goalId ? withGoalProgress({ ...goal, ...changes }) : goal) }));
  }, []);
  const deleteGoal = useCallback((goalId: string) => {
    setState((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== goalId) }));
  }, []);
  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setState((current) => ({
      ...current,
      goals: current.goals.map((goal) => goal.id !== goalId
        ? goal
        : withGoalProgress({ ...goal, milestones: goal.milestones.map((milestone) => milestone.id === milestoneId ? { ...milestone, done: !milestone.done } : milestone) })),
    }));
  }, []);

  const addFocusSession = useCallback((session: Omit<FocusSession, "id" | "date"> & { date?: string }) => {
    setState((current) => ({ ...current, focusSessions: [{ ...session, id: id(), date: session.date ?? format(new Date(), "yyyy-MM-dd") }, ...current.focusSessions] }));
  }, []);
  const updateFocusSession = useCallback((sessionId: string, changes: Partial<Omit<FocusSession, "id">>) => {
    setState((current) => ({ ...current, focusSessions: current.focusSessions.map((session) => session.id === sessionId ? { ...session, ...changes } : session) }));
  }, []);
  const deleteFocusSession = useCallback((sessionId: string) => {
    setState((current) => ({ ...current, focusSessions: current.focusSessions.filter((session) => session.id !== sessionId) }));
  }, []);

  const saveNote = useCallback((note: Omit<Note, "id" | "updatedAt"> & { id?: string }) => {
    setState((current) => {
      const updated = { ...note, id: note.id ?? id(), updatedAt: format(new Date(), "yyyy-MM-dd") } as Note;
      return { ...current, notes: note.id ? current.notes.map((item) => item.id === note.id ? updated : item) : [updated, ...current.notes] };
    });
  }, []);
  const deleteNote = useCallback((noteId: string) => {
    setState((current) => ({ ...current, notes: current.notes.filter((note) => note.id !== noteId) }));
  }, []);
  const markNotificationsRead = useCallback(() => {
    setState((current) => ({ ...current, notifications: current.notifications.map((notification) => ({ ...notification, read: true })) }));
  }, []);

  const value = useMemo(() => ({
    ...state,
    user,
    ready,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    addFocusSession,
    updateFocusSession,
    deleteFocusSession,
    saveNote,
    deleteNote,
    markNotificationsRead,
  }), [
    addFocusSession, addGoal, addHabit, addProject, addSchedule, addTask, deleteFocusSession, deleteGoal, deleteHabit,
    deleteNote, deleteProject, deleteSchedule, deleteTask, markNotificationsRead, ready, saveNote, state, toggleHabit,
    toggleMilestone, updateFocusSession, updateGoal, updateHabit, updateProject, updateSchedule, updateTask,
    updateTaskStatus, user,
  ]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
}

export function useTodayHabits(habits: Habit[]) {
  const today = format(new Date(), "yyyy-MM-dd");
  return habits.filter((habit) => habit.completedDates.includes(today));
}
