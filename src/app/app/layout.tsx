import { AppShell } from "@/features/workspace/app-shell";
import { WorkspaceProvider } from "@/features/workspace/workspace-provider";
import { auth } from "@/auth";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;
  const workspaceUser = {
    id: user?.id ?? "demo",
    name: user?.name?.trim() || user?.email?.split("@")[0] || "Guest",
    email: user?.email,
  };

  return <WorkspaceProvider key={workspaceUser.id} user={workspaceUser}><AppShell>{children}</AppShell></WorkspaceProvider>;
}
