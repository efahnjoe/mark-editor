import { ElectronAPI } from "@electron-toolkit/preload";
import type { Result } from "../utils/result";
import type { FsNode } from "@shared/types/index";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      logger: {
        log: (
          level: string,
          message: string,
          module?: string | undefined,
          context?: Context | undefined
        ) => void;
        debug: (
          message: string,
          module?: string | undefined,
          context?: Context | undefined
        ) => void;
        info: (message: string, module?: string | undefined, context?: Context | undefined) => void;
        warn: (message: string, module?: string | undefined, context?: Context | undefined) => void;
        error: (
          message: string,
          module?: string | undefined,
          context?: Context | undefined
        ) => void;
        verbose: (
          message: string,
          module?: string | undefined,
          context?: Context | undefined
        ) => void;
      };

      fs: {
        open: {
          folder: () => Promise<
            Result<{
              path: string[];
            }>
          >;
          file: () => Promise<
            Result<{
              path: string[];
            }>
          >;
        };
        node: (root: string | string[], maxDepth?: number) => Promise<Result<{ tree: FsNode[] }>>;
        watcher: {
          create: (
            path: string | string[],
            depth?: number
          ) => Promise<
            Result<{
              watchId: string;
              path: string | string[];
            }>
          >;
          close: (watchId: string) => Promise<Result<{ message: string }>>;
          add: (watchId: string, path: string) => Promise<Result<{ message: string }>>;
        };
      };

      readFile: (filePath: string) => Promise<
        Result<{
          content: string;
        }>
      >;
      writeFile: (
        filePath: string,
        content: string
      ) => Promise<
        Result<{
          message: string;
        }>
      >;

      getVersion: () => Promise<
        Result<{
          version: string;
        }>
      >;
      checkUpdate: () => Promise<
        Result<{
          message: string;
          hasUpdate: boolean;
          latestVersion: string;
          currentVersion: string;
          releaseUrl: string;
        }>
      >;
    };
  }
}
