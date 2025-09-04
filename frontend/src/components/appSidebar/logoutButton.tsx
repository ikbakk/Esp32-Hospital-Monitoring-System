"use client";

import { firebaseSignOut } from "@/lib/firebaseAuth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant={"destructive"}
      onClick={() => firebaseSignOut()}
      className="group/logout active:text-destructive-foreground outline-bl hover:text-destructive-foreground outline hover:cursor-pointer hover:bg-destructive/90 active:bg-destructive"
    >
      <span>Logout</span>
      <LogOut className="transition-all duration-100 group-hover/logout:translate-x-2" />
    </Button>
  );
}
