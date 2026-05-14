"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import {
  Highlight,
  HighlightItem,
} from "@/registry/primitives/effects/highlight";

function HighlightNavMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-3xl flex-1 items-center justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <HighlightNavMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function HighlightNavMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <Highlight
      mode="parent"
      controlledItems
      hover
      className="bg-accent rounded-md pointer-events-none"
      style={{ zIndex: -1 }}
      containerClassName="relative"
    >
      <NavigationMenuPrimitive.List
        data-slot="navigation-menu-list"
        className={cn(
          "group flex flex-1 list-none items-center justify-center gap-1 relative z-10",
          className,
        )}
        {...props}
      />
    </Highlight>
  );
}

function HighlightNavMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const highlightNavMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium hover:text-accent-foreground focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-colors focus-visible:ring-[3px] focus-visible:outline-1",
);

function HighlightNavMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <HighlightItem asChild>
      <NavigationMenuPrimitive.Trigger
        data-slot="navigation-menu-trigger"
        className={cn(highlightNavMenuTriggerStyle(), "group", className)}
        {...props}
      >
        {children}{" "}
        <ChevronDownIcon
          className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </NavigationMenuPrimitive.Trigger>
    </HighlightItem>
  );
}

function HighlightNavMenuContent({
  className,
  innerClassName,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & {
  innerClassName?: string;
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-background/90 backdrop-blur-xl group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      )}
      {...props}
    >
      <Highlight
        mode="parent"
        controlledItems
        hover
        className="bg-accent rounded-sm pointer-events-none"
        style={{ zIndex: -1 }}
        containerClassName="relative"
      >
        <div className={cn("relative z-10", innerClassName)}>{children}</div>
      </Highlight>
    </NavigationMenuPrimitive.Content>
  );
}

function HighlightNavMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-background/90 backdrop-blur-md text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-md border shadow md:w-(--radix-navigation-menu-viewport-width)",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function HighlightNavMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <HighlightItem asChild>
      <NavigationMenuPrimitive.Link
        data-slot="navigation-menu-link"
        className={cn(
          "data-[active=true]:text-accent-foreground hover:text-accent-foreground focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    </HighlightItem>
  );
}

function HighlightNavMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  HighlightNavMenu,
  HighlightNavMenuList,
  HighlightNavMenuItem,
  HighlightNavMenuContent,
  HighlightNavMenuTrigger,
  HighlightNavMenuLink,
  HighlightNavMenuIndicator,
  HighlightNavMenuViewport,
  highlightNavMenuTriggerStyle,
};
