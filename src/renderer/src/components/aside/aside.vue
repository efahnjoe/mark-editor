<template>
  <el-menu :default-active="activeIndex" collapse class="h-full">
    <el-menu-item
      index="/explorer"
      @click="
        () => {
          store.explorer = true;
          store.search = false;
        }
      "
    >
      <el-icon><CopyDocument /></el-icon>
      <template #title>Explorer</template>
    </el-menu-item>
    <el-menu-item
      index="/search"
      @click="
        () => {
          store.explorer = false;
          store.search = true;
        }
      "
    >
      <el-icon><Search /></el-icon>
      <template #title>Search</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ElMenu, ElMenuItem, ElIcon } from "element-plus";
import { CopyDocument, Search } from "@element-plus/icons-vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@renderer/stores/menu";

const route = useRoute();
const store = useMenuStore();

const activeIndex = computed(() => route.fullPath);
</script>
