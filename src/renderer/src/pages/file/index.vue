<template>
  <div class="h-full w-full">
    <Editor :path="path" height="100%" />
  </div>
</template>

<script lang="ts" setup>
import Editor from "@components/editor/editor.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { debug } from "../../tools/index";

const route = useRoute();

const path = computed<string>(() => {
  const raw = route.query.path;

  debug("path", raw);

  return typeof raw === "string" ? raw : "";
});
</script>
