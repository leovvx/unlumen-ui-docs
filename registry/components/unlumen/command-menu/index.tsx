"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@workspace/ui/lib/utils";

export type CommandMenuItemDef = {
  /** Display label */
  label: string;
  /** Lucide or any icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Route to navigate to (uses next/navigation router.push) */
  href?: string;
  /** Custom action — used instead of href when provided */
  action?: () => void;
  /** Extra keywords for matching */
  keywords?: string[];
};

export type CommandMenuGroupDef = {
  /** Heading rendered above the group */
  heading: string;
  items: CommandMenuItemDef[];
};

export interface CommandMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label text inside the trigger button */
  label?: string;
  /** Keyboard shortcut hint shown on the right */
  shortcut?: string;
  /** Whether to show the keyboard shortcut badge */
  showShortcut?: boolean;
}

export interface CommandMenuProps {
  /** CommandGroup definitions rendered in the dialog */
  groups?: CommandMenuGroupDef[];
  /** Whether to include the built-in Theme group */
  showThemeGroup?: boolean;
  /** Placeholder text inside the search input */
  placeholder?: string;
  /** Key portion of the keyboard shortcut (⌘ / Ctrl + key) */
  shortcutKey?: string;
  /** Delay in ms before the dialog content becomes visible (avoids layout pop) */
  contentDelay?: number;
  /** Custom trigger element. When provided the default button is NOT rendered. */
  trigger?: React.ReactNode;
  /** Props forwarded to the default trigger button */
  triggerProps?: CommandMenuTriggerProps;
  /** Extra className on the root CommandDialog */
  className?: string;
}

function CommandMenuTrigger({
  label = "Search…",
  shortcut = "K",
  showShortcut = true,
  className,
  onClick,
  ...props
}: CommandMenuTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background/60 backdrop-blur-sm px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 transition-colors w-full max-w-sm cursor-pointer",
        className,
      )}
      {...props}
    >
      <Search className="size-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {showShortcut && (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>{shortcut}</Kbd>
        </KbdGroup>
      )}
    </button>
  );
}

function CommandMenu({
  groups = [],
  showThemeGroup = true,
  placeholder = "Search components, pages, actions…",
  shortcutKey = "k",
  contentDelay = 150,
  trigger,
  triggerProps,
  className,
}: CommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);

  // Reveal content after dialog open transition
  React.useEffect(() => {
    if (open) {
      const id = setTimeout(() => setShowContent(true), contentDelay);
      return () => clearTimeout(id);
    } else {
      setShowContent(false);
    }
  }, [open, contentDelay]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down, { capture: true });
    return () =>
      document.removeEventListener("keydown", down, { capture: true });
  }, [shortcutKey]);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const handleItemSelect = React.useCallback(
    (item: CommandMenuItemDef) => {
      if (item.action) {
        run(item.action);
      } else if (item.href) {
        run(() => router.push(item.href!));
      }
    },
    [run, router],
  );

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        <CommandMenuTrigger
          shortcut={shortcutKey.toUpperCase()}
          {...triggerProps}
          onClick={() => setOpen(true)}
        />
      )}

      <CommandDialog open={open} onOpenChange={setOpen} className={className}>
        <CommandInput placeholder={placeholder} />

        <div
          className="transition-all duration-300 ease-out overflow-hidden"
          style={{
            maxHeight: showContent ? "400px" : "0px",
            opacity: showContent ? 1 : 0,
          }}
        >
          <CommandList>
            <CommandEmpty>
              <span className="text-sm font-mono text-muted-foreground">
                No results found.
              </span>
            </CommandEmpty>

            {groups.map((group, gi) => (
              <React.Fragment key={`g-${gi}`}>
                {gi > 0 && <CommandSeparator />}
                <CommandGroup heading={group.heading}>
                  {group.items.map((item, ii) => (
                    <CommandItem
                      key={`i-${gi}-${ii}`}
                      keywords={item.keywords}
                      onSelect={() => handleItemSelect(item)}
                    >
                      {item.icon && (
                        <item.icon className="mr-2 size-4 shrink-0" />
                      )}
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}

            {showThemeGroup && (
              <>
                {groups.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Theme">
                  <CommandItem
                    keywords={["light", "bright", "white", "day"]}
                    onSelect={() => run(() => setTheme("light"))}
                  >
                    <Sun className="mr-2 size-4" />
                    Light Mode
                  </CommandItem>
                  <CommandItem
                    keywords={["dark", "night", "black"]}
                    onSelect={() => run(() => setTheme("dark"))}
                  >
                    <Moon className="mr-2 size-4" />
                    Dark Mode
                  </CommandItem>
                  <CommandItem
                    keywords={["system", "auto", "os", "default"]}
                    onSelect={() => run(() => setTheme("system"))}
                  >
                    <Monitor className="mr-2 size-4" />
                    System Theme
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}

export { CommandMenu, CommandMenuTrigger };
