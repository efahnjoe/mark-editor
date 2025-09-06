import { writeFile, readFile } from "node:fs/promises";
import { Result, ok, fail } from "@utils/result";

export const fileRead = async (path: string): Promise<Result<{ content: string }>> => {
  try {
    const content = await readFile(path, { encoding: "utf8" });

    return ok({ content });
  } catch (error) {
    return fail(error);
  }
};

export const fileWrite = async (
  path: string,
  content: string,
  signal?: AbortSignal
): Promise<
  Result<{
    message: string;
  }>
> => {
  try {
    await writeFile(path, content, { signal });

    return ok({
      message: `File written successfully: ${path}`
    });
  } catch (error) {
    return fail(error);
  }
};
