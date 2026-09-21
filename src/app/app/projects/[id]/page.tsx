"use client";

import { useParams } from "next/navigation";
import { ProjectDetail } from "@/features/projects/projects-page";

export default function ProjectRoute() {
  const params = useParams<{ id: string }>();
  return <ProjectDetail id={params.id} />;
}
