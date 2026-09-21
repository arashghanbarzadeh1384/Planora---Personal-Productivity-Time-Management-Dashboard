export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type RepeatRule = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  color: string;
  deadline: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: string;
  dueDate?: string;
  estimatedMinutes: number;
  completedAt?: string;
  tags: string[];
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
  priority: Priority;
  location?: string;
  repeat: RepeatRule;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  target: number;
  completedDates: string[];
  longestStreak: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  deadline: string;
  milestones: { id: string; title: string; done: boolean }[];
}

export interface FocusSession {
  id: string;
  minutes: number;
  date: string;
  taskId?: string;
  label: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  kind: "REMINDER" | "SUCCESS" | "INFO";
}

export interface WorkspaceState {
  projects: Project[];
  tasks: Task[];
  schedules: ScheduleItem[];
  habits: Habit[];
  goals: Goal[];
  focusSessions: FocusSession[];
  notes: Note[];
  notifications: NotificationItem[];
}
