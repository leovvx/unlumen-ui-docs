import { cn } from "@workspace/ui/lib/utils";

export function KeepInMind({ className }: { className?: string }) {
  return (
    <div className={cn("mt-16 pt-8 border-t border-border pb-24", className)}>
      <p className="text-3xl  tracking-tight mb-3">Keep in mind</p>
      <p className="text-lg text-foreground/80 leading-relaxed max-w-prose">
        Most components on this site are inspired by or recreated from existing
        work across the web. I&apos;m not here to take credit; just to learn,
        experiment, and sometimes push things a bit further. If something looks
        familiar and I forgot to mention you,{" "}
        <a
          href="https://x.com/leouiux"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-foreground/20 hover:text-foreground/60 hover:decoration-foreground/40 transition-colors"
        >
          reach out
        </a>{" "}
        and I&apos;ll fix that right away.
      </p>
    </div>
  );
}
