"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight01Icon as ArrowRight,
  Tick01Icon as Check,
  InboxIcon as Mails,
} from "hugeicons-react";
import { cn } from "@workspace/ui/lib/utils";
import { ShimmeringText } from "@/registry/primitives/shimmering-text";

type StayTunedProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function StayTuned({
  title = "Stay Tuned",
  description = "Subscribe to get notified as soon as it drops. I won't spam you, pinky promise 🤙",
  className,
}: StayTunedProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [focused, setFocused] = useState(false);
  const [onWritting, setOnWritting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status !== "idle") return;
    const subject = encodeURIComponent("Unlumen UI newsletter");
    const body = encodeURIComponent(`Please add ${email} to the newsletter.`);
    window.location.href = `mailto:dev@unlumen.com?subject=${subject}&body=${body}`;
    setStatus("success");
  };

  const isActive = focused || email.length > 0;

  return (
    <div
      className={cn(
        "not-prose my-10 flex flex-col items-center gap-4 text-center",
        className,
      )}
    >
      <div className="relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.5,
          }}
          className="p-4 py-2.5 gap-3 border-x border-t rounded-lg rounded-b-none overflow-visible relative inline-flex items-center"
        >
          <ShimmeringText className="font-mono text-sm" text="Coming Soon" />
          <div className="shadowblur pointer-events-none w-[105%] bg-gradient-to-t from-background dark:from-background to-transparent h-9 absolute -bottom-1 -left-1" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.06,
          }}
          className="text-5xl font-medium max-w-lg tracking-tight"
        >
          {title}
        </motion.h2>
      </div>
      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          delay: 0.12,
        }}
        className="max-w-xs text-sm text-muted-foreground leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="w-full max-w-sm"
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.97 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 py-2 text-xl text-foreground"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                  delay: 0.1,
                }}
                className="flex size-5 items-center justify-center "
              >
                <Mails className="size-7" />
              </motion.span>
              Thank you! Take care friend.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative"
            >
              {/* Animated border ring */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-[13px]"
                animate={{
                  boxShadow: isActive
                    ? "0 0 0 1px hsl(var(--foreground) / 0.25), 0 2px 12px hsl(var(--foreground) / 0.06)"
                    : "0 0 0 1px hsl(var(--border))",
                }}
                transition={{ duration: 0.2 }}
              />

              <div
                className="relative flex h-11 items-center overflow-hidden mt-4 rounded-none border-b border-border/80 bg-transparent"
                onClick={() => inputRef.current?.focus()}
              >
                <input
                  ref={inputRef}
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInput={() => setOnWritting(true)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="h-full flex-1 bg-transparent pl-4 pr-2 text-lg placeholder:text-muted-foreground/40 focus:outline-none"
                />
                {/* Submit button */}

                <div className="flex items-center pr-1">
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      "relative inline-flex items-center overflow-hidden rounded-lg bg-transparent text-foreground px-3.5 text-sm font-medium transition-opacity",
                      "hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {status === "loading" ? (
                        <motion.span
                          key="spin"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center"
                        >
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.75,
                              ease: "linear",
                            }}
                            className="block size-3.5 rounded-full border-2 border-background/30 border-t-background"
                          />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1.5"
                        >
                          Notify me
                          <motion.span
                            animate={isActive ? { x: 2 } : { x: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                          >
                            <ArrowRight className="size-3.5" />
                          </motion.span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
