"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight01Icon as ArrowRight } from "hugeicons-react";
import {
  FaviconSearch,
  extractDomain,
  getFaviconUrl,
} from "@/registry/primitives/unlumen/favicon-search";

export const FaviconSearchDemo = () => {
  const [value, setValue] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const [submittedDomain, setSubmittedDomain] = React.useState<string | null>(
    null,
  );

  const handleSearch = (val: string, domain: string | null) => {
    if (!domain) return;
    setSubmitted(val);
    setSubmittedDomain(domain);
  };

  const handleChange = (val: string) => {
    setValue(val);
    if (!val) {
      setSubmitted(null);
      setSubmittedDomain(null);
    }
  };

  return (
    <div className="flex min-h-[340px] w-full items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Enter your Website
          </h2>
        </div>

        {/* Search input */}
        <div className="space-y-2">
          <FaviconSearch
            value={value}
            onChange={handleChange}
            onSearch={handleSearch}
            placeholder="ui.shadcn.com"
            className="w-full"
          />
        </div>

        {/* Result card */}
        <AnimatePresence mode="wait">
          {submittedDomain && (
            <motion.div
              key={submittedDomain}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="rounded-xl border border-border bg-muted/40 p-4 flex items-center gap-3"
            >
              <motion.img
                src={getFaviconUrl(submittedDomain, 64)}
                alt={submittedDomain}
                width={36}
                height={36}
                className="size-9 rounded-lg object-contain shrink-0 shadow-sm"
                initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 24,
                  delay: 0.05,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {submittedDomain}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {submitted}
                </p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
