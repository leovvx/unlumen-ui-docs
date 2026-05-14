"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { motion, AnimatePresence } from "motion/react";
import { FileEditIcon as FileText, HashtagIcon as Hash } from "hugeicons-react";
import { useMemo, useState, useCallback, Fragment } from "react";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
  useSearchList,
} from "fumadocs-ui/components/dialog/search";
import type { DefaultSearchDialogProps } from "fumadocs-ui/components/dialog/search-default";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { cn } from "@workspace/ui/lib/utils";
import type { SortedResult } from "fumadocs-core/server";

type ReactSortedResult = Omit<SortedResult, "content"> & {
  external?: boolean;
  content: React.ReactNode;
};

function highlightContent(
  content: React.ReactNode,
  query: string,
): React.ReactNode {
  if (typeof content !== "string" || !query.trim()) return content;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = content.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="font-medium tracking-normal not-italic text-foreground/90"
          >
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

const typeIcons: Record<string, React.ReactNode> = {
  heading: <Hash className="size-2 shrink-0 text-fd-muted-foreground" />,
  page: (
    <FileText className="size-6 text-fd-muted-foreground bg-fd-muted border p-2! rounded-sm shadow-sm shrink-0" />
  ),
};

function AnimatedItem({
  item,
  onClick,
  index,
  search,
}: {
  item: ReactSortedResult;
  onClick: () => void;
  index: number;
  search: string;
}) {
  const { active: activeId, setActive } = useSearchList();
  const isActive = item.id === activeId;

  const highlightedItem = useMemo(
    () => ({ ...item, content: highlightContent(item.content, search) }),
    [item, search],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03, ease: "easeOut" }}
    >
      <SearchDialogListItem
        item={highlightedItem}
        onClick={onClick}
        className={cn(
          "relative flex select-none flex-row items-center gap-2 p-2.5 text-start text-sm rounded-lg w-full transition-colors duration-100",
          item.type !== "page" && "ps-9",
          item.type === "page" || item.type === "heading"
            ? "font-base text-md"
            : "text-fd-popover-foreground/50",
          isActive
            ? "bg-fd-accent text-fd-accent-foreground"
            : "hover:bg-fd-accent/60",
        )}
      />
    </motion.div>
  );
}

export function CustomSearchDialog({
  defaultTag,
  tags = [],
  api,
  delayMs,
  type = "fetch",
  allowClear = false,
  links = [],
  footer,
  ...props
}: DefaultSearchDialogProps) {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);

  const { search, setSearch, query } = useDocsSearch(
    type === "fetch"
      ? { type: "fetch", api, locale, tag, delayMs }
      : { type: "static", from: api, locale, tag, delayMs },
  );

  const defaultItems = useMemo(() => {
    if (links.length === 0) return null;
    return links.map(([name, link]) => ({
      type: "page" as const,
      id: name,
      content: name,
      url: link,
    }));
  }, [links]);

  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  const items = query.data !== "empty" ? query.data : defaultItems;

  const renderItem = useCallback(
    ({ item, onClick }: { item: ReactSortedResult; onClick: () => void }) => {
      const index = items?.findIndex((i) => i.id === item.id) ?? 0;
      return (
        <AnimatedItem
          item={item}
          onClick={onClick}
          index={index}
          search={search}
        />
      );
    },
    [items, search],
  );

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      {/* Overlay — darker, instant fade */}
      <SearchDialogOverlay className="bg-black/10 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />

      {/* Content — solid bg, tighter shadow, slightly less rounded */}
      <SearchDialogContent
        className={cn(
          "!bg-background !backdrop-blur-none",
          "!border-border/50",
          "!shadow-2xl !shadow-black/30",
          "!rounded-3xl mb-2",
          "!divide-y-0",
        )}
      >
        {/* Header */}
        <SearchDialogHeader className="gap-2.5 px-3.5 py-4 -mb-0.5">
          <SearchDialogIcon className="shrink-0 transition-opacity duration-200 data-[loading=true]:opacity-40" />
          <SearchDialogInput className="text-base! font-base! font-light! placeholder:text-fd-muted-foreground/60 caret-primary" />
          <SearchDialogClose className="shrink-0 text-xs opacity-80 font-medium font-base hover:opacity-100 transition-opacity duration-150" />
        </SearchDialogHeader>

        {/* Results list with staggered items */}
        <SearchDialogList items={items} Item={renderItem} />
      </SearchDialogContent>

      {/* Footer */}
      {(tags.length > 0 || footer) && (
        <SearchDialogFooter>
          {tags.length > 0 && (
            <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
              {tags.map((t) => (
                <TagsListItem key={t.value} value={t.value}>
                  {t.name}
                </TagsListItem>
              ))}
            </TagsList>
          )}
          {footer}
        </SearchDialogFooter>
      )}
    </SearchDialog>
  );
}
