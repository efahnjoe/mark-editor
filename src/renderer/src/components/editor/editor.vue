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

const props = defineProps({
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

// const editorOptions = {
//   hideModeSwitch: true
// };

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
      events: {
        change: () => {
          const value = toastEditor?.getMarkdown() || "";
          emit("update:value", value);
          editorValue.value = value;
        }
      }
    });
  }
};

const editorDestroy = (): void => {
  if (toastEditor) {
    toastEditor.destroy();
    toastEditor = null;
  }
};

const editorValueInit = async (): Promise<void> => {
  if (window.api && typeof window.api.readFile === "function") {
    try {
      if (props.path !== "") {
        const result = await window.api.readFile(props.path);

        if (result.success && result.data?.message != null) {
          editorValue.value = result.data.message;

          if (toastEditor) {
            toastEditor.setMarkdown(editorValue.value);
          }
        }
      } else {
        editorValue.value = "";
      }
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  } else {
    console.error("window.api is not exist");
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
  if (window.api && typeof window.api.writeFile === "function") {
    try {
      const result = await window.api.writeFile(props.path, content);
      if (result.success) {
        console.log("File saved successfully.");
      } else {
        console.error("File save failed:", result.error);
      }
    } catch (error) {
      console.error("Write failed:", error);
    }
  }
};

onMounted(() => {
  editorValueInit();
  editorInit();

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveToFile();
    }
  };
  window.addEventListener("keydown", handleKeydown);

  // Remove event listeners when the component is destroyed.
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});

defineExpose({
  getInstance: () => toastEditor
});

const emit = defineEmits(["update:value"]);
</script>
