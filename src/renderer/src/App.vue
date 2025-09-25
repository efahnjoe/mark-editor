<template>
  <el-container class="h-screen w-screen">
    <el-header class="border-bottom" height="33px">
      <Header />
    </el-header>
    <el-container>
      <el-container class="h-full">
        <el-aside class="h-full" width="64px">
          <Aside />
        </el-aside>
        <el-main>
          <Main />
        </el-main>
      </el-container>

      <el-footer height="33px"></el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer, ElHeader, ElAside, ElMain, ElFooter } from "element-plus";
import Header from "@components/header/header.vue";
import Aside from "@components/aside/aside.vue";
import Main from "@components/main/main.vue";
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid var(--el-border-color);
}
</style>
