"use client";

import React from "react";
import { Check, Zap } from "lucide-react";

import { availableTools } from "@/constants";
import useProModal from "@/hooks/useProModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useProModal();

  const handleUpgrade = async () => {
    try {
      const response = await axios.get("/api/stripe");

      router.push(response.data.url);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-4 pb-2">
            <div className="flex items-center gap-2 font-bold py-1">
              <p>Upgrade to GenieworksAI</p>
              <Badge className="text-sm">PRO</Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {availableTools.map((tool) => (
              <Card
                key={tool.label}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-md bg-primary/10">
                    <tool.icon size={24} className="text-primary" />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check size={24} className="text-primary" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" size="lg" onClick={handleUpgrade}>
            Upgrade
            <Zap size={16} className="ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
