import { logger } from "@utils/logger";
import { dialog } from "electron";
import { lstat } from "fs/promises";
import { ok, fail } from "@utils/result";

import type { Result } from "@utils/result";

export const fsOpenFolder = async (): Promise<Result<{ path: string[] }>> => {
  try {
    const result = await dialog.showOpenDialog({
      properties: [
        "openDirectory",
        "multiSelections",
        "showHiddenFiles",
        "createDirectory",
        "promptToCreate",
        "treatPackageAsDirectory",
        "dontAddToRecent"
      ]
    });

    if (result.canceled) {
      logger.info("Open folder canceled.", "fs:open:folder");
      return fail(new Error("Open folder canceled."));
    }

    logger.info(`Open file success: ${result.filePaths}.`, "fs:open:folder");

    return ok({ path: result.filePaths });
  } catch (error) {
    return fail(new Error("Open folder failed: " + error));
  }
};

export const fsOpenFile = async (): Promise<Result<{ path: string[] }>> => {
  try {
    const result = await dialog.showOpenDialog({
      properties: [
        "openFile",
        "multiSelections",
        "showHiddenFiles",
        "createDirectory",
        "promptToCreate",
        "treatPackageAsDirectory",
        "dontAddToRecent"
      ],
      filters: [
        { name: "Markdown Files", extensions: ["md", "markdown"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });

    if (result.canceled) {
      logger.info("Open file canceled.", "fs:open:file");
      return fail(new Error("Open file canceled."));
    }

    const invalidPaths = result.filePaths.filter(async (p) => {
      const isDir = (await lstat(p)).isDirectory();
      const isMdFile = p.toLowerCase().endsWith(".md") || p.toLowerCase().endsWith(".markdown");
      return !isDir && !isMdFile;
    });

    if (invalidPaths.length > 0) {
      logger.warn(`Invalid files selected: ${invalidPaths.join(", ")}`, "fs:open:file");

      return fail(new Error("Only Markdown files or directories are allowed."));
    }

    logger.info(`Open file success: ${result.filePaths}.`, "fs:open:file");

    return ok({ path: result.filePaths });
  } catch (error) {
    return fail(new Error("Open file failed: " + error));
  }
};
