# unlumen UI Docs

I maintain this open-source documentation site and public component registry for [unlumen UI](https://ui.unlumen.com). The code and public registry items in this repository are licensed under [MIT](./LICENSE).

I keep commercial Pro components, license validation, customer data, and private product APIs in a separate private repository.

## Requirements

- Node.js `22.18.0` (see [`.nvmrc`](./.nvmrc))
- pnpm `10.26.0` (enabled through Corepack)

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Development

```bash
pnpm dev
```

The documentation app uses `basePath: "/docs"` and runs locally at `http://localhost:3001/docs`.

## Architecture

- `app/` contains the Next.js App Router documentation site and search endpoints.
- `content/docs/` contains MDX documentation.
- `registry/` is the source of truth for public shadcn registry components.
- `public/r/` and `__registry__/index.tsx` are generated registry artifacts.
- `packages/ui/` provides shared UI components used by the docs application.

## Registry workflow

Validate source metadata before generating artifacts:

```bash
pnpm registry:validate:sources
pnpm registry:build
pnpm registry:validate:generated
```

`registry:build` uses the lockfile-installed shadcn CLI. Commit its generated outputs with the corresponding source changes.

## Verification and release

Before opening a pull request or release:

```bash
pnpm format:check
pnpm lint
pnpm test:unit
pnpm build
pnpm registry:validate:sources
pnpm registry:validate:generated
pnpm audit --prod --audit-level=moderate
```

Release from a clean, reviewed branch only. Keep local browser/debug artifacts, credentials, and commercial source code out of commits.

## Contributing and security

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [SECURITY.md](./SECURITY.md).
