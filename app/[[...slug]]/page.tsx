import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { Metadata } from "next";
import { DocsAuthor } from "@/components/docs/docs-author";
import { ViewOptions } from "@/components/docs/page-actions";
import { Footer } from "@workspace/ui/components/docs/footer";
import { Button } from "@workspace/ui/components/ui/button";
import {
  ArrowLeft01Icon as ArrowLeft,
  ArrowRight01Icon as ArrowRight,
} from "hugeicons-react";
import Link from "next/link";
import { findNeighbour } from "fumadocs-core/server";
import { baseOptions } from "@/app/layout.config";

const SPONSOR_CONTACT_URL =
  "mailto:leo@unlumen.com?subject=Unlumen%20UI%20sponsorship";

function DocsUiTocCtas() {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <Link
        href="/components"
        className="group rounded-xl bg-surface p-4.5 text-sm transition-colors hover:bg-accent/40"
      >
        <p className="text-lg tracking-tight leading-6 font-medium ">
          Need polished motion components ready to go?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Save time and stand the hell out with my premium components library.
        </p>
        <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity group-hover:opacity-90">
          Explore components
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      {/*  <Link
        href={SPONSOR_CONTACT_URL}
        className="group rounded-xl bg-surface p-4.5 text-sm transition-colors hover:bg-accent/40"
      >
        <p className="text-lg tracking-tight leading-6 font-medium">
          Become a sponsor
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Be the first sponsor displayed here, with React and Next.js developers
          in front of your brand.
        </p>
        <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-opacity group-hover:opacity-90">
          Get in touch
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link> */}
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const showDocsUiTocCtas = page.url.startsWith("/docs/ui/");

  const tree = source.getPageTree();
  const { previous, next: nextPage } = findNeighbour(tree, page.url);

  type GuideLink = { text: string; url: string };
  const isGuideLink = (l: unknown): l is GuideLink => {
    if (typeof l !== "object" || l === null) return false;
    const obj = l as Record<string, unknown>;
    return typeof obj.url === "string" && typeof obj.text === "string";
  };
  const guideItems = (baseOptions.links ?? []).filter(isGuideLink);
  const guideIndex = guideItems.findIndex((it) => it.url === page.url);

  const prevNav = (() => {
    if (guideIndex >= 0 && guideItems.length > 0) {
      if (guideIndex > 0) {
        return {
          url: guideItems[guideIndex - 1].url,
          name: guideItems[guideIndex - 1].text,
        } as const;
      }
      return undefined;
    }

    if (previous) {
      return {
        url: previous.url,
        name: String(previous.name ?? "Précédent"),
      } as const;
    }

    if (page.url.startsWith("/docs/ui/")) {
      return { url: "/docs/ui", name: "UI" } as const;
    }
    const isSectionRoot =
      page.url === "/docs/ui" || page.url === "/docs/icons/get-started";
    if (isSectionRoot && guideItems.length > 0) {
      const last = guideItems[guideItems.length - 1];
      return { url: last.url, name: last.text } as const;
    }

    return undefined;
  })();

  const nextNav =
    guideIndex >= 0 && guideItems.length > 0
      ? guideIndex < guideItems.length - 1
        ? {
            url: guideItems[guideIndex + 1].url,
            name: guideItems[guideIndex + 1].text,
          }
        : { url: "/docs/ui", name: "UI" }
      : nextPage
        ? { url: nextPage.url, name: String(nextPage.name ?? "Suivant") }
        : undefined;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={
        showDocsUiTocCtas
          ? {
              enabled: true,
              footer: <DocsUiTocCtas />,
            }
          : undefined
      }
      tableOfContentPopover={
        showDocsUiTocCtas
          ? {
              footer: <DocsUiTocCtas />,
            }
          : undefined
      }
      footer={{
        component: (
          <Footer
            lastUpdate={
              page.data.lastModified
                ? new Date(page.data.lastModified)
                : undefined
            }
          />
        ),
      }}
    >
      <div className="flex flex-row gap-2 items-start w-full justify-between">
        <DocsTitle className="font-medium text-4xl tracking-tight">
          {page.data.title}
        </DocsTitle>
        {(prevNav || nextNav) && (
          <div className="flex flex-row gap-1.5 items-center pt-0.5">
            <Link
              href={prevNav?.url ?? page.url}
              aria-disabled={!prevNav}
              className={
                !prevNav ? "pointer-events-none opacity-50" : undefined
              }
              aria-label={
                prevNav ? `Aller à ${prevNav.name}` : "Pas de page précédente"
              }
            >
              <Button variant="accent" size="icon-sm">
                <ArrowLeft />
              </Button>
            </Link>
            <Link
              href={nextNav?.url ?? page.url}
              aria-disabled={!nextNav}
              className={
                !nextNav ? "pointer-events-none opacity-50" : undefined
              }
              aria-label={
                nextNav ? `Aller à ${nextNav.name}` : "Pas de page suivante"
              }
            >
              <Button variant="accent" size="icon-sm">
                <ArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>
      {page.data.author && (
        <DocsAuthor
          name={page.data.author.name}
          url={page.data.author?.url}
          credits={page.data.credits}
        />
      )}

      <div className="flex flex-row gap-2 items-center">
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/wicki-leonard-emf/unlumen-ui-docs/blob/main/content/docs/${page.path}`}
        />
      </div>

      <DocsBody id="docs-body" className="pb-10 pt-4">
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    authors: page.data?.author
      ? [
          {
            name: page.data.author.name,
            ...(page.data.author?.url && { url: page.data.author.url }),
          },
        ]
      : {
          name: "Léo",
          url: "https://unlumen.com",
        },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: `https://ui.unlumen.com/docs/${slug.join("/")}`,
      siteName: "Unlumen Ui",
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: `/docs/${slug.join("/")}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@unlumenui",
      title: page.data.title,
      description: page.data.description,
    },
  };
}
