import { ElectronAPI } from "@electron-toolkit/preload";
import type { Result, Ok } from "../utils/result";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
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
