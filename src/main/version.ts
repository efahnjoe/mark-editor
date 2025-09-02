import { app } from "electron";
import semver from "semver";
import { result } from "../utils/result";
import type { Result } from "../utils/result";

const version = app.getVersion();

const GITHUB_REPO = "efahnjoe/mark-editor";

if (!GITHUB_REPO) {
  console.warn("VITE_GITHUB_REPO not configured, update check will be skipped.");
}

export const getVersion = (): string => {
  return version;
};

export const checkUpdate = async (): Promise<Result> => {
  if (!GITHUB_REPO) {
    return result({
      success: false,
      code: 500,
      error: "GITHUB_REPO not configured, update check will be skipped."
    });
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
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const remoteTag = data.tag_name;

    const latestVersion = remoteTag.replace(/^v/, "");

    console.log("latestVersion:", latestVersion);

    const localVersion = getVersion().replace(/^v/, "");

    const hasUpdate = semver.gt(latestVersion, localVersion);

    return result({
      success: true,
      code: 200,
      data: {
        message: "Check update completed.",
        hasUpdate,
        latestVersion,
        currentVersion: localVersion,
        releaseUrl: data.html_url
      }
    });
  } catch (error) {
    console.error(error);

    return result({
      success: false,
      code: 500,
      error
    });
  }
};
