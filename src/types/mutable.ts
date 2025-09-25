export type Mutable<T> = T extends readonly (infer U)[]
  ? U[]
  : T extends (infer V)[]
    ? V[]
    : T extends object
      ? { -readonly [K in keyof T]: Mutable<T[K]> }
      : T;
