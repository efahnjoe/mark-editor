export enum FsType {
  File = "file",
  Directory = "directory",
  BlockDevice = "block-device",
  CharacterDevice = "character-device",
  SymbolicLink = "symbolic-link",
  FIFO = "fifo",
  Socket = "socket",
  Unknown = "unknown"
}

/**
 * Check if the directory is empty.
 *
 * **Empty**: The directory is empty.
 *
 * **NonEmpty**: The directory is not empty.
 *
 * **Unknown**: Unable to determine (insufficient permissions, exceeding depth, etc.)
 *
 * **Error**: An error occurred.
 *
 * Unable to determine (insufficient permissions, exceeding depth, etc.)
 */
export enum DirEmptyState {
  Empty = "empty",
  NonEmpty = "non-empty",
  Unknown = "unknown",
  Error = "error"
}

export interface FileMeta {
  readonly name: string; // basename of the file (e.g., "index.ts")
  readonly path?: string; // relative to project or workspace
  readonly type: FsType;
  readonly isEmpty?: DirEmptyState;
  readonly size?: number;
  readonly extension?: string;

  readonly hardlinkCount?: number; // alias for inode?.nlink
  readonly symlinkTarget?: string; // path it points to
}

export enum LifecycleStatus {
  Active = "active",
  Trashed = "trashed",
  Archived = "archived",
  Locked = "locked"
}

export interface UserMeta {
  readonly tags?: Array<string>;
  readonly favorited?: boolean;
  readonly thumbnail?: string;
  readonly description?: string;

  readonly version?: string;
  readonly checksum?: string;

  readonly lifecycleStatus?: LifecycleStatus;
  readonly trashedAt?: string;
}

export interface FsMeta extends FileMeta, UserMeta {
  /**
   * @private
   * @internal For memoization, diffing, or cache invalidation
   */
  readonly _cacheKey?: string;

  /**
   * @private
   * @internal Hash of content + key metadata (e.g., mtime, size, path)
   */
  readonly _fingerprint?: string;
}
