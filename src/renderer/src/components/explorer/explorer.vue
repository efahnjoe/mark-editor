<template>
  <div class="w-full h-full">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-tree-v2
          class="w-full h-full"
          :data="data"
          :props="treeProps"
          :height="height"
          :width="width"
          highlight-current
        >
          <template #empty>
            <div class="flex flex-col">
              <p class="max-w-[80%]">You have not yet opened a folder</p>
              <el-button class="max-w-[80%]" @click="openFolder">Open Folder</el-button>
            </div>
          </template>

          <template #default="{ data: item }">
            <div class="w-full h-full" @click="linkTo(item)">
              <el-icon>
                <Document v-if="item.isFile" />
                <Folder v-else-if="item.isDir" />
                <FolderOpened v-else />
              </el-icon>
              <span>{{ item.label }}</span>
            </div>
          </template>
        </el-tree-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="ts" setup>
import { ElAutoResizer, ElTreeV2, ElButton, ElIcon } from "element-plus";
import { Document, Folder, FolderOpened } from "@element-plus/icons-vue";
import { Ref, ref } from "vue";
import { useExplorerStore } from "@renderer/stores/explorer";
import { debug } from "../../tools/index";
import { FsNode } from "@shared/types/fs";
import { useRouter } from "vue-router";

const router = useRouter();
const state = useExplorerStore();

interface Data {
  id: string;
  label: string;
  isFile: boolean;
  isDir: boolean;
  children?: Data[];
}

const treeProps = {
  value: "id",
  label: "label",
  isFile: "isFile",
  isDir: "isDir",
  children: "children"
};

const data: Ref<Data[]> = ref([]);
const filePaths: Ref<string[]> = ref([]);

// onMounted(async () => {
//   if (state.rootPath) {
//     data.value = await createData(state.rootPath);
//   }
// });

const openFolder = async (): Promise<void> => {
  try {
    const result = await window.api.fs.open.folder();

    if (result.success) {
      filePaths.value = result.payload.path;

      debug("openFolder: %o", result.payload.path);

      await watchFile(result.payload.path);

      data.value = await createData(result.payload.path);

      state.rootPath = result.payload.path;
    } else {
      debug("openFolder: %o", result.error);
    }
  } catch (error) {
    debug("openFolder error: %o", error);
  }
};

const watchFile = async (path: string | string[]): Promise<void> => {
  try {
    const result = await window.api.fs.watcher.create(path, 99);

    debug("watch result: %o", result);

    if (result.success) {
      state.watched = true;
      state.watcherId = result.payload.watchId;

      debug("watcher id: %s", result.payload.watchId);
      debug("watcher path: %o", result.payload.path);
    }
  } catch (error) {
    debug("watchFile error: %o", error);
    window.api.logger.error(error as string, "renderer:explorer:watchFile");
  }
};

const transformData = (old: FsNode): Data => {
  const tmp: Data = {
    id: old.path,
    label: old.name,
    isFile: old.isFile,
    isDir: old.isDir
  };

  if (old.children?.length) {
    tmp.children = old.children.map(transformData);
  }

  return tmp;
};

const createData = async (path: string[]): Promise<Data[]> => {
  try {
    let value: Data[] = [];
    const result = await window.api.fs.node(path, 99);

    if (result.success) {
      result.payload.tree.forEach((item) => {
        const tmp = transformData(item);

        value.push(tmp);
      });

      debug("createData: %o", value);

      // data.value = value;

      return value;
    } else {
      return Promise.reject(result.error);
    }
  } catch (error) {
    window.api.logger.error(error as string, "renderer:explorer:createData");
    return Promise.reject(error);
  }
};

const linkTo = (item: Data): void => {
  if (item.isFile) {
    router.push({
      name: "/file/",
      query: {
        path: item.id
      }
    });

    debug("linkTo: %o", item.id);
  }
};
</script>
