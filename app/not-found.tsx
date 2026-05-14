import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <p className="rounded-full bg-surface px-3 py-1 text-xs font-medium">
        Error 404
      </p>
      <h1 className="text-5xl font-medium tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The documentation page you are looking for does not exist.
      </p>
      <Link href="/docs" className="text-sm underline underline-offset-4">
        Back to docs
      </Link>
    </main>
  );
}
