"use client";

import * as React from "react";
import {
  AnimatedList,
  type AnimationType,
} from "@/registry/primitives/unlumen/animated-list";

type Notification = {
  id: number;
  icon: string;
  title: string;
  description: string;
  time: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: "💳",
    title: "Payment received",
    description: "acme@corp.com · $2,400.00",
    time: "just now",
  },
  {
    id: 2,
    icon: "🚀",
    title: "Deployment succeeded",
    description: "main · production · 12s",
    time: "1m ago",
  },
  {
    id: 3,
    icon: "🔔",
    title: "New subscriber",
    description: "leo@unlumen.dev joined Pro",
    time: "2m ago",
  },
  {
    id: 4,
    icon: "🛡️",
    title: "Security alert",
    description: "New login from Paris, FR",
    time: "5m ago",
  },
  {
    id: 5,
    icon: "📦",
    title: "Order shipped",
    description: "Order #8821 is on its way",
    time: "8m ago",
  },
  {
    id: 6,
    icon: "⭐",
    title: "New review",
    description: '5 stars · "Absolutely love it"',
    time: "10m ago",
  },
];

function NotificationItem({ item }: { item: Notification }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background/60 px-4 py-3 backdrop-blur-sm">
      <span className="text-xl leading-none mt-0.5">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate">
          {item.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {item.description}
        </p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
        {item.time}
      </span>
    </div>
  );
}

interface AnimatedListDemoProps {
  maxVisible?: number;
  gap?: number;
  animation?: AnimationType;
}

export const AnimatedListDemo = ({
  maxVisible = 8,
  gap = 12,
  animation = "scale",
}: AnimatedListDemoProps) => {
  const [items, setItems] = React.useState<Notification[]>(
    NOTIFICATIONS.slice(0, 3),
  );
  const counterRef = React.useRef(100);

  React.useEffect(() => {
    const pool = [...NOTIFICATIONS];
    let poolIndex = 0;

    const interval = setInterval(() => {
      const source = pool[poolIndex % pool.length];
      poolIndex++;
      const newItem: Notification = {
        ...source,
        id: counterRef.current++,
        time: "just now",
      };
      setItems((prev) => [newItem, ...prev].slice(0, maxVisible));
    }, 2000);

    return () => clearInterval(interval);
  }, [maxVisible]);

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <AnimatedList
        items={items}
        renderItem={(item) => <NotificationItem item={item} />}
        maxVisible={maxVisible}
        gap={gap}
        animation={animation}
      />
    </div>
  );
};

export default AnimatedListDemo;
