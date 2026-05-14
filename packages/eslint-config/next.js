import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';

/**
 * A Next.js app ESLint configuration.
 *
 * Keep this close to the rules a fresh Next.js app gets from
 * eslint-config-next/core-web-vitals. Avoid the broader workspace JS/TS
 * recommended presets here because they create a lot of warnings that Next
 * does not emit by default.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  eslintConfigPrettier,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
  {
    ignores: ['.next/**', 'dist/**', 'next-env.d.ts'],
  },
];
