"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarPlus, CheckSquare, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWorkspace } from "./workspace-provider";

const schema = z.object({ title: z.string().min(2, "Give this a little more detail."), type: z.enum(["task", "schedule"]), startTime: z.string(), endTime: z.string() });
type FormValues = z.infer<typeof schema>;

export function QuickCreate({ defaultType = "task", compact = false }: { defaultType?: FormValues["type"]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const { addTask, addSchedule } = useWorkspace();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: "", type: defaultType, startTime: "09:00", endTime: "10:00" } });
  const [type, setType] = useState<FormValues["type"]>(defaultType);
  const submit = (values: FormValues) => {
    if (values.type === "task") addTask({ title: values.title, status: "TODO", priority: "MEDIUM", dueDate: format(new Date(), "yyyy-MM-dd"), estimatedMinutes: 30 });
    else addSchedule({ title: values.title, date: format(new Date(), "yyyy-MM-dd"), startTime: values.startTime, endTime: values.endTime, category: "Personal", color: "#6958e6", priority: "MEDIUM", repeat: "NONE" });
    form.reset({ title: "", type: values.type, startTime: "09:00", endTime: "10:00" }); setType(values.type); setOpen(false);
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size={compact ? "sm" : "default"}><span className="text-lg leading-none">+</span>{compact ? "New" : "Create new"}</Button></DialogTrigger><DialogContent><DialogTitle>Capture it while it’s fresh</DialogTitle><DialogDescription>Add a task or reserve time in today’s plan.</DialogDescription><form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}><label className="block text-sm font-medium">What needs your attention?<input autoFocus placeholder="e.g. Review the design notes" className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("title")} /></label>{form.formState.errors.title ? <p className="text-xs text-rose-600">{form.formState.errors.title.message}</p> : null}<div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Type<select className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("type", { onChange: (event) => setType(event.target.value as FormValues["type"]) })}><option value="task">Task</option><option value="schedule">Schedule</option></select></label>{type === "schedule" ? <><label className="text-sm font-medium">Starts<input type="time" className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("startTime")} /></label><label className="text-sm font-medium">Ends<input type="time" className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm" {...form.register("endTime")} /></label></> : <div className="flex items-end text-sm text-[var(--muted-foreground)]"><CheckSquare className="mr-2 size-4" /> Added to Today</div>}</div><Button type="submit" className="w-full">{form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : type === "task" ? <CheckSquare className="size-4" /> : <CalendarPlus className="size-4" />}Add to workspace</Button></form></DialogContent></Dialog>;
}
