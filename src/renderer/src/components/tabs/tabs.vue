<template>
  <el-tabs type="border-card">
    <el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.label">{{ tab.label }}</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
import { ElTabs, ElTabPane } from "element-plus";
import { useFileTabsStore } from "@renderer/stores/tabs";

const fileTabsStore = useFileTabsStore();

interface Data {
  id: string;
  label: string;

  // 0: file, 1: folder, -1: unknown
  type: 0 | 1 | -1;
}

const tabs: Data[] = fileTabsStore.tabs;
</script>
