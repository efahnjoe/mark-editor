<template>
  <div class="flex content-between row-auto items-center w-full h-full">
    <menu class="flex list-none w-full">
      <li v-for="tab in tabs" :key="tab.id">
        <el-button text>{{ tab.name }}</el-button>
      </li>
    </menu>

    <menu class="flex list-none w-full">
      <li>
        <el-button text size="small">
          <el-icon><Back /></el-icon>
        </el-button>
      </li>
      <li>
        <el-button text size="small">
          <el-icon><Right /></el-icon>
        </el-button>
      </li>
      <li>
        <el-input
          size="small"
          :prefix-icon="Search"
          placeholder="Search"
          class="min-w-min max-w-max"
        ></el-input>
      </li>
    </menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElButton, ElInput, ElIcon } from "element-plus";
import { Back, Right, Search } from "@element-plus/icons-vue";

const tabs = ref([
  {
    id: "1",
    name: "File"
  },
  {
    id: "2",
    name: "Edit"
  }
]);
</script>
