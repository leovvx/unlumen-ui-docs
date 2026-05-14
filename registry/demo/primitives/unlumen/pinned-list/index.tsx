"use client";

import {
  BookOpen01Icon as BookOpen,
  Car01Icon as Car,
  Coffee01Icon as Coffee,
  Dumbbell01Icon as Dumbbell,
  Home01Icon as Home,
  Leaf01Icon as Leaf,
  MusicNote02Icon as Music2,
  ShoppingBag01Icon as ShoppingBag,
} from "hugeicons-react";

import {
  PinnedList,
  type PinnedListItem,
} from "@/registry/primitives/unlumen/pinned-list";

const ITEMS: PinnedListItem[] = [
  {
    id: "1",
    name: "Café Lumière",
    subtitle: "Coffee Shop · Opens at 7:00 AM",
    icon: <Coffee size={22} />,
  },
  {
    id: "2",
    name: "Volta Bookstore",
    subtitle: "Books & Stationery · Closes at 7:00 PM",
    icon: <BookOpen size={22} />,
  },
  {
    id: "3",
    name: "Pilates Studio",
    subtitle: "Wellness · Class at 8:30 AM",
    icon: <Dumbbell size={22} />,
  },
  {
    id: "4",
    name: "Organic Market",
    subtitle: "Fresh Produce · Sat. & Sun. mornings",
    icon: <Leaf size={22} />,
  },
  {
    id: "5",
    name: "Vinyl & Co.",
    subtitle: "Record Shop · Closes at 8:00 PM",
    icon: <Music2 size={22} />,
  },
];

const PinnedListDemo = () => {
  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <PinnedList items={ITEMS} />
    </div>
  );
};

export default PinnedListDemo;
export { PinnedListDemo };
