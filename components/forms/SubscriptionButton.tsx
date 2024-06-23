"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Loader } from "../ui/loader";

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");

      router.push(response.data.url);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={isLoading} size="lg" onClick={handleClick}>
      {isLoading && <Loader size={16} className="mr-2" />}
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
      {!isPro && <Zap size={16} className="ml-2" />}
    </Button>
  );
};

export default SubscriptionButton;
