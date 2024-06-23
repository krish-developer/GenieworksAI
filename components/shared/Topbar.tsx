"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/shared/Sidebar";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

interface TopbarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Topbar = ({ apiLimitCount, isPro }: TopbarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="flex justify-between items-center p-4">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-fit border-none text-white">
          <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        </SheetContent>
      </Sheet>

      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2 md:hidden",
          montserrat.className
        )}
      >
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">GenieworksAI</h1>
          {isPro && <Badge className="text-sm">PRO</Badge>}
        </div>
      </Link>

      <div className="md:w-full md:flex md:justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Topbar;
