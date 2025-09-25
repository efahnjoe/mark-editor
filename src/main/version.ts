import { app } from "electron";
import semver from "semver";
import { ok, fail, logger } from "@utils/index";
import type { Result } from "@utils/result";

const version = app.getVersion();

const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;

if (!GITHUB_OWNER || !GITHUB_REPO) {
  logger.warn(
    "VITE_GITHUB_OWNER or VITE_GITHUB_REPO not configured, update check will be skipped.",
    "check:version"
  );
}

export const getVersion = (): Result<{
  version: string;
}> => {
  return ok({ version });
};

export const checkUpdate = async (): Promise<
  Result<{
    message: string;
    hasUpdate: boolean;
    latestVersion: string;
    currentVersion: string;
    releaseUrl: string;
  }>
> => {
  if (!GITHUB_REPO) {
    return fail("GITHUB_REPO not configured, update check will be skipped.");
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Mark-Editor"
      }
    });

    if (!res.ok) {
      return fail(res.statusText, res.status);
    }

    const data = await res.json();
    const remoteTag = data.tag_name;

    const latestVersion = remoteTag.replace(/^v/, "");

    const result = getVersion();
    let localVersion: string = "0.0.1";

    if (result.success) {
      localVersion = result.payload.version.replace(/^v/, "");
    }

    // const localVersion = getVersion().payload.version.replace(/^v/, "");

    const hasUpdate = semver.gt(latestVersion, localVersion);

    return ok({
      message: "Check update completed.",
      hasUpdate,
      latestVersion,
      currentVersion: localVersion,
      releaseUrl: data.html_url
    });
  } catch (error) {
    return fail(error);
  }
};
