"use client";

import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, CheckCircle2, Clock3, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/features/workspace/page-header";
import { QuickCreate } from "@/features/workspace/quick-create";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import type { Task, TaskStatus } from "@/features/workspace/types";
import { cn } from "@/lib/utils";

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: "BACKLOG", title: "Backlog", color: "bg-slate-400" },
  { status: "TODO", title: "Ready", color: "bg-blue-500" },
  { status: "IN_PROGRESS", title: "In progress", color: "bg-violet-500" },
  { status: "DONE", title: "Done", color: "bg-emerald-500" },
];

const priorityTone = { LOW: "slate", MEDIUM: "blue", HIGH: "amber", URGENT: "rose" } as const;

export function TaskBoard() {
  const { tasks, projects, updateTaskStatus, updateTask, deleteTask } = useWorkspace();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const stats = useMemo(() => ({ done: tasks.filter((task) => task.status === "DONE").length, active: tasks.filter((task) => task.status === "IN_PROGRESS").length, hours: Math.round(tasks.filter((task) => task.status !== "DONE").reduce((sum, task) => sum + task.estimatedMinutes, 0) / 60 * 10) / 10 }), [tasks]);
  const handleDragEnd = (event: DragEndEvent) => { const taskId = String(event.active.id); const nextStatus = event.over?.id as TaskStatus | undefined; if (nextStatus && columns.some((column) => column.status === nextStatus)) updateTaskStatus(taskId, nextStatus); setActiveTask(null); };
  return <div className="mx-auto max-w-[1480px] space-y-6"><PageHeader eyebrow="Make progress visible" title="Tasks" description="Start with an empty board and add only the work that belongs to you." actions={<QuickCreate />} /><section className="grid gap-4 sm:grid-cols-3"><Stat label="Completed" value={`${stats.done}`} detail="tasks shipped" icon={<CheckCircle2 className="size-5" />} /><Stat label="In motion" value={`${stats.active}`} detail="being actively worked" icon={<Clock3 className="size-5" />} /><Stat label="Remaining estimate" value={`${stats.hours}h`} detail="across open tasks" icon={<Calendar className="size-5" />} /></section><DndContext sensors={sensors} onDragStart={(event) => setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null)} onDragEnd={handleDragEnd} onDragCancel={() => setActiveTask(null)}><div className="grid gap-4 xl:grid-cols-4">{columns.map((column) => <TaskColumn key={column.status} {...column} tasks={tasks.filter((task) => task.status === column.status)} projects={projects} onEdit={setEditingTask} onDelete={deleteTask} />)}</div><DragOverlay dropAnimation={null}>{activeTask ? <TaskCard task={activeTask} projectName={projects.find((project) => project.id === activeTask.projectId)?.name} isOverlay /> : null}</DragOverlay></DndContext>{editingTask ? <TaskEditor key={editingTask.id} task={editingTask} projects={projects} onClose={() => setEditingTask(null)} onSave={(changes) => { updateTask(editingTask.id, changes); setEditingTask(null); }} /> : null}</div>;
}

function TaskColumn({ status, title, color, tasks, projects, onEdit, onDelete }: { status: TaskStatus; title: string; color: string; tasks: Task[]; projects: ReturnType<typeof useWorkspace>["projects"]; onEdit: (task: Task) => void; onDelete: (taskId: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return <section ref={setNodeRef} className={cn("min-h-80 rounded-2xl border border-dashed p-3 transition", isOver ? "border-violet-400 bg-violet-500/[.04]" : "border-[var(--border)] bg-[var(--muted)]/35")}><header className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={cn("size-2 rounded-full", color)} /><h2 className="text-sm font-semibold">{title}</h2><span className="text-xs text-[var(--muted-foreground)]">{tasks.length}</span></div><button className="rounded-md p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]" aria-label={`Add task to ${title}`}><Plus className="size-4" /></button></header><div className="space-y-2">{tasks.map((task) => <DraggableTask key={task.id} task={task} projectName={projects.find((project) => project.id === task.projectId)?.name} onEdit={onEdit} onDelete={onDelete} />)}</div>{tasks.length === 0 ? <p className="px-2 py-8 text-center text-xs text-[var(--muted-foreground)]">Drop a task here</p> : null}</section>;
}

function DraggableTask({ task, projectName, onEdit, onDelete }: { task: Task; projectName?: string; onEdit: (task: Task) => void; onDelete: (taskId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  return <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }} className={cn(isDragging && "opacity-25")} {...listeners} {...attributes}><TaskCard task={task} projectName={projectName} onEdit={onEdit} onDelete={onDelete} /></div>;
}

function TaskCard({ task, projectName, isOverlay, onEdit, onDelete }: { task: Task; projectName?: string; isOverlay?: boolean; onEdit?: (task: Task) => void; onDelete?: (taskId: string) => void }) {
  const stop = (event: React.PointerEvent | React.MouseEvent) => event.stopPropagation();
  return <article className={cn("surface cursor-grab rounded-xl p-3.5 transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing", isOverlay && "w-72 rotate-2 shadow-xl")}><div className="flex items-start gap-2"><GripVertical className="mt-0.5 size-4 shrink-0 text-slate-300 dark:text-slate-600" /><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold leading-5">{task.title}</h3>{task.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted-foreground)]">{task.description}</p> : null}</div>{onEdit && onDelete ? <div className="flex shrink-0"><button onPointerDown={stop} onClick={(event) => { stop(event); onEdit(task); }} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]" aria-label="Edit task"><Pencil className="size-3.5" /></button><button onPointerDown={stop} onClick={(event) => { stop(event); onDelete(task.id); }} className="rounded p-1 text-rose-500 hover:bg-rose-500/10" aria-label="Delete task"><Trash2 className="size-3.5" /></button></div> : null}</div><div className="mt-4 flex flex-wrap items-center gap-1.5">{projectName ? <Badge tone="violet">{projectName}</Badge> : null}<Badge tone={priorityTone[task.priority]}>{task.priority.toLowerCase()}</Badge></div><div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{task.estimatedMinutes}m</span>{task.dueDate ? <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{task.dueDate.slice(5)}</span> : null}</div></article>;
}

function TaskEditor({ task, projects, onClose, onSave }: { task: Task; projects: ReturnType<typeof useWorkspace>["projects"]; onClose: () => void; onSave: (changes: Partial<Omit<Task, "id">>) => void }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(String(task.estimatedMinutes));
  const [projectId, setProjectId] = useState(task.projectId ?? "");
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent><DialogTitle>Edit task</DialogTitle><DialogDescription>Update this task or remove it from the board when it is no longer relevant.</DialogDescription><form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); onSave({ title: title.trim() || "Untitled task", description: description.trim() || undefined, priority, status, dueDate: dueDate || undefined, estimatedMinutes: Math.max(0, Number(estimatedMinutes) || 0), projectId: projectId || undefined }); }}><label className="block text-sm font-medium">Title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3" /></label><label className="block text-sm font-medium">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-20 w-full rounded-xl border bg-transparent p-3 text-sm" /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3 text-sm">{columns.map((column) => <option key={column.status} value={column.status}>{column.title}</option>)}</select></label><label className="text-sm font-medium">Priority<select value={priority} onChange={(event) => setPriority(event.target.value as Task["priority"])} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3 text-sm">{Object.keys(priorityTone).map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-sm font-medium">Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3 text-sm" /></label><label className="text-sm font-medium">Estimate (minutes)<input type="number" min="0" value={estimatedMinutes} onChange={(event) => setEstimatedMinutes(event.target.value)} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3 text-sm" /></label></div><label className="block text-sm font-medium">Project<select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="mt-2 h-10 w-full rounded-xl border bg-transparent px-3 text-sm"><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="h-10 rounded-xl px-4 text-sm hover:bg-[var(--muted)]">Cancel</button><button type="submit" className="h-10 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white">Save changes</button></div></form></DialogContent></Dialog>;
}

function Stat({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return <Card className="flex items-center gap-4 p-4"><span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-[var(--primary)]">{icon}</span><div><p className="text-xl font-semibold tracking-tight">{value}</p><p className="text-xs text-[var(--muted-foreground)]">{label} · {detail}</p></div></Card>;
}
