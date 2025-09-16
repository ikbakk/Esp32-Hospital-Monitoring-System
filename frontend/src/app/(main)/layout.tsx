import { AppSidebar } from "@/components/appSidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col gap-2 p-4">
        <Breadcrumbs />
        {children}
      </main>
    </SidebarProvider>
  );
}
