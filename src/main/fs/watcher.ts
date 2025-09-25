import chokidar from "chokidar";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@utils/index";
import { ok, fail } from "@utils/index";

import type { Result } from "@utils/index";
import type { FSWatcher } from "chokidar";

class Watcher {
  private _watcher: FSWatcher | null = null;
  private _watcherPaths: string[] = [];
  public watched: string[] = [];
  public depth: number = 1;

  // constructor() {}

  public async create(path: string | string[], depth?: number): Promise<Watcher> {
    const instance = new Watcher();

    this.watched.push(...(Array.isArray(path) ? path : [path]));
    this.depth = depth || 1;

    await instance.watch();

    return instance;
  }

  get watcher(): FSWatcher | null {
    return this._watcher;
  }

  private async watch(): Promise<void> {
    try {
      this._watcher = chokidar.watch(this._watcherPaths, {
        persistent: false, // Indicates whether the process should continue to run as long as files are being watched.
        atomic: true,
        interval: 100,
        binaryInterval: 300,
        cwd: ".",
        // If set, limits how many levels of subdirectories will be traversed.
        depth: this.depth,
        followSymlinks: true,
        ignoreInitial: false,
        ignorePermissionErrors: false,
        // Whether to use fs.watchFile (backed by polling), or fs.watch.
        // If polling leads to high CPU utilization, consider setting this to false.
        // It is typically necessary to set this to true to successfully watch files over a network,
        // and it may be necessary to successfully watch files in other non-standard situations.
        // Setting to true explicitly on MacOS overrides the useFsEvents default.
        // You may also set the CHOKIDAR_USEPOLLING env variable to true (1) or false (0) in order to override this option.
        usePolling: true,
        // If relying upon the fs.Stats object that may get passed with add, addDir,
        // and change events, set this to true to ensure it is provided even in cases where it wasn't already available from the underlying watch events.
        alwaysStat: true
      });

      this._watcher.on("error", (error) => logger.error(`Watcher error: ${error}`, "fs:watcher"));
      // .on("add", (path) => logger.info(`File ${path} has been added`, "fs:watcher"))
      // .on("addDir", (path) => logger.info(`Directory ${path} has been added`, "fs:watcher"))
      // .on("unlinkDir", (path) => logger.info(`Directory ${path} has been removed`, "fs:watcher"))
      // .on("ready", () => logger.info("Initial scan complete. Ready for changes", "fs:watcher"))
      // .on("raw", (event, path, details) => {
      //   // internal
      //   logger.info(`Raw event info: ${event}, ${path}, ${details}`, "fs:watcher");
      // })
      // .on("unlink", (path) => logger.info(`File ${path} has been removed`, "fs:watcher"));

      // 'add', 'addDir' and 'change' events also receive stat() results as second
      // argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
      this._watcher.on("change", (path, stats) => {
        if (stats) logger.info(`File ${path} changed size to ${stats.size}`, "fs:watcher");
      });

      logger.info("Watcher is ready", "fs:watcher");
    } catch (error) {
      logger.error(error as string, "fs:watcher");
    }
  }

  public async close(): Promise<void> {
    try {
      if (this._watcher) {
        await this._watcher.close();

        logger.info("Watcher is closed", "fs:watcher");
      }
    } catch (error) {
      logger.error(error as string, "fs:watcher");
    }
  }

  public add(path: string): void {
    try {
      if (this._watcher) {
        this._watcher.add(path);

        this._watcherPaths.push(path);

        logger.info(`Added path ${path} to watcher`, "fs:watcher");
      }
    } catch (error) {
      logger.error(error as string, "fs:watcher");
    }
  }

  public unwatch(path: string | string[]): void {
    try {
      if (this._watcher) {
        this._watcher.unwatch(path);

        if (Array.isArray(path)) {
          this._watcherPaths = this._watcherPaths.filter(
            (watchedPath) => !path.includes(watchedPath)
          );
        } else {
          this._watcherPaths = this._watcherPaths.filter((watchedPath) => watchedPath !== path);
        }

        logger.info(`Unwatch path ${path} from watcher`, "fs:watcher");
      }
    } catch (error) {
      logger.error(error as string, "fs:watcher");
    }
  }

  public async getWatched(): Promise<Result<{ watched: string[] }>> {
    try {
      return ok({ watched: this._watcherPaths });
    } catch (error) {
      logger.error(error as string, "fs:watcher");

      return fail(error);
    }
  }
}

const watchersMap = new Map<Watcher, string>();

export const fsWatcherCreate = async (
  path: string | string[],
  depth?: number
): Promise<
  Result<{
    watchId: string;
    path: string | string[];
  }>
> => {
  const watcher = new Watcher();
  await watcher.create(path, depth);

  const watchId = uuidv4();

  watchersMap.set(watcher, watchId);

  logger.info(`Watcher created with id ${watchId}`, "fs:watcher");

  return ok({ watchId, path });
};

export const fsWatcherClose = async (watchId: string): Promise<Result<{ message: string }>> => {
  for (const [watcher, id] of watchersMap.entries()) {
    if (id === watchId) {
      await watcher.close();

      watchersMap.delete(watcher);

      return ok({ message: "Watcher closed" });
    }
  }

  return fail("Watcher not found");
};

export const fsWatcherAdd = async (
  watchId: string,
  path: string
): Promise<Result<{ message: string }>> => {
  for (const [watcher, id] of watchersMap.entries()) {
    if (id === watchId) {
      watcher.add(path);

      return ok({ message: `Path added to watcher: ${path}` });
    }
  }

  return fail("Watcher not found");
};
