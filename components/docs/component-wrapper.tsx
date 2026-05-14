"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import Iframe from "./iframe";

interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  iframe?: boolean;
  bigScreen?: boolean;
}

export const ComponentWrapper = ({
  className,
  children,
  name,
  iframe = false,
  bigScreen = false,
}: ComponentWrapperProps) => {
  return (
    <div className=" rounded-none p-1.5">
      <motion.div
        id="component-wrapper"
        className={cn(
          "max-w-screen relative rounded-md bg-background flex flex-col md:flex-row",
          bigScreen && "overflow-hidden",
          className,
        )}
      >
        <motion.div className="relative size-full flex-1">
          {iframe ? (
            <Iframe name={name} bigScreen={bigScreen} />
          ) : (
            <div className="flex min-h-[400px] w-full items-center justify-center px-10 py-16">
              {children}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
