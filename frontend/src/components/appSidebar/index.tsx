import { Calendar, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarSearchForm } from "../sidebarSearchForm";
import PagesList from "./pagesList";
import WardStatus from "./wardStatus";

const pagesList = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Patient Records",
    url: "records",
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
        <WardStatus patientCount={patientCount} />
        <PagesList pages={pagesList} />
      </SidebarContent>
    </Sidebar>
  );
}
