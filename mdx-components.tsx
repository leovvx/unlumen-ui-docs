import { cn } from "@workspace/ui/lib/utils";
import { Card } from "fumadocs-ui/components/card";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentInstallation } from "@/components/docs/component-installation";
import { CliTabs } from "@/components/docs/cli-tabs";
import { StayTuned } from "@/components/stay-tuned";
import { ComponentsList } from "@/components/docs/components-list";

import { ExternalLink } from "@/components/docs/external-link";
import { DownloadFile } from "@/components/docs/download-file";
import { KeepInMind } from "@/components/docs/keep-in-mind";
import { PropTable } from "@/components/docs/prop-table";
import { ShowcaseGrid } from "@/components/docs/showcase-grid";
import { Steps, Step } from "fumadocs-ui/components/steps";
import { TypeTable as FumaTypeTable } from "fumadocs-ui/components/type-table";

function TypeTable(props: React.ComponentProps<typeof FumaTypeTable>) {
  return (
    <div className="[&_table]:whitespace-normal [&_table]:bg-transparent [&_thead]:bg-transparent [&_tbody]:bg-transparent [&_tr]:bg-transparent [&_td]:align-top [&_th]:bg-transparent [&_code]:break-all">
      <FumaTypeTable {...props} />
    </div>
  );
}
import {
  CodeBlock,
  Pre,
  type CodeBlockProps,
} from "./components/docs/codeblock";
import { Callout } from "./components/docs/callout";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Card: ({ children, className, accent, ...props }) => (
      <Card
        className={cn(
          "flex flex-col items-center justify-center py-7 bg-accent/50 border-none [&>h3]:text-base [&>h3]:text-current [&>div]:bg-transparent [&>div]:shadow-none [&>div]:border-none [&_svg]:size-10",
          accent && "[&>h3]:text-fd-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    ),
    ComponentPreview,
    ComponentInstallation,
    CliTabs,
    StayTuned,
    ComponentsList,
    TypeTable: PropTable,
    ExternalLink,
    ShowcaseGrid,
    ShowcaseSubmitForm: () => (
      <a
        className="inline-flex rounded-md border px-3 py-2 text-sm no-underline"
        href="https://ui.unlumen.com/docs/showcase/submit"
      >
        Submit a showcase
      </a>
    ),
    Steps,
    Step,
    Callout,
    DownloadFile,
    KeepInMind,
    pre: (props: CodeBlockProps) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    // Inline code. Fenced code blocks are handled by the `pre` mapping above.
    code: ({ children, className, ...props }) => {
      if (typeof children !== "string")
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      return (
        <code
          className="rounded-md bg-accent px-2.5 py-1 text-sm font-mono tracking-tight text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}

/**
 * MDX components for the /components/[slug] detail pages.
 * Customise HTML element mappings here without touching /docs/ui styles.
 */
export function getComponentsMDXComponents(
  components?: MDXComponents,
): MDXComponents {
  return {
    ...getMDXComponents(components),

    // ── Headings ──────────────────────────────────────────────────────────────
    h2: ({ children }) => (
      <h2 className="text-4xl mt-8 mb-5 tracking-tight text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl mt-7 mb-3 text-foreground">{children}</h3>
    ),
    // ── Body text ─────────────────────────────────────────────────────────────
    p: ({ children }) => (
      <p className="text-lg text-foreground/80 tracking-wide font-light leading-relaxed">
        {children}
      </p>
    ),
    // ── Lists ─────────────────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul className="flex flex-col font-light gap-1 text-lg text-foreground/80 tracking-wide list-disc pl-5">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="flex flex-col gap-1 text-lg text-foreground/60 list-decimal pl-5">
        {children}
      </ol>
    ),
    // ── Links ─────────────────────────────────────────────────────────────────
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-blue-400 transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    // ── Props table ───────────────────────────────────────────────────────────
    TypeTable: PropTable,
    // ── Bold ──────────────────────────────────────────────────────────────────
    strong: ({ children }) => (
      <strong className="font-medium text-foreground">{children}</strong>
    ),
    // ── Inline code (not fenced blocks processed by Shiki) ───────────────────
    code: ({ children, className, ...props }) => {
      if (typeof children !== "string")
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      return (
        <code
          className="rounded-md bg-accent px-2.5 py-1 text-sm font-mono tracking-tight text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}
