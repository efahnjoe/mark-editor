import { defineStore } from "pinia";

export const useExplorerStore = defineStore("explorer", {
  state: () => ({
    rootPath: [] as string[],
    watched: false,
    watcherId: ""
  })
});
