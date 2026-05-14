"use client";

import Link from "next/link";
import DAlogo from "./DAlogo";
import { useState, useEffect } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/ui/button";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useSidebar } from "fumadocs-ui/provider";
import { Menu01Icon as Menu } from "hugeicons-react";
import { Highlight, HighlightItem } from "../animate/highlight";
import { ThemeSwitcher } from "../animate/theme-switcher";
import { motion } from "motion/react";
import { CommandMenu } from "@/components/command-menu";

export const NAV_ITEMS = [
  {
    title: "Docs",
    url: "/installation",
  },
  {
    title: "Primitives",
    url: "/ui",
  },
  {
    title: "Components",
    url: "https://ui.unlumen.com/components",
  },
  {
    title: "Pro",
    url: "https://ui.unlumen.com/pricing",
  },
];

type NavProps = {
  sidebar?: "fumadocs" | "components" | false;
};

export const Nav = ({ sidebar = "fumadocs" }: NavProps = {}) => {
  if (sidebar === "components") {
    return <ComponentsNav />;
  }

  if (sidebar === false) {
    return <NavContent onMobileMenuClick={() => {}} />;
  }

  return <FumadocsNav />;
};

function FumadocsNav() {
  const { setOpen } = useSidebar();

  return <NavContent onMobileMenuClick={() => setOpen((prev) => !prev)} />;
}

function ComponentsNav() {
  return <FumadocsNav />;
}

function NavContent({ onMobileMenuClick }: { onMobileMenuClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 inset-x-0 z-500 w-full h-16 bg-background flex items-center px-6 gap-4",
          "border-b transition-colors duration-200",
          isScrolled ? "border-border/50" : "border-transparent",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Nav with logo */}
        <nav className="flex items-center gap-1 flex-1">
          <Highlight
            mode="parent"
            hover
            controlledItems
            value={null}
            className="bg-accent rounded-md"
            containerClassName="flex items-center gap-1"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <HighlightItem value="/" asChild>
              <Link
                href="https://ui.unlumen.com"
                className="p-2.5 z-10 rounded-full"
              >
                <DAlogo className="w-[25px] h-[25px] text-foreground dark:text-foreground fill-current" />
              </Link>
            </HighlightItem>

            {NAV_ITEMS.map((item) => (
              <HighlightItem key={item.url} value={item.url} asChild>
                <Button
                  variant="highlight"
                  size="sm"
                  asChild
                  className={cn(
                    "relative z-10 text-sm hover:bg-transparent md:flex hidden",
                  )}
                >
                  <Link href={item.url}>{item.title}</Link>
                </Button>
              </HighlightItem>
            ))}
          </Highlight>
        </nav>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center max-w-xs">
          <CommandMenu
            triggerLabel="Search..."
            className="h-9 max-w-none border-border/50 bg-background pl-3 pr-1.5 py-0 hover:bg-accent/30"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher className="max-md:hidden" />

          {/* Mobile sidebar toggle */}
          <button
            className={cn(
              buttonVariants({
                color: "ghost",
                size: "icon-sm",
                className:
                  "!size-8 [&_svg]:!size-5 text-fd-muted-foreground md:hidden",
              }),
            )}
            onClick={onMobileMenuClick}
          >
            <Menu />
          </button>
        </div>
      </motion.nav>
    </>
  );
}
