import { Calendar, Home, Inbox } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarSearchForm } from "../sidebarSearchForm";
import PagesList from "./pagesList";

// Menu items.
const pagesList = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Graphs",
    url: "graphs",
    icon: Inbox,
  },
  {
    title: "History",
    url: "history",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span className="font-bold text-lg">Hospital Ward Monitor</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ward Status</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            a
          </SidebarGroupContent>
        </SidebarGroup>

        <PagesList pages={pagesList} />
      </SidebarContent>
    </Sidebar>
  );
}
