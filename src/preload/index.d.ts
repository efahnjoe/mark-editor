import { ElectronAPI } from "@electron-toolkit/preload";
import type { Result } from "../utils/result";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      readFile: (filePath: string) => Promise<Result>;
      writeFile: (filePath: string, content: string) => Promise<Result>;

      getVersion: () => Promise<Result>;
      checkUpdate: () => Promise<Result>;
    };
  }
}
