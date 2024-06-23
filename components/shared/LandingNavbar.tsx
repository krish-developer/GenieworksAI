"use client";

import React from "react";
import { Montserrat } from "next/font/google";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="py-8 px-4 bg-transparent flex items-center justify-between">
      <Link
        href="/"
        className={cn("flex items-center gap-4", montserrat.className)}
      >
        <Image src="/logo.png" alt="logo" width={48} height={48} />
        <h1 className="text-background font-bold text-3xl">GenieworksAI</h1>
      </Link>
      <div className="flex items-center gap-2">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            variant="outline"
            className="rounded-full font-semibold group"
          >
            {isSignedIn ? "Dashboard" : "Get Started"}
            <ArrowRightIcon
              size={16}
              className="ml-2 hidden group-hover:block transition"
            />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
