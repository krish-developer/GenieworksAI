import { LucideIcon } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const Header = ({ title, description, icon: Icon }: HeaderProps) => {
  return (
    <div className="flex items-center gap-4 my-8 md:mt-0">
      <div className="w-fit p-2 bg-blue-500/10 rounded-md">
        <Icon size={32} className="text-blue-500" />
      </div>
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Header;
