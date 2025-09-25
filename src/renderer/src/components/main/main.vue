<template>
  <div class="h-full w-full">
    <splitpanes class="default-theme h-full w-full">
      <pane size="30" max-size="70">
        <Explorer v-if="store.explorer" />
        <div v-else>search</div>
      </pane>
      <pane size="70" min-size="30"><router-view /></pane>
    </splitpanes>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import { Splitpanes, Pane } from "splitpanes";
import { useMenuStore } from "@renderer/stores/menu";
import Explorer from "@components/explorer/explorer.vue";

const store = useMenuStore();
</script>
