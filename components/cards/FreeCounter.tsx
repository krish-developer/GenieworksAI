import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { MAX_FREE_TRAILS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import useProModal from "@/hooks/useProModal";

interface FreeCounterProps {
  apiLimitCounter: number;
  isPro: boolean;
}

const FreeCounter = ({
  apiLimitCounter = 0,
  isPro = false,
}: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);

  const { onOpen } = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isPro) return null;

  return (
    <Card className="bg-white/10 border-0">
      <CardContent className="py-6">
        <div className="text-center text-sm text-white mb-4 space-y-2">
          <p>
            {apiLimitCounter} / {MAX_FREE_TRAILS} Free Generations
          </p>
          <Progress
            className="h-3 bg-white/90"
            value={(apiLimitCounter / MAX_FREE_TRAILS) * 100}
          />
        </div>
        <Button className="w-full" onClick={onOpen}>
          Upgrade <Zap size={16} className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FreeCounter;
