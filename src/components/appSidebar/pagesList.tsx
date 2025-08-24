import { Separator } from "@radix-ui/react-separator";
import { type LucideIcon, Settings } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type SidebarPageNav = {
  title: string;
  url: string;
  icon: LucideIcon;
};

interface PagesListProps {
  pages: SidebarPageNav[];
}

const PagesList = ({ pages }: PagesListProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {pages.map((page) => (
            <SidebarMenuItem key={page.title}>
              <SidebarMenuButton asChild>
                <Link href={page.url}>
                  <page.icon />
                  <span>{page.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default PagesList;
