import { app } from "electron";
import semver from "semver";
import { ok, fail } from "@utils/result";
import type { Ok, Result } from "@utils/result";

const version = app.getVersion();

const GITHUB_REPO = "efahnjoe/mark-editor";

if (!GITHUB_REPO) {
  console.warn("VITE_GITHUB_REPO not configured, update check will be skipped.");
}

export const getVersion = (): Ok<{
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
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Electron-App-Update-Checker" // GitHub 要求
      }
    });

    if (!res.ok) {
      return fail(`HTTP ${res.status}: ${res.statusText}`, res.status);
    }

    const data = await res.json();
    const remoteTag = data.tag_name;

    const latestVersion = remoteTag.replace(/^v/, "");

    const localVersion = getVersion().payload.version.replace(/^v/, "");

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
