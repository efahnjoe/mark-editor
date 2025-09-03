/* eslint-disable @typescript-eslint/no-explicit-any */

interface ResultError {
  message: string;
  details?: unknown;
}

const DEFAULT_SUCCESS_STATUS = 200;
const DEFAULT_ERROR_STATUS = 500;

// Distinguish between success and failure outcomes.
export interface Ok<T> {
  readonly success: true;
  readonly status: number;
  readonly payload: T;
}

export interface Fail {
  readonly success: false;
  readonly status: number;
  readonly payload?: undefined;
  readonly error: ResultError;
}

export type Result<T> = Ok<T> | Fail;

// Discriminated union arguments for type safety
type OkParams<T> = {
  success: true;
  data: T;
  status?: number;
};

type FailParams = {
  success: false;
  error: string | ResultError | unknown;
  status?: number;
};

// Safely convert any value to ResultError
function toResultError(error: unknown): ResultError {
  let message: string;
  let details: unknown = error;

  if (error instanceof Error) {
    message = error.message;

    details = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Retain other attributes
      ...(error as any)
    };

    // Extract more detailed context, such as the stack.
    return { message, details: { name: error.name, stack: error.stack } };
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    // An object similar to Error, but not an instance of Error.
    message = (error as { message?: unknown }).message?.toString() ?? "Unknown error object";
  } else {
    message = "Unknown error";
  }

  return { message, details }; // Keep the original error as details for debugging.
}

// Single implementation with proper type narrowing
export function result<T>(params: OkParams<T>): Ok<T>;

export function result(params: FailParams): Fail;

export function result<T>(params: OkParams<T> | FailParams): Result<T> {
  const status = params.status ?? (params.success ? DEFAULT_SUCCESS_STATUS : DEFAULT_ERROR_STATUS);

  if (params.success) {
    return {
      success: true,
      status,
      payload: params.data // Direct assignment
    };
  } else {
    const error = toResultError(params.error);

    return {
      success: false,
      status,
      error // Properly constructed error
    };
  }
}

export const ok = <T>(data: T): Ok<T> => result({ success: true, data });

export const fail = (error: unknown, status?: number): Fail =>
  result({ success: false, error, status });
