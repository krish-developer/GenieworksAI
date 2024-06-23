"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

import { sidebarRoutes } from "@/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import FreeCounter from "@/components/cards/FreeCounter";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 w-72 h-full overflow-auto flex flex-col bg-gray-900 text-white py-5">
      <div className="flex-1 py-2 px-4">
        <Link
          href="/dashboard"
          className={cn("flex items-center gap-4 mb-12", montserrat.className)}
        >
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-3xl">GenieworksAI</h1>
            {isPro && <Badge className="text-sm">PRO</Badge>}
          </div>
        </Link>
        <div className="space-y-1">
          {sidebarRoutes.map((route) => (
            <Link
              href={route.href}
              key={route.label}
              className={cn(
                "text-sm p-3 w-full flex justify-start font-medium cursor-pointer hover:text-blue-500 hover:bg-white/10 rounded-lg transition",
                pathname === route.href && "bg-white/10 text-blue-500"
              )}
            >
              <div className="flex items-center gap-2">
                <route.icon size={24} />
                <p>{route.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="py-2 px-4">
        <FreeCounter apiLimitCounter={apiLimitCount} isPro={isPro} />
      </div>
    </div>
  );
};

export default Sidebar;
