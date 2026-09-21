"use client";

import { Archive, FilePlus2, Pin, Search, Tag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/features/workspace/page-header";
import { useWorkspace } from "@/features/workspace/workspace-provider";
import type { Note } from "@/features/workspace/types";
import { cn } from "@/lib/utils";

export function NotesPage() {
  const { notes, saveNote, deleteNote } = useWorkspace();
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const selected = notes.find((note) => note.id === selectedId) ?? notes[0];
  const filtered = useMemo(() => notes.filter((note) => !note.archived && `${note.title} ${note.content} ${note.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [notes, query]);
  const create = () => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
    saveNote({ id, title: "Untitled note", content: "", tags: [], pinned: false, archived: false });
    setSelectedId(id);
  };
  const remove = (noteId: string) => {
    deleteNote(noteId);
    setSelectedId(notes.find((note) => note.id !== noteId)?.id ?? "");
  };
  return <div className="mx-auto max-w-[1480px] space-y-6"><PageHeader eyebrow="Capture what matters" title="Notes" description="Start with a blank space and capture only the ideas that belong to you." actions={<Button onClick={create}><FilePlus2 className="size-4" />New note</Button>} /><Card className="grid min-h-[620px] overflow-hidden lg:grid-cols-[310px_minmax(0,1fr)]"><aside className="border-b p-4 lg:border-b-0 lg:border-r"><label className="flex h-10 items-center gap-2 rounded-xl bg-[var(--muted)] px-3"><Search className="size-4 text-[var(--muted-foreground)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search notes" /></label><div className="mt-4 space-y-1">{filtered.map((note) => <button key={note.id} onClick={() => setSelectedId(note.id)} className={cn("w-full rounded-xl p-3 text-left transition", note.id === selected?.id ? "bg-violet-500/10" : "hover:bg-[var(--muted)]")}><div className="flex items-center gap-2"><p className="min-w-0 flex-1 truncate text-sm font-semibold">{note.title}</p>{note.pinned ? <Pin className="size-3.5 text-[var(--primary)]" /> : null}</div><p className="mt-1 line-clamp-1 text-xs text-[var(--muted-foreground)]">{note.content || "No content yet"}</p><p className="mt-2 text-[10px] text-[var(--muted-foreground)]">Updated {note.updatedAt}</p></button>)}{filtered.length === 0 ? <p className="p-5 text-center text-sm text-[var(--muted-foreground)]">No notes yet. Create the first one when you are ready.</p> : null}</div></aside>{selected ? <Editor key={selected.id} note={selected} onSave={saveNote} onDelete={remove} /> : <div className="grid place-items-center p-8 text-center"><FilePlus2 className="mb-3 size-7 text-[var(--muted-foreground)]" /><p className="font-medium">Start with a blank page</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Create your first note to capture an idea before it disappears.</p></div>}</Card></div>;
}

function Editor({ note, onSave, onDelete }: { note: Note; onSave: ReturnType<typeof useWorkspace>["saveNote"]; onDelete: (noteId: string) => void }) {
  const [title, setTitle] = useState(note.title); const [content, setContent] = useState(note.content); const [tags, setTags] = useState(note.tags.join(", "));
  const save = () => onSave({ ...note, title: title.trim() || "Untitled note", content, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
  const toggle = (changes: Partial<Note>) => onSave({ ...note, title, content, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), ...changes });
  return <article className="flex min-w-0 flex-col p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><span>Saved in your workspace</span><span>·</span><span>{note.updatedAt}</span></div><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => toggle({ pinned: !note.pinned })} aria-label="Pin note"><Pin className="size-4" /></Button><Button size="sm" variant="ghost" onClick={() => toggle({ archived: !note.archived })} aria-label="Archive note"><Archive className="size-4" /></Button><Button size="sm" variant="ghost" onClick={() => onDelete(note.id)} aria-label="Delete note"><Trash2 className="size-4" /></Button></div></div><input value={title} onChange={(event) => setTitle(event.target.value)} onBlur={save} className="mt-7 w-full bg-transparent text-2xl font-semibold tracking-tight outline-none" placeholder="Note title" /><textarea value={content} onChange={(event) => setContent(event.target.value)} onBlur={save} className="mt-5 min-h-72 w-full resize-none bg-transparent text-sm leading-7 text-[var(--muted-foreground)] outline-none" placeholder="Start writing…" /><div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-4"><Tag className="size-4 text-[var(--muted-foreground)]" /><input value={tags} onChange={(event) => setTags(event.target.value)} onBlur={save} className="min-w-32 bg-transparent text-xs outline-none" placeholder="Add tags, comma separated" />{tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => <Badge key={tag} tone="violet">{tag}</Badge>)}</div></article>;
}
