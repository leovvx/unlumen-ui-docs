"use client";

import { TooltipPreview } from "@/registry/primitives/tooltip-preview";

export const TooltipPreviewDemo = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 text-sm text-muted-foreground leading-relaxed max-w-sm text-center">
      <p>
        Built with{" "}
        <TooltipPreview
          href="https://nextjs.org"
          title="Next.js"
          description="The React framework for the web. Used by the largest companies, Next.js enables you to create high-quality web applications."
          image="https://nextjs.org/static/twitter-cards/home.jpg"
          favicon="https://nextjs.org/favicon.ico"
        >
          Next.js
        </TooltipPreview>{" "}
        and styled with{" "}
        <TooltipPreview
          href="https://tailwindcss.com"
          title="Tailwind CSS"
          description="A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup."
          image="https://tailwindcss.com/opengraph-image.jpg"
          favicon="https://tailwindcss.com/favicons/favicon.ico"
        >
          Tailwind CSS
        </TooltipPreview>
        {". "}Animated with{" "}
        <TooltipPreview
          href="https://motion.dev"
          title="Motion"
          description="Motion is the only animation library with a hybrid engine, combining the power of JavaScript animations with the performance of native browser APIs."
          favicon="https://motion.dev/favicon.ico"
        >
          Motion
        </TooltipPreview>
        .
      </p>
    </div>
  );
};
