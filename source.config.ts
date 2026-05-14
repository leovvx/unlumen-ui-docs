import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      new: z.boolean().optional(),
      beta: z.boolean().optional(),
      alpha: z.boolean().optional(),
      updated: z.boolean().optional(),
      deprecated: z.boolean().optional(),
      premium: z.boolean().optional(),
      author: z
        .object({
          name: z.string(),
          url: z.string().optional(),
        })
        .optional(),
      credits: z
        .object({
          name: z.string(),
          url: z.string().optional(),
        })
        .optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {},
});
