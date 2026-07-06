"use client";

import Link from "next/link";
import DAlogo from "./DAlogo";
import { useState, useEffect } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/ui/button";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useSidebar } from "fumadocs-ui/provider";
import { Menu } from "lucide-react";
import { Highlight, HighlightItem } from "../animate/highlight";
import { ThemeSwitcher } from "../animate/theme-switcher";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip";
import GithubIcon from "@workspace/ui/components/icons/github-icon";
import XIcon from "@workspace/ui/components/icons/x-icon";

export const NAV_ITEMS = [
  {
    title: "Docs",
    url: "/",
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
    title: "Pricing",
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
    return <NavContent onMobileMenuClick={() => { }} />;
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
          " transition-colors duration-200",
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
            transition={{ type: "spring", stiffness: 750, damping: 40, mass: 0.5 }}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled
                    aria-label="GitHub"
                  >
                    <GithubIcon className="size-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent className="z-500">Soon</TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href="https://x.com/leouiux"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <XIcon className="size-4" />
              </Link>
            </Button>
          </div>

          <ThemeSwitcher className="max-md:hidden" />

          <Button variant="neutral" size="sm" asChild className="max-md:hidden">
            <Link href="https://ui.unlumen.com/login">Login</Link>
          </Button>

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
