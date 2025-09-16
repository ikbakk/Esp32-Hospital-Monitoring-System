"use client";

import { firebaseSignOut } from "@/lib/firebaseAuth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function LogoutButton() {
  const { state } = useSidebar();
  return (
    <Button
      variant={"destructive"}
      onClick={() => firebaseSignOut()}
      className="group/logout active:text-destructive-foreground outline-bl hover:text-destructive-foreground w-full outline hover:cursor-pointer hover:bg-destructive/90 active:bg-destructive"
    >
      <span className={state === "collapsed" ? "hidden" : ""}>Logout</span>
      <LogOut
        className={
          state === "collapsed"
            ? ""
            : "transition-all duration-100 group-hover/logout:translate-x-2"
        }
      />
    </Button>
  );
}
