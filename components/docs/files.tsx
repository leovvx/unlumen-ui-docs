"use client";

import * as React from "react";
import {
  Folder01Icon as FolderIcon,
  Folder02Icon as FolderOpenIcon,
  File02Icon as FileIcon,
} from "hugeicons-react";
import {
  Files as FilesPrimitive,
  FilesHighlight as FilesHighlightPrimitive,
  FolderItem as FolderItemPrimitive,
  FolderHeader as FolderHeaderPrimitive,
  FolderTrigger as FolderTriggerPrimitive,
  FolderHighlight as FolderHighlightPrimitive,
  Folder as FolderPrimitive,
  FolderIcon as FolderIconPrimitive,
  FileLabel as FileLabelPrimitive,
  FolderContent as FolderContentPrimitive,
  FileHighlight as FileHighlightPrimitive,
  File as FilePrimitive,
  FileIcon as FileIconPrimitive,
  type FilesProps as FilesPrimitiveProps,
  type FolderItemProps as FolderItemPrimitiveProps,
  type FolderContentProps as FolderContentPrimitiveProps,
  type FileProps as FilePrimitiveProps,
  type FileLabelProps as FileLabelPrimitiveProps,
} from "@/registry/primitives/animate/files";
import { cn } from "@workspace/ui/lib/utils";

// ─── Files (root) ──────────────────────────────────────────────────────────────

type FilesProps = FilesPrimitiveProps & {
  previewBackground?: "surface" | "background";
};

function Files({
  className,
  children,
  previewBackground = "surface",
  ...props
}: FilesProps) {
  const isBackgroundPreview = previewBackground === "background";

  return (
    <FilesPrimitive className={cn("p-2 w-full relative", className)} {...props}>
      <FilesHighlightPrimitive
        className={cn(
          "rounded-lg pointer-events-none -z-10 border",
          isBackgroundPreview
            ? "bg-accent/40 border-accent/30"
            : "bg-accent/55 border-accent/45",
        )}
      >
        {children}
      </FilesHighlightPrimitive>
    </FilesPrimitive>
  );
}

// ─── FolderItem ────────────────────────────────────────────────────────────────

type FolderItemProps = FolderItemPrimitiveProps;

function FolderItem(props: FolderItemProps) {
  return <FolderItemPrimitive {...props} />;
}

// ─── FolderTrigger ─────────────────────────────────────────────────────────────

type FolderTriggerProps = FileLabelPrimitiveProps;

function FolderTrigger({ children, className, ...props }: FolderTriggerProps) {
  return (
    <FolderHeaderPrimitive>
      <FolderTriggerPrimitive className="w-full text-start">
        <FolderHighlightPrimitive>
          <FolderPrimitive className="flex items-center gap-2 p-2 pointer-events-none">
            <FolderIconPrimitive
              closeIcon={<FolderIcon className="size-4.5" />}
              openIcon={<FolderOpenIcon className="size-4.5" />}
            />
            <FileLabelPrimitive className={cn("text-sm", className)} {...props}>
              {children}
            </FileLabelPrimitive>
          </FolderPrimitive>
        </FolderHighlightPrimitive>
      </FolderTriggerPrimitive>
    </FolderHeaderPrimitive>
  );
}

// ─── FolderContent ─────────────────────────────────────────────────────────────

type FolderContentProps = FolderContentPrimitiveProps;

function FolderContent(props: FolderContentProps) {
  return (
    <div className="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:h-full before:bg-border">
      <FolderContentPrimitive {...props} />
    </div>
  );
}

// ─── FileItem ──────────────────────────────────────────────────────────────────

type FileItemProps = FilePrimitiveProps & {
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
};

function FileItem({
  icon: Icon = FileIcon,
  className,
  children,
  highlight,
  ...props
}: FileItemProps) {
  return (
    <FileHighlightPrimitive>
      <FilePrimitive
        className={cn(
          "flex items-center gap-2 p-2 pointer-events-none",
          highlight && "text-pink-400",
          className,
        )}
      >
        <FileIconPrimitive>
          <Icon className="size-4.5" />
        </FileIconPrimitive>
        <FileLabelPrimitive className="text-sm" {...props}>
          {children}
        </FileLabelPrimitive>
      </FilePrimitive>
    </FileHighlightPrimitive>
  );
}

export {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  type FilesProps,
  type FolderItemProps,
  type FolderTriggerProps,
  type FolderContentProps,
  type FileItemProps,
};
