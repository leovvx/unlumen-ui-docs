"use client";

import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChartNoAxesColumn,
  type LucideIcon,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from "@/registry/components/unlumen/motion-navigation-menu";

interface MotionNavigationMenuDemoProps {
  viewport?: boolean;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
}

const PRODUCTS = [
  { title: "Analytics", desc: "Live funnels, cohorts, and retention." },
  { title: "Automation", desc: "Trigger workflows from events." },
  { title: "Insights", desc: "AI recommendations for next steps." },
  { title: "Reports", desc: "Share snapshots with stakeholders." },
];

const SOLUTIONS: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "Startups",
    desc: "Launch dashboards without building infra.",
    icon: Rocket,
  },
  {
    title: "Agencies",
    desc: "Manage every client workspace from one view.",
    icon: Users,
  },
  {
    title: "Enterprise",
    desc: "SAML, audit logs, SLAs, and permissions.",
    icon: Building2,
  },
];

const RESOURCES = [
  { title: "Documentation", desc: "Guides and API reference." },
  { title: "Changelog", desc: "What shipped this month." },
  { title: "Blog", desc: "Engineering and product notes." },
];

const highlightClassName = "dark:bg-accent bg-foreground/[0.06] rounded-lg";

export function MotionNavigationMenuDemo({
  viewport,
  springBounce,
  springStiffness,
  springDamping,
}: MotionNavigationMenuDemoProps) {
  return (
    <div className="flex min-h-full w-full items-center justify-center px-6">
      <MotionNavigationMenu
        viewport={viewport}
        viewportClassName="bg-surface border-none! rounded-xl shadow-none ring-0"
        springBounce={springBounce}
        springStiffness={springStiffness}
        springDamping={springDamping}
      >
        <MotionNavigationMenuList>
          <MotionNavigationMenuItem value="products">
            <MotionNavigationMenuTrigger>Products</MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent
              highlightClassName={highlightClassName}
            >
              <div className="grid w-[500px] grid-cols-[1fr_1.25fr] gap-2">
                <MotionNavigationMenuLink
                  href="#"
                  className="bg-background/70 rounded-lg min-h-44 justify-between p-4"
                >
                  <span className="bg-background flex size-9 items-center justify-center rounded-lg border">
                    <ChartNoAxesColumn className="size-4" />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-medium">
                      Command center
                    </span>
                    <span className="text-muted-foreground block text-xs">
                      Monitor product growth, workflow health, and team output.
                    </span>
                  </span>
                </MotionNavigationMenuLink>
                <div className="grid grid-cols-2 gap-0.5">
                  {PRODUCTS.map((product) => (
                    <MotionNavigationMenuLink key={product.title} href="#">
                      <span className="flex items-center justify-between gap-2 text-sm font-medium">
                        {product.title}
                        <ArrowUpRight className="size-3" />
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {product.desc}
                      </span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="solutions">
            <MotionNavigationMenuTrigger>Solutions</MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent
              highlightClassName={highlightClassName}
            >
              <div className="w-[380px] space-y-1">
                <div className="text-muted-foreground px-2 py-2 text-xs font-medium">
                  Built for teams
                </div>
                {SOLUTIONS.map((solution) => (
                  <MotionNavigationMenuLink
                    key={solution.title}
                    href="#"
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                  >
                    <span className="bg-transparent flex size-8 items-center justify-center rounded-lg">
                      <solution.icon className="size-4.5 text-foreground" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-medium">
                        For {solution.title.toLowerCase()}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {solution.desc}
                      </span>
                    </span>
                    <span className=" text-foreground rounded-lg  px-1.5 py-0.5 text-xs">
                      View
                    </span>
                  </MotionNavigationMenuLink>
                ))}
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="resources">
            <MotionNavigationMenuTrigger>Resources</MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent
              highlightClassName={highlightClassName}
            >
              <div className="grid w-[460px] grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  {RESOURCES.map((resource) => (
                    <MotionNavigationMenuLink key={resource.title} href="#">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen className="size-3.5" />
                        {resource.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {resource.desc}
                      </span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
                <MotionNavigationMenuLink
                  href="#"
                  className="bg-background/70 min-h-44 justify-between p-4"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-4" />
                    New release
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Explore the latest workflow templates and API improvements.
                  </span>
                  <span className="text-xs font-medium">Read changelog</span>
                </MotionNavigationMenuLink>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem>
            <MotionNavigationMenuLink
              href="#"
              className="flex h-9 items-center px-4 py-2 text-sm font-medium"
            >
              Pricing
            </MotionNavigationMenuLink>
          </MotionNavigationMenuItem>
        </MotionNavigationMenuList>
      </MotionNavigationMenu>
    </div>
  );
}

export default MotionNavigationMenuDemo;
