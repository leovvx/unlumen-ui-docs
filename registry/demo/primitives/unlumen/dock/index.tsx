"use client";

import {
  Globe02Icon as Globe,
  FolderOpenIcon as FolderOpen,
  MusicNote01Icon as Music,
  Image01Icon as Image,
  Settings01Icon as Settings,
  BubbleChatIcon as MessageCircle,
  ComputerTerminal01Icon as Terminal,
} from "hugeicons-react";

import { Dock, type DockItem } from "@/registry/primitives/unlumen/dock";

const ITEMS: DockItem[] = [
  { icon: <Globe />, label: "Browser" },
  { icon: <FolderOpen />, label: "Files" },
  { icon: <Terminal />, label: "Terminal" },
  { icon: <Music />, label: "Music", separator: true },
  { icon: <Image />, label: "Photos" },
  { icon: <MessageCircle />, label: "Messages", separator: true },
  { icon: <Settings />, label: "Settings" },
];

interface DockDemoProps {
  magnification?: number;
  distance?: number;
  iconSize?: number;
  gap?: number;
  alwaysShowLabels?: boolean;
  borderRadius?: number;
}

export const DockDemo = ({
  magnification,
  distance,
  iconSize,
  gap,
  alwaysShowLabels,
  borderRadius,
}: DockDemoProps) => {
  return (
    <div className="flex items-end justify-center p-16 min-h-[200px]">
      <Dock
        items={ITEMS}
        magnification={magnification}
        distance={distance}
        iconSize={iconSize}
        gap={gap}
        alwaysShowLabels={alwaysShowLabels}
        borderRadius={borderRadius}
      />
    </div>
  );
};

export default DockDemo;
