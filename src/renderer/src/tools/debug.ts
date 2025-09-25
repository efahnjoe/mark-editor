export function debug(...args: unknown[]): void {
  if (import.meta.env.DEV || import.meta.env.MODE === "development") {
    console.debug(...args);
  }
}
