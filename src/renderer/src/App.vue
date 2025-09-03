<template>
  <!-- <el-container class="h-screen w-screen">
    <el-header>
      <el-container>
        <el-aside class="w-1/4 h-full">
          <el-container class="w-4/3 h-full">
            <el-main>
              <Editor />
            </el-main>
            <el-footer></el-footer>
          </el-container>
        </el-aside>
      </el-container>
    </el-header>
  </el-container> -->

  <el-container class="h-screen w-screen">
    <el-main class="h-full w-full">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ElContainer, ElMain } from "element-plus";
import { RouterView } from "vue-router";
</script>
