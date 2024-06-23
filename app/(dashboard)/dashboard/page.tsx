"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { availableTools } from "@/constants";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <section>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power in AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chatr with the smartest AI - Experience the power of AI
        </p>
      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {availableTools.map((tool) => (
          <Card
            key={tool.label}
            className="p-4 border-black/10 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            onClick={() => router.push(tool.href)}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 w-fit rounded-md bg-blue-500/10 text-blue-500">
                <tool.icon size={32} />
              </div>
              <p className="font-semibold">{tool.label}</p>
            </div>
            <div>
              <ArrowRight size={24} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
