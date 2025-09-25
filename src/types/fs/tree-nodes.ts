export interface FsNode {
  name: string;
  path: string;
  isFile: boolean;
  isDir: boolean;
  children?: FsNode[];
}
