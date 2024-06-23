import React from "react";
import Image from "next/image";

interface NoContentProps {
  label: string;
}

const NoContent = ({ label }: NoContentProps) => {
  return (
    <div className="h-full p-10 sm:p-20 flex flex-col items-center justify-center">
      <div className="relative h-[220px] w-[400px]">
        <Image src="/no-content.png" fill alt="Empty" />
      </div>
      <p className="text-muted-foreground text-center">{label}</p>
    </div>
  );
};

export default NoContent;
