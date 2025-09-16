import { Calendar, Home, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarSearchForm } from "../sidebarSearchForm";
import PagesList from "./pagesList";
import WardStatus from "./wardStatus";
import LogoutButton from "./logoutButton";
import AppSidebarHeader from "./sidebarHeader";

export const pagesList = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Patient Records",
    url: "/records",
    icon: Calendar,
  },
];

const patientCount = {
  warning: 0,
  critical: 0,
  normal: 0,
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
        <SidebarSearchForm />
      </SidebarHeader>

      <SidebarContent>
        <WardStatus patientCount={patientCount} />
        <PagesList pages={pagesList} />

        <SidebarMenu className="mt-auto">
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <LogoutButton />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
