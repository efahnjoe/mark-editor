import { defineStore } from "pinia";

interface FileTabs {
  id: string;
  label: string;

  // 0: file, 1: folder, -1: unknown
  type: 0 | 1 | -1;
}

export const useFileTabsStore = defineStore("fileTabs", {
  state: () => ({
    tabs: [] as FileTabs[]
  })
});
