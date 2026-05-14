"use client";

import { index } from "@/__registry__";
import { ComponentWrapper } from "@/components/docs/component-wrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
} from "@/registry/primitives/tabs";
import { cn } from "@workspace/ui/lib/utils";
import {
  Loading03Icon as Loader,
  FullScreenIcon as Fullscreen,
} from "hugeicons-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { DynamicCodeBlock } from "@/components/docs/dynamic-codeblock";
import ReactIcon from "@workspace/ui/components/icons/react-icon";
import { type Binds, Tweakpane } from "@workspace/ui/components/docs/tweakpane";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@workspace/ui/components/ui/button";
import { RefreshButton } from "@/components/unlumen-ui/refresh";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  iframe?: boolean;
  bigScreen?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenFirstLevel<T>(input: Record<string, any>): T {
  return Object.values(input).reduce((acc, current) => {
    return { ...acc, ...current };
  }, {} as T);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapValues(obj: Record<string, any>): Record<string, any> {
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    if ("value" in obj) {
      return obj.value;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = unwrapValues(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

export function ComponentPreview({
  name,
  className,
  iframe = false,
  bigScreen = false,
  ...props
}: ComponentPreviewProps) {
  const [previewKey, setPreviewKey] = useState(0);

  const [binds, setBinds] = useState<Binds | null>(null);
  const [componentProps, setComponentProps] = useState<Record<
    string,
    unknown
  > | null>(null);

  const code = useMemo(() => {
    const code = index[name]?.files?.[0]?.content;

    if (!code) {
      console.error(`Component with name "${name}" not found in registry.`);
      return null;
    }

    return code;
  }, [name]);

  const preview = useMemo(() => {
    const Component = index[name]?.component;

    if (Object.keys(Component?.demoProps ?? {}).length !== 0) {
      if (componentProps === null)
        setComponentProps(unwrapValues(Component?.demoProps));
      if (binds === null) setBinds(Component?.demoProps);
    }

    if (!Component) {
      console.error(`Component with name "${name}" not found in registry.`);
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component {...flattenFirstLevel(componentProps ?? {})} />;
  }, [name, componentProps, binds]);

  useEffect(() => {
    if (!binds) return;
    setComponentProps(unwrapValues(binds));
  }, [binds]);

  return (
    <div
      id="component-preview"
      className={cn(
        "relative my-4 not-prose lg:max-w-[120ch] rounded-2xl border border-border/50 overflow-hidden",
        className,
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="w-full gap-0">
        <div
          className="flex items-center justify-between px-3 h-11 border-b border-border/50"
          id="component-preview-tab-list"
        >
          <TabsList className="flex items-center gap-0.5">
            <TabsHighlight
              mode="parent"
              className="rounded-md bg-muted h-full"
              containerClassName="flex"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <TabsHighlightItem value="preview">
                <TabsTrigger
                  value="preview"
                  className="relative z-10 px-3 h-7 rounded-md text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
                >
                  Preview
                </TabsTrigger>
              </TabsHighlightItem>
              {!!code && (
                <TabsHighlightItem value="code">
                  <TabsTrigger
                    value="code"
                    className="relative z-10 px-3 h-7 rounded-md text-sm text-muted-foreground data-[state=active]:text-foreground transition-colors"
                  >
                    Code
                  </TabsTrigger>
                </TabsHighlightItem>
              )}
            </TabsHighlight>
          </TabsList>
        </div>

        <TabsContents>
          <TabsContent
            value="preview"
            className="relative h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              {/* top actions */}
              <div className="absolute top-0 right-6 h-12 flex items-center justify-end gap-1.5 px-2 z-10">
                {/*                 <OpenInV0Button url={`https://unlumen-ui.com/r/${name}.json`} />
                 */}
                <RefreshButton
                  onRefresh={() => setPreviewKey((prev) => prev + 1)}
                />

                {iframe && (
                  <Button
                    onClick={() => window.open(`/examples/${name}`, "_blank")}
                    className="flex items-center rounded-lg"
                    variant="neutral"
                    size="icon-sm"
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Fullscreen aria-label="fullscreen-btn" size={14} />
                    </motion.button>
                  </Button>
                )}
              </div>

              {/* top dashed */}
              <svg className="absolute w-full left-0 top-12 h-px pointer-events-none">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="8 4"
                  className="text-border"
                />
              </svg>
              {/* left dashed */}
              <svg className="absolute h-full left-6 top-0 w-px pointer-events-none">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="8 4"
                  className="text-border"
                />
              </svg>
              {/* right dashed */}
              <svg className="absolute h-full right-6 top-0 w-px pointer-events-none">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="8 4"
                  className="text-border"
                />
              </svg>

              {/* preview area */}
              <div className="px-6 pt-12 pb-6">
                <ComponentWrapper
                  key={previewKey}
                  name={name}
                  iframe={iframe}
                  bigScreen={bigScreen}
                >
                  <Suspense
                    fallback={
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Loader className="mr-2 size-4 animate-spin" />
                        Loading...
                      </div>
                    }
                  >
                    {preview}
                  </Suspense>
                </ComponentWrapper>
              </div>

              {/* bottom dashed separator */}
              <svg className="w-full h-px block">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="8 4"
                  className="text-border"
                />
              </svg>

              {/* tweakpane — shown below the separator when props exist */}
              <AnimatePresence>
                {binds && (
                  <motion.div
                    key="tweakpane"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4.5 py-4 flex flex-wrap gap-3 items-start">
                      <Tweakpane binds={binds} onBindsChange={setBinds} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          {!!code && (
            <TabsContent
              value="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className={cn(
                  "p-6 relative [&_.fd-codeblock]:rounded-none [&_.fd-codeblock]:border-0  [&_.fd-codeblock]:my-0 [&_pre]:max-h-[420px] [&_pre]:overflow-auto",
                  name ? "pt-1.5" : "",
                )}
              >
                <svg
                  className={cn(
                    "absolute w-full left-0 bottom-6 h-px pointer-events-none z-10",
                    name ? "top-12" : "",
                  )}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    className="text-border"
                  />
                </svg>
                <svg className="absolute w-full left-0 bottom-6 h-px pointer-events-none z-10">
                  <line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    className="text-border"
                  />
                </svg>
                <svg className="absolute h-full left-6 top-0 w-px pointer-events-none z-10">
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    className="text-border"
                  />
                </svg>
                <svg className="absolute h-full right-6 bottom-0 w-px pointer-events-none z-10">
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="8 4"
                    className="text-border"
                  />
                </svg>
                <DynamicCodeBlock
                  code={code}
                  lang="tsx"
                  title={`${name}.tsx`}
                  icon={<ReactIcon />}
                />
              </div>
            </TabsContent>
          )}
        </TabsContents>
      </Tabs>
    </div>
  );
}
