import { app } from "electron";
import { format, createLogger, config, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { join } from "node:path";
import { mkdirSync, existsSync } from "node:fs";
import type { Logger as WinstonLogger } from "winston";

const logDir = join(app.getPath("userData"), "logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// console.log("Log directory:", logDir);

const logFormat = format.printf(({ level, message, timestamp, module, ...args }) => {
  let metaStr = "";
  const metadata = Object.keys(args).length > 0 ? args : null;

  if (metadata) {
    try {
      metaStr = ` ${JSON.stringify(metadata)}`;
    } catch (error) {
      metaStr = "[Connot stringify metadata]";

      console.error(`[Logger Error] - [Logger] ${metaStr}: ${error}`);
    }
  }

  if (module) {
    return `${timestamp} ${level.toUpperCase()} - [${module}] ${message}${metaStr}`;
  } else {
    return `${timestamp} ${level.toUpperCase()} ${message}${metaStr}`;
  }
});

const consoleFormat = format.printf(({ level, message, timestamp, module, ...args }) => {
  let metaStr = "";
  const metadata = Object.keys(args).length > 0 ? args : null;

  if (metadata) {
    try {
      metaStr = ` ${JSON.stringify(metadata)}`;
    } catch (error) {
      metaStr = "[Connot stringify metadata]";

      console.error(`[Logger Error] - [Logger] ${metaStr}: ${error}`);
    }
  }

  if (module) {
    return `${timestamp} ${level.toUpperCase()} - [${module}] ${message}${metaStr}`;
  } else {
    return `${timestamp} ${level.toUpperCase()} ${message}${metaStr}`;
  }
});

export type Context = Record<string, unknown>;

export class Logger {
  private _logger: WinstonLogger;

  constructor() {
    this._logger = createLogger({
      levels: config.npm.levels,
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: logFormat,
      transports: [
        new DailyRotateFile({
          dirname: logDir,
          filename: "%DATE%",
          datePattern: "YYYY-MM-DD",
          extension: ".log",
          level: "info",
          zippedArchive: true,
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.errors({ stack: true }),
            logFormat
          ),
          maxFiles: "30d",
          maxSize: "20m",
          auditFile: join(logDir, ".audit.json"),
          createSymlink: true,
          symlinkName: "latest.log"
        })
      ],
      exitOnError: false,
      silent: process.env.NODE_ENV === "test"
    });

    if (process.env.NODE_ENV !== "production") {
      this._logger.add(
        new transports.Console({
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.errors({ stack: true }),
            consoleFormat
          )
        })
      );
    }
  }

  /**
   * Common Log Fn
   * @param level
   * @param message
   * @param context Log context
   */
  public log(level: string, message: string, module?: string, context?: Context): void {
    try {
      this._logger.log({
        level,
        message,
        module,
        ...(context || {})
      });
    } catch (err) {
      console.error("[Logger] Failed to log info:", err);
    }
  }

  /**
   * Error
   * @param message
   * @param context
   */
  public error(message: string, module?: string, context?: Context): void {
    this.log("error", message, module, context);
  }

  /**
   * Warn
   * @param message
   * @param context
   */
  public warn(message: string, module?: string, context?: Context): void {
    this.log("warn", message, module, context);
  }

  /**
   * Info
   * @param message
   * @param context
   */
  public info(message: string, module?: string, context?: Context): void {
    this.log("info", message, module, context);
  }

  /**
   * Verbose
   * @param message
   * @param context
   */
  public verbose(message: string, module?: string, context?: Context): void {
    this.log("verbose", message, module, context);
  }

  /**
   * Debug
   * @param message
   * @param context
   */
  public debug(message: string, module?: string, context?: Context): void {
    this.log("debug", message, module, context);
  }
}

export const logger = new Logger();
