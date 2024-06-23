import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";

export const availableTools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
  },
];

export const sidebarRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  ...availableTools,
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const MAX_FREE_TRAILS = 5;
