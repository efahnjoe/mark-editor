import { ElectronAPI } from "@electron-toolkit/preload";
import type { Result, Ok } from "../utils/result";

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
        Ok<{
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
