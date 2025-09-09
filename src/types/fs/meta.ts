export enum GitStatus {
  Unmodified = "unmodified",
  Modified = "modified",
  Added = "added",
  Deleted = "deleted",
  Renamed = "renamed",
  Copied = "copied",
  Unmerged = "unmerged",
  Ignored = "ignored"
}

export interface GitMeta {
  readonly status?: GitStatus;
  readonly branch?: string;
  readonly commitMessage?: string;
  readonly commitHash?: string;
  readonly isIgnored?: boolean;
  readonly isUntracked?: boolean;
  readonly isStaged?: boolean;
}

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

export interface InodeInfo {
  readonly dev?: number;
  readonly ino?: number;
  readonly mode?: number;
  readonly nlink?: number;
  readonly uid?: number;
  readonly gid?: number;
  readonly rdev?: number;
  readonly size?: number;
  readonly blksize?: number;
  readonly blocks?: number;

  readonly atimeMs?: number;
  readonly mtimeMs?: number;
  readonly ctimeMs?: number;
  readonly birthtimeMs?: number;

  readonly atime?: string; // ISO 8601 timestamp, last access time
  readonly mtime?: string; // ISO 8601 timestamp, last modification time (content)
  readonly ctime?: string; // ISO 8601 timestamp, last inode change time (metadata or content), NOT creation time
  readonly birthtime?: string;
}

export interface PermissionBits {
  readonly owner: { read: boolean; write: boolean; execute: boolean };
  readonly group: { read: boolean; write: boolean; execute: boolean };
  readonly others: { read: boolean; write: boolean; execute: boolean };
  readonly sticky?: boolean;
  readonly setuid?: boolean;
  readonly setgid?: boolean;
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
  readonly relativePath?: string; // relative to project or workspace
  readonly type: FsType;
  readonly size?: number;
  readonly extension?: string;

  readonly createdAt?: string; // File creation time (if available)
  readonly createdBy?: string;

  readonly lastModifiedAt?: string; // = inode.mtime
  readonly lastModifiedBy?: string;

  readonly lastAccessedAt?: string; // = inode.atime
  readonly metadataChangedAt?: string; // = inode.ctime

  readonly hardlinkCount?: number; // alias for inode?.nlink
  readonly symlinkTarget?: string; // path it points to

  readonly mime?: string;
  readonly isHidden?: boolean;
  readonly isExecutable?: boolean;
  readonly permissions?: PermissionBits; // now optional
  readonly ownerId?: number | string;
  readonly groupId?: number | string;
  readonly inode?: InodeInfo;
  readonly isEmpty?: DirEmptyState;
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

  readonly interpretation?: {
    /**
     * Text encoding label. Should be a valid IANA/WHATWG encoding name.
     * Examples: "utf-8", "gbk", "shift-jis", "euc-kr"
     *
     * **Note**: Use `normalizeEncoding()` to standardize before comparison.
     */
    readonly encoding?: string;

    readonly lineEnding?: "lf" | "crlf" | "cr";
    readonly languageId?:
      | "typescript"
      | "javascript"
      | "python"
      | "java"
      | "go"
      | "rust"
      | "markdown"
      | "json"
      | "yaml"
      | string; // fallback

    /**
     * Confidence level of charset detection.
     * Range: 0 (low) to 1 (high), inclusive.
     * @example 0.95
     */
    readonly charsetConfidence?: number;
  };
}

export interface FsMeta extends FileMeta, GitMeta, UserMeta {
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
