"use client";

import { index } from "@/__registry__";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
} from "@/registry/primitives/animate/tabs";
import { CodeTabs } from "@/components/docs/code-tabs";
import { CliTabs } from "@/components/docs/cli-tabs";
import { ComponentManualInstallation } from "./component-manual-installation";

interface ComponentInstallationProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export function ComponentInstallation({
  name,
  className,
  ...props
}: ComponentInstallationProps) {
  const component = index[name];

  const commands = {
    npm: `npx shadcn@latest add ${component?.command ?? name}`,
    pnpm: `pnpm dlx shadcn@latest add ${component?.command ?? name}`,
    yarn: `npx shadcn@latest add ${component?.command ?? name}`,
    bun: `bun x --bun shadcn@latest add ${component?.command ?? name}`,
  };

  if (!component) return null;

  return (
    <div className={cn("relative my-4 lg:max-w-[120ch]", className)} {...props}>
      <Tabs
        defaultValue="cli"
        className="w-full gap-0 rounded-xl border border-border/60 overflow-hidden"
      >
        <div className="flex items-center px-3 h-10 border-b border-border/50">
          <TabsList className="flex items-center gap-0.5">
            <TabsHighlight
              mode="parent"
              className="rounded-md bg-muted h-full"
              containerClassName="flex items-center gap-0.5"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <TabsHighlightItem value="cli">
                <TabsTrigger
                  value="cli"
                  className="relative z-10 px-3 h-7 rounded-md text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
                >
                  CLI
                </TabsTrigger>
              </TabsHighlightItem>
              <TabsHighlightItem value="manual">
                <TabsTrigger
                  value="manual"
                  className="relative z-10 px-3 h-7 rounded-md text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
                >
                  Manual
                </TabsTrigger>
              </TabsHighlightItem>
            </TabsHighlight>
          </TabsList>
        </div>

        <TabsContents>
          <TabsContent value="cli" className="p-1.5">
            <CodeTabs codes={commands} className="border-0 rounded-lg" />
          </TabsContent>
          <TabsContent value="manual" className="p-4">
            <ComponentManualInstallation
              path={component.files[0].target}
              dependencies={component.dependencies}
              devDependencies={component.devDependencies}
              registryDependencies={component.registryDependencies}
              code={component.files[0].content}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
