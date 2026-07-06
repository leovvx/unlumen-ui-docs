# Contributing

## Getting started

Use Node.js 22.18.0 and pnpm 10.26.0, then run `pnpm install --frozen-lockfile`.

I ask that changes stay focused. Do not commit credentials, generated local-browser artifacts, commercial Pro source, or unrelated formatting changes.

## Component and documentation changes

- Add public registry source under `registry/` and declare every file and package dependency in its `registry-item.json`.
- Regenerate `public/r/` and `__registry__/index.tsx` with `pnpm registry:build` when registry source changes.
- Include documentation, accessibility behavior, and tests for behavior that processes user input.
- Confirm you have the right to submit all source code and assets under MIT.

## Required checks

Run the commands listed in the README's Verification and release section before asking me for review.
