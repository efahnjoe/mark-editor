import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

import icon from "../../resources/icon.png?asset";
import { getVersion, checkUpdate } from "./version";
import { fileRead, fileWrite } from "./file";
import { logger, Context } from "@utils/logger";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// const LOG_DIR = join(app.getPath("userData"), "logs");

// contextBridge.exposeInMainWorld("electronAPI", {
//   getLogPath: () => LOG_DIR
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on(
  "logger:log",
  (_event, level: string, message: string, module?: string, context?: Context) => {
    return logger.log(level, message, module, context);
  }
);

ipcMain.on("logger:error", (_event, message: string, module?: string, context?: Context) => {
  return logger.error(message, module, context);
});

ipcMain.on("logger:warn", (_event, message: string, module?: string, context?: Context) => {
  return logger.warn(message, module, context);
});

ipcMain.on("logger:info", (_event, message: string, module?: string, context?: Context) => {
  return logger.info(message, module, context);
});

ipcMain.on("logger:verbose", (_event, message: string, module?: string, context?: Context) => {
  return logger.verbose(message, module, context);
});

ipcMain.on("logger:debug", (_event, message: string, module?: string, context?: Context) => {
  return logger.debug(message, module, context);
});

ipcMain.handle("file:read", async (_event, path) => {
  return fileRead(path);
});

ipcMain.handle("file:write", async (_event, filePath, content) => {
  return fileWrite(filePath, content);
});

ipcMain.handle("version:get", async () => {
  return getVersion();
});

ipcMain.handle("version:check", async () => {
  return await checkUpdate();
});
