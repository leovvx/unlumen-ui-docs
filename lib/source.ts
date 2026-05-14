import { docs } from "@/.source";
import { attachFile } from "@/lib/attach-file";
import { attachSeparator } from "@/lib/attach-separator";
import {
  loader,
  type InferMetaType,
  type InferPageType,
} from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile,
    attachSeparator,
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
