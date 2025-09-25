<template>
  <p>{{ version }}</p>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const version = ref("unknown");
const isUpdate = ref(false);

onMounted(async () => {
  try {
    const result = await window.api.getVersion();
    // version.value = result.payload.version ?? "unknown";

    if (result.success) {
      version.value = result.payload.version ?? "unknown";
    }

    const update = await window.api.checkUpdate();

    isUpdate.value = update.payload?.hasUpdate ?? false;
  } catch (error) {
    version.value = "unknown";
    console.error(error);
  }
});
</script>
