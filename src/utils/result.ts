/* eslint-disable @typescript-eslint/no-explicit-any */

type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";

interface ResultData {
  message: string | number | boolean | object | null;
  [key: string]: any;
}

interface ResultError {
  message: string;
  details?: any;
}

export interface Result {
  success: boolean;
  method: HttpMethod;
  code?: number;
  data?: ResultData;
  error?: ResultError;
}

/**
 * Api result helper
 * @param {boolean} options.success Success or failure
 * @param {HttpMethod} options.method Http method
 * @param {number} options.code Http status code
 * @param {ResultData} options.data Data
 * @param {string | any} options.error Error message or error object
 * @returns {Result} Result
 */
export function result(options: {
  success: boolean;
  method?: HttpMethod;
  code?: number;
  data?: ResultData;
  error?:
    | {
        message: string;
        details?: any;
      }
    | string
    | any;
}): Result {
  const { success } = options;

  // Default
  const method = options.method ?? "get";

  const data = options.data ?? (success ? { message: "success" } : { message: null });

  const error = options.error
    ? typeof options.error === "string"
      ? { message: options.error }
      : "message" in options.error
        ? options.error
        : { message: "Unknown error", details: options.error }
    : undefined;

  const code = options.code ?? (success ? 200 : 500);

  return {
    success,
    method,
    code,
    data,
    error
  };
}
