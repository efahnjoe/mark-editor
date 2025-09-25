import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { Context } from "@utils/logger";

// Custom APIs for renderer
const api = {
  logger: {
    log: (level: string, message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:log", level, message, module, context),
    error: (message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:error", message, module, context),
    warn: (message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:warn", message, module, context),
    info: (message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:info", message, module, context),
    verbose: (message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:verbose", message, module, context),
    debug: (message: string, module?: string, context?: Context) =>
      electronAPI.ipcRenderer.send("logger:debug", message, module, context)
  },
  fs: {
    open: {
      folder: () => electronAPI.ipcRenderer.invoke("fs:open:folder"),
      file: () => electronAPI.ipcRenderer.invoke("fs:open:file")
    },
    node: (path: string, maxDepth?: number) =>
      electronAPI.ipcRenderer.invoke("fs:node", path, maxDepth),
    // watcher: (path: string) => electronAPI.ipcRenderer.send("fs:watcher", path)
    watcher: {
      create: (path: string | string[], depth?: number) =>
        electronAPI.ipcRenderer.invoke("fs:watcher:create", path, depth),
      close: (watchId: string) => electronAPI.ipcRenderer.invoke("fs:watcher:close", watchId),
      add: (watchId: string, path: string) =>
        electronAPI.ipcRenderer.invoke("fs:watcher:add", watchId, path)
    }
  },

  readFile: (filePath: string) => electronAPI.ipcRenderer.invoke("fs:file:read", filePath),
  writeFile: (filePath: string, content: string) =>
    electronAPI.ipcRenderer.invoke("fs:file:write", filePath, content),
  getVersion: () => electronAPI.ipcRenderer.invoke("version:get"),
  checkUpdate: () => electronAPI.ipcRenderer.invoke("version:check")
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
