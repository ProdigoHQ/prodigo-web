import type { CSSProperties, ReactNode } from "react";
import { cookies } from "next/headers";
import RequireAuth from "@/modules/auth/adapters/in/ui/require-auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import AppHeader from "@/components/shared/app-header";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <RequireAuth>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "17.5rem",
            "--sidebar-width-icon": "4.5rem",
          } as CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-zinc-50">
          <AppHeader />
          <div className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
