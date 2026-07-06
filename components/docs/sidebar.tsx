"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
  Sidebar,
  SidebarComponents,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarFooter,
  SidebarItem,
  SidebarSeparator,
  SidebarViewport,
} from "fumadocs-ui/components/layout/sidebar";
import { HideIfEmpty } from "fumadocs-core/hide-if-empty";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { BaseLinkItem, LinkItemType } from "fumadocs-ui/layouts/links";
import { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getLinks } from "fumadocs-ui/layouts/shared";
import { ThemeSwitcher } from "../animate/theme-switcher";
import { PageTree } from "fumadocs-core/server";
import { useTreeContext } from "fumadocs-ui/provider";
import { usePathname } from "next/navigation";
import { isActive } from "fumadocs-ui/utils/is-active";
import { motion, AnimatePresence } from "motion/react";
import { Separator } from "@/lib/attach-separator";

// ─── Effects toggle context ───────────────────────────────────────────
const EFFECTS_STORAGE_KEY = "sidebar-effects";

const EffectsContext = createContext<{
  enabled: boolean;
  toggle: () => void;
}>({ enabled: true, toggle: () => {} });

function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(EFFECTS_STORAGE_KEY);
    return stored !== null ? stored === "true" : true;
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(EFFECTS_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

function useEffects() {
  return useContext(EffectsContext);
}

// ─── Scroll to active link ─────────────────────────────────────────────
function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!active || hasScrolled.current || !ref.current) return;
    hasScrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? (id: number) => cancelIdleCallback(id)
        : (id: number) => clearTimeout(id);
    const id = schedule(() => {
      const viewport = el.closest("[data-radix-scroll-area-viewport]");
      if (!(viewport instanceof HTMLElement)) return;
      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;
      if (Math.abs(offset) > 40) {
        viewport.scrollBy({ top: offset, behavior: "smooth" });
      }
    });
    return () => cancel(id as number);
  }, [active]);

  // reset when becoming inactive
  useEffect(() => {
    if (!active) hasScrolled.current = false;
  }, [active]);

  return ref;
}

// ─── Shared hover context ──────────────────────────────────────────────
interface HoverRect {
  top: number;
  height: number;
}

const HoverContext = createContext<{
  hovered: string | null;
  hoveredCenter: number | null;
  hoverRect: HoverRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (
    v: string | null,
    center?: number | null,
    rect?: HoverRect | null,
  ) => void;
}>({
  hovered: null,
  hoveredCenter: null,
  hoverRect: null,
  containerRef: { current: null },
  setHovered: () => {},
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredState] = useState<string | null>(null);
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);
  const stableSet = useCallback(
    (v: string | null, center?: number | null, rect?: HoverRect | null) => {
      setHoveredState(v);
      setHoveredCenter(center ?? null);
      setHoverRect(rect ?? null);
    },
    [],
  );
  const value = useMemo(
    () => ({
      hovered,
      hoveredCenter,
      hoverRect,
      containerRef,
      setHovered: stableSet,
    }),
    [hovered, hoveredCenter, hoverRect, containerRef, stableSet],
  );
  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

function useHover() {
  return useContext(HoverContext);
}

// ─── Floating hover highlight (single element) ─────────────────────────
function SidebarHoverHighlight() {
  const { hoverRect, hovered } = useHover();
  const { enabled } = useEffects();

  return (
    <AnimatePresence>
      {enabled && hovered && hoverRect && (
        <motion.div
          key="sidebar-hover-bg"
          className="pointer-events-none absolute z-0 rounded-md bg-accent/50"
          style={{ left: 25, right: 0 }}
          initial={false}
          animate={{
            top: hoverRect.top + 2,
            height: hoverRect.height - 4,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 2000,
            damping: 50,
            mass: 0.5,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────
const sidebarItemClassName =
  "relative hover:bg-transparent !bg-transparent ml-2 !pl-4 !py-1.5 data-[active=true]:bg-transparent";

const getIsActive = (pathname: string, href: string) => {
  return href !== undefined && isActive(href, pathname, false);
};

const isRootFolder = (
  root: PageTree.Root | PageTree.Folder,
): root is PageTree.Folder => {
  return "type" in root && root.type === "folder";
};

// ─── Animated sidebar link ─────────────────────────────────────────────
const AnimatedSidebarLink = memo(function AnimatedSidebarLink({
  href,
  label,
  isActive: active,
  isNew,
  external,
  className,
  ...rest
}: {
  href: string;
  label: React.ReactNode;
  isActive: boolean;
  isNew?: boolean;
  external?: boolean;
  className?: string;
}) {
  const { hovered, setHovered, containerRef } = useHover();
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(active);

  // ── Opacity and x translation pattern ──
  const opacity = active || isHovered ? 1 : 0.55;
  const x = active ? 8 : isHovered ? 6 : 0;

  return (
    <div className="relative">
      {/* Active indicator bar */}
      {active && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="pointer-events-none absolute z-11 left-[4px] top-1/2 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          animate={{ width: 30 }}
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      )}

      {/* Animated dashes — outside motion.div so they don't translate */}
      <motion.span
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-px bg-foreground/50"
        animate={{ width: active ? 0 : isHovered ? 26 : 18 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <motion.span className="pointer-events-none absolute w-[13px] left-0 top-1/4 h-px bg-foreground/30" />
      <motion.span className="pointer-events-none absolute w-[16px] left-0 top-0 h-px bg-foreground/30" />
      <motion.span className="pointer-events-none absolute w-[13px] left-0 top-3/4 h-px bg-foreground/30" />

      <motion.div
        ref={itemRef}
        animate={{ opacity, x }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{ transformOrigin: "left center" }}
      >
        <SidebarItem
          href={href}
          external={external}
          className={cn(sidebarItemClassName, className)}
          onMouseEnter={() => {
            const el = itemRef.current;
            const container = containerRef.current;
            if (el && container) {
              const elRect = el.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              setHovered(href, elRect.top + elRect.height / 2, {
                top: elRect.top - containerRect.top,
                height: elRect.height,
              });
            } else {
              setHovered(href);
            }
          }}
          onMouseLeave={() => setHovered(null)}
          {...rest}
        >
          {/* Label */}
          <span
            className={cn(
              "relative z-1 text-md w-full pl-2.5 transition-all duration-200 ease-out inline-flex items-center gap-2",
              active ? "text-foreground" : "text-foreground",
            )}
          >
            {label}
            {isNew && (
              <span className="size-1.5 rounded-full bg-accent-pro shrink-0" />
            )}
          </span>
        </SidebarItem>
      </motion.div>
    </div>
  );
});

// ─── Page tree items ───────────────────────────────────────────────────
export function SidebarPageTree(props: {
  components?: Partial<SidebarComponents>;
}) {
  const { root } = useTreeContext();
  const pathname = usePathname();

  return useMemo(() => {
    const { Separator, Item, Folder } = props.components ?? {};

    function renderSidebarList(items: PageTree.Node[]): React.ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          // @ts-ignore
          if (Separator) return <Separator key={i} item={item} />;
          return (
            <SidebarSeparator
              key={i}
              className={cn(i === 0 ? "mb-3.5 !p-0 mt-6" : "mb-3.5 !p-0 mt-6 ")}
            >
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        // @ts-ignore
        if (Item || Folder) return <Item key={item.url} item={item} />;

        // @ts-ignore
        const url = item.index?.url ?? item.url;
        const active = getIsActive(pathname, url);

        return (
          <AnimatedSidebarLink
            key={url}
            href={url}
            label={item.name as string}
            isActive={active}
          />
        );
      });
    }

    return (
      // @ts-ignore
      <Fragment key={root.$id}>{renderSidebarList(root.children)}</Fragment>
    );
  }, [props.components, root, pathname]);
}

// ─── Link items (top-level links, menu items) ─────────────────────────
export function SidebarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  const pathname = usePathname();

  if (item.type === "menu")
    return (
      <SidebarFolder {...props}>
        {item.url ? (
          <SidebarFolderLink href={item.url}>{item.text}</SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>{item.text}</SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items.map((child, i) => (
            <SidebarLinkItem key={i} item={child} />
          ))}
        </SidebarFolderContent>
      </SidebarFolder>
    );

  if (item.type === "custom") {
    return <div {...props}>{item.children as React.ReactNode}</div>;
  }

  if (item.type === ("separator" as any)) {
    return (
      <SidebarSeparator
        className="mb-2 p-0! ml-0!"
        style={{ paddingInlineStart: 0 }}
      >
        <Separator icon={item.icon} name={(item as any).name} />
      </SidebarSeparator>
    );
  }

  const active = getIsActive(pathname, item.url);

  return (
    <AnimatedSidebarLink
      href={item.url}
      label={item.text as string}
      isActive={active}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isNew={(item as any).new === true}
      external={item.external}
      className={props.className}
    />
  );
}

// ─── Main sidebar ──────────────────────────────────────────────────────
export const DocsSidebar = ({
  nav: { transparentMode, ...nav } = {},
  sidebar: {
    tabs: sidebarTabs,
    footer: sidebarFooter,
    banner: sidebarBanner,
    enabled: sidebarEnabled = true,
    collapsible: sidebarCollapsible = true,
    component: sidebarComponent,
    components: sidebarComponents,
    ...sidebarProps
  } = {},
  searchToggle = {},
  disableThemeSwitch = false,
  themeSwitch = { enabled: !disableThemeSwitch },
  i18n = false,
  children,
  ...props
}: DocsLayoutProps) => {
  const pathname = usePathname();
  const links = getLinks(props.links ?? [], props.githubUrl);
  const { root } = useTreeContext();
  const shouldRenderLayoutLinks = isRootFolder(root) && root.root === true;
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  return (
    <EffectsProvider>
      <HoverProvider containerRef={containerRef}>
        <Sidebar
          collapsible={false}
          className="md:mt-20 3xl:!absolute bg-background"
          {...sidebarProps}
        >
          <div ref={sidebarScrollRef} className="min-h-0 flex-1">
            <SidebarViewport className="md:[&_[data-radix-scroll-area-viewport]]:pb-14 [&_[data-radix-scroll-area-viewport]]:pb-4 max-md:pt-2">
              <div ref={containerRef} className="relative">
                <SidebarHoverHighlight />
                {(shouldRenderLayoutLinks ? links : [])
                  .filter((v) => v.type !== "icon")
                  .map((item, i, list) => (
                    <SidebarLinkItem
                      key={i}
                      item={item}
                      className={cn(
                        item.type !== "custom" && sidebarItemClassName,
                        i === list.length - 1 && "mb-4",
                      )}
                    />
                  ))}

                <SidebarPageTree components={sidebarComponents} />
              </div>
            </SidebarViewport>
          </div>

          <HideIfEmpty>
            <SidebarFooter className="data-[empty=true]:hidden md:hidden border-0">
              <div className="flex items-center justify-end empty:hidden">
                {links
                  .filter((item) => item.type === "icon")
                  .map((item, i, arr) => (
                    // @ts-ignore
                    <BaseLinkItem
                      key={i}
                      item={item}
                      className={cn(
                        buttonVariants({ size: "icon", color: "ghost" }),
                        "text-fd-muted-foreground md:[&_svg]:size-4.5",
                        i === arr.length - 1 && "me-auto",
                      )}
                      aria-label={item.label}
                    >
                      {item.icon}
                    </BaseLinkItem>
                  ))}

                <ThemeSwitcher />
              </div>
              {sidebarFooter}
            </SidebarFooter>
          </HideIfEmpty>
        </Sidebar>
      </HoverProvider>
    </EffectsProvider>
  );
};
