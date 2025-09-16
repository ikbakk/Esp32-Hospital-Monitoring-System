"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const path = usePathname();
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
