"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip";

const ActionButton = ({
  onClick,
  title,
  children,
  disabled,
}: {
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors [&_svg]:size-3.5 disabled:opacity-40"
  >
    {children}
  </button>
);

export function LLMCopyButton({ markdown }: { markdown: string }) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    setLoading(true);
    try {
      await navigator.clipboard.writeText(markdown);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ActionButton
          onClick={() => onClick({} as React.MouseEvent)}
          disabled={isLoading}
          title="Copy as Markdown"
        >
          {checked ? <Check /> : <Copy />}
        </ActionButton>
      </TooltipTrigger>
      <TooltipContent>copy as markdown</TooltipContent>
    </Tooltip>
  );
}

export function ViewOptions({
  markdown,
}: {
  markdown: string;
}) {
  return <LLMCopyButton markdown={markdown} />;
}
