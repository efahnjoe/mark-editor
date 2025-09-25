<template>
  <div ref="editorRef"></div>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  defineEmits,
  defineExpose
} from "vue";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/editor";
import { debug } from "../../tools/index";

import type { PropType } from "vue";

interface EditorOptions {
  module: "editor";
  type: "markdown" | "wysiwyg";
  hideModeSwitch?: boolean;
}

const props = defineProps({
  options: {
    type: Object as PropType<EditorOptions>,
    default: () => ({})
  },
  height: {
    type: String,
    default: "500px"
  },
  initialEditType: {
    type: String,
    default: "wysiwyg"
  },
  previewStyle: {
    type: String,
    default: "vertical"
  },
  path: {
    type: String,
    default: ""
  }
});

const editorRef = ref<HTMLElement | null>(null);

let toastEditor: Editor | null = null;

const editorValue = ref("");

const editorInit = (): void => {
  if (editorRef.value) {
    toastEditor = new Editor({
      el: editorRef.value,
      height: props.height,
      initialEditType: props.initialEditType,
      previewStyle: props.previewStyle,
      initialValue: editorValue.value,
      autofocus: false, // Disable auto focus
      focus: false,
      scrollIntoView: false,
      events: {
        change: () => {
          const value = toastEditor?.getMarkdown() || "";
          emit("update:value", value);
          editorValue.value = value;
        }
      }
    });

    debug("Editor initialized");
  }
};

const editorDestroy = (): void => {
  if (toastEditor) {
    toastEditor.destroy();
    toastEditor = null;
  }
};

const editorValueInit = async (): Promise<void> => {
  try {
    if (props.path !== "") {
      const result = await window.api.readFile(props.path);

      if (result.success) {
        debug("Reading file: %s", props.path);

        editorValue.value = result.payload.content;

        if (toastEditor) {
          toastEditor.setMarkdown(editorValue.value);

          debug("Markdown set new value");
        }
      }
    } else {
      editorValue.value = "";
    }
  } catch (error) {
    window.api.logger.error(`Failed to read file: ${error}`, "Editor");
  }
};

watch(
  () => editorValue.value,
  (newVal) => {
    if (toastEditor && toastEditor.getMarkdown() !== newVal) {
      toastEditor.setMarkdown(newVal || "");
    }
  }
);

onBeforeUnmount(() => {
  editorDestroy();
});

const saveToFile = async (): Promise<void> => {
  if (!props.path) return;

  const content = toastEditor?.getMarkdown() || "";

  // Write back to the file
  try {
    const result = await window.api.writeFile(props.path, content);
    if (result.success) {
      window.api.logger.info(`File saved successfully: ${props.path}`, "Editor");
    } else {
      window.api.logger.error(`File save failed: ${props.path} ${result.error}`, "Editor");
    }
  } catch (error) {
    window.api.logger.error(`Write failed: ${error}`, "Editor");
  }
};

const handleKeydown = ref<(e: KeyboardEvent) => void>(() => {});

watch(
  () => props.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      await editorValueInit();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  editorInit();

  if (toastEditor && editorValue.value) {
    toastEditor.setMarkdown(editorValue.value);
  }

  handleKeydown.value = (e: KeyboardEvent): void => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveToFile();
    }
  };

  window.addEventListener("keydown", handleKeydown.value);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown.value);
});

defineExpose({
  getInstance: () => toastEditor
});

const emit = defineEmits(["update:value"]);
</script>
