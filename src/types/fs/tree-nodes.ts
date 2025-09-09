import type { FsMeta } from "./meta";

export interface FsTreeNodes extends FsMeta {
  readonly children?: FsTreeNodes[];
}
