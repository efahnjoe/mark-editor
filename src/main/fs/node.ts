import { ok, fail } from "@utils/index";
import klaw from "klaw";
import { join, basename, relative } from "node:path";

import type { Result } from "@utils/index";
import type { FsNode } from "@shared/types/index";

const create = async (root: string, maxDepth: number = 1): Promise<Result<{ tree: FsNode }>> => {
  const tree: FsNode = {
    name: basename(root),
    path: root,
    isFile: false,
    isDir: false,
    children: []
  };

  const parentMap = new Map<string, FsNode>();
  parentMap.set(root, tree);

  for await (const item of klaw(root, { depthLimit: maxDepth })) {
    if (item.path === root) continue;

    const relPath = relative(root, item.path);
    const parts = relPath.split(/[\\/]/);
    const depth = parts.length;

    if (depth > maxDepth) continue;

    let currentParent = tree;
    for (let i = 0; i < depth - 1; i++) {
      const part = parts[i];
      const childPath = join(root, ...parts.slice(0, i + 1));
      let child = currentParent.children?.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: childPath,
          isFile: false,
          isDir: false,
          children: []
        };
        (currentParent.children ??= []).push(child);
        parentMap.set(childPath, child);
      }
      currentParent = child;
    }

    const name = parts[parts.length - 1];
    const node: FsNode = {
      name,
      path: item.path,
      isFile: item.stats.isFile(),
      isDir: item.stats.isDirectory()
    };

    (currentParent.children ??= []).push(node);
    if (node.isDir) {
      parentMap.set(item.path, node);
    }
  }

  const sortedTree = sortFsNode(tree);

  const cleanedTree = cleanFsNode(sortedTree);

  return ok({ tree: cleanedTree });
};

const cleanFsNode = (node: FsNode): FsNode => {
  return {
    name: node.name,
    path: node.path,
    isFile: node.isFile,
    isDir: node.isDir,
    ...(node.children && node.children.length > 0
      ? { children: node.children.map(cleanFsNode) }
      : {})
  };
};

const sortFsNode = (node: FsNode): FsNode => {
  if (node.children && node.children.length > 0) {
    const sortedChildren = node.children.map(sortFsNode).sort((a, b) => {
      // Folder priority
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;

      return a.name.localeCompare(b.name, undefined, {
        numeric: true, // file2 < file10
        sensitivity: "base" // Ignore case: A == a
      });
    });

    return {
      ...node,
      children: sortedChildren
    };
  }

  return node;
};

export const fsNode = async (
  root: string | string[],
  maxDepth: number = 1
): Promise<Result<{ tree: FsNode[] }>> => {
  if (Array.isArray(root)) {
    const results = await Promise.all(root.map((r) => create(r, maxDepth)));

    if (results.some((r) => !r.success)) {
      const errors = results
        .filter((r) => !r.success)
        .map((r) => r.error)
        .filter(Boolean);
      return fail({ error: errors.length > 0 ? errors : "Failed to create tree" });
    }

    const successfulResults = results.filter(
      (r): r is Extract<Result<{ tree: FsNode }>, { success: true }> => r.success
    );

    const trees = successfulResults.map((r) => sortFsNode(r.payload.tree));

    return ok({
      tree: trees.map(cleanFsNode)
    });
  } else {
    const result = await create(root, maxDepth);

    if (!result.success) {
      return fail({ error: result.error });
    }

    const sortedTree = sortFsNode(result.payload.tree);

    return ok({ tree: [cleanFsNode(sortedTree)] });
  }
};
