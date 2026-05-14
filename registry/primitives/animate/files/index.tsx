"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { getStrictContext } from "@/lib/get-strict-context";

type FilesContextType = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  highlightBounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
  setHighlightBounds: (
    bounds: { top: number; left: number; width: number; height: number } | null,
  ) => void;
};

type FolderItemContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const [FilesProvider, useFiles] =
  getStrictContext<FilesContextType>("FilesContext");
const [FolderItemProvider, useFolderItem] =
  getStrictContext<FolderItemContextType>("FolderItemContext");

type FilesProps = React.ComponentProps<"div"> & {
  defaultOpenFolders?: string[];
};

function Files({ children, className, ...props }: FilesProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [highlightBounds, setHighlightBounds] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  return (
    <FilesProvider
      value={{ containerRef, highlightBounds, setHighlightBounds }}
    >
      <div
        ref={containerRef}
        className={className}
        onMouseLeave={() => setHighlightBounds(null)}
        {...props}
      >
        {children}
      </div>
    </FilesProvider>
  );
}

type FilesHighlightProps = React.ComponentProps<typeof motion.div>;

function FilesHighlight({
  className,
  style,
  children,
  ...props
}: FilesHighlightProps) {
  const { highlightBounds } = useFiles();

  return (
    <>
      <AnimatePresence>
        {highlightBounds && (
          <motion.div
            layoutId="files-highlight"
            className={className}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              top: highlightBounds.top,
              left: highlightBounds.left,
              width: highlightBounds.width,
              height: highlightBounds.height,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            style={{ position: "absolute", pointerEvents: "none", ...style }}
            {...props}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

function useHighlightHover() {
  const { containerRef, setHighlightBounds } = useFiles();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMouseEnter = React.useCallback(() => {
    const el = ref.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setHighlightBounds({
      top: eRect.top - cRect.top,
      left: eRect.left - cRect.left,
      width: eRect.width,
      height: eRect.height,
    });
  }, [containerRef, setHighlightBounds]);

  return { ref, onMouseEnter };
}

type FolderItemProps = React.ComponentProps<"div"> & {
  value: string;
  defaultOpen?: boolean;
};

function FolderItem({
  children,
  defaultOpen = false,
  ...props
}: FolderItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);

  return (
    <FolderItemProvider value={{ isOpen, toggle }}>
      <div {...props}>{children}</div>
    </FolderItemProvider>
  );
}

type FolderHeaderProps = React.ComponentProps<"div">;

function FolderHeader({ children, ...props }: FolderHeaderProps) {
  return <div {...props}>{children}</div>;
}

type FolderTriggerProps = React.ComponentProps<"button">;

function FolderTrigger({ children, onClick, ...props }: FolderTriggerProps) {
  const { toggle } = useFolderItem();

  return (
    <button
      type="button"
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type FolderHighlightProps = React.ComponentProps<"div">;

function FolderHighlight({ children, ...props }: FolderHighlightProps) {
  const { ref, onMouseEnter } = useHighlightHover();

  return (
    <div ref={ref} onMouseEnter={onMouseEnter} {...props}>
      {children}
    </div>
  );
}

type FolderProps = React.ComponentProps<"div">;

function Folder({ children, ...props }: FolderProps) {
  return <div {...props}>{children}</div>;
}

type FolderIconProps = {
  openIcon: React.ReactNode;
  closeIcon: React.ReactNode;
};

function FolderIcon({ openIcon, closeIcon }: FolderIconProps) {
  const { isOpen } = useFolderItem();
  return (
    <span className="inline-flex shrink-0 relative size-[1.125rem]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isOpen ? "open" : "close"}
          className="inline-flex"
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8,
          }}
        >
          {isOpen ? openIcon : closeIcon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type FileLabelProps = React.ComponentProps<"span">;

function FileLabel({ children, ...props }: FileLabelProps) {
  return <span {...props}>{children}</span>;
}

type FolderContentProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: React.ReactNode;
};

function FolderContent({ children, className }: FolderContentProps) {
  const { isOpen } = useFolderItem();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className={className}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type FileHighlightProps = React.ComponentProps<"div">;

function FileHighlight({ children, ...props }: FileHighlightProps) {
  const { ref, onMouseEnter } = useHighlightHover();

  return (
    <div ref={ref} onMouseEnter={onMouseEnter} {...props}>
      {children}
    </div>
  );
}

type FileProps = React.ComponentProps<"div">;

function File({ children, ...props }: FileProps) {
  return <div {...props}>{children}</div>;
}

type FileIconProps = React.ComponentProps<"span">;

function FileIcon({ children, ...props }: FileIconProps) {
  return (
    <span className="inline-flex shrink-0" {...props}>
      {children}
    </span>
  );
}

export {
  Files,
  FilesHighlight,
  FolderItem,
  FolderHeader,
  FolderTrigger,
  FolderHighlight,
  Folder,
  FolderIcon,
  FileLabel,
  FolderContent,
  FileHighlight,
  File,
  FileIcon,
  type FilesProps,
  type FilesHighlightProps,
  type FolderItemProps,
  type FolderHeaderProps,
  type FolderTriggerProps,
  type FolderHighlightProps,
  type FolderProps,
  type FolderIconProps,
  type FileLabelProps,
  type FolderContentProps,
  type FileHighlightProps,
  type FileProps,
  type FileIconProps,
};
