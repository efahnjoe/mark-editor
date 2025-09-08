import { writeFile as fsWriteFile, readFile as fsReadFile } from "node:fs/promises";
import { Result, ok, fail } from "@utils/result";

export const readFile = async (path: string): Promise<Result<{ content: string }>> => {
  try {
    const content = await fsReadFile(path, { encoding: "utf8" });

    return ok({ content });
  } catch (error) {
    return fail(error);
  }
};

export const writeFile = async (
  path: string,
  content: string,
  signal?: AbortSignal
): Promise<
  Result<{
    message: string;
  }>
> => {
  try {
    await fsWriteFile(path, content, { signal });

    return ok({
      message: `File written successfully: ${path}`
    });
  } catch (error) {
    return fail(error);
  }
};
