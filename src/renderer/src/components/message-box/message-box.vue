<template>
  <template v-if="props.show">
    <slot></slot>
  </template>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { PropType } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { MessageType } from "element-plus";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "Information"
  },
  message: {
    type: String,
    default: "message"
  },
  messageType: {
    type: String as PropType<MessageType>,
    default: "info"
  },
  completedMessage: {
    type: String,
    default: "completed"
  },
  canceledMessage: {
    type: String,
    default: "canceled"
  }
});

ElMessageBox.confirm(props.message, props.title, {
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  type: props.messageType
})
  .then(() => {
    ElMessage({
      type: "success",
      message: props.completedMessage
    });
  })
  .catch(() => {
    ElMessage({
      type: "info",
      message: props.canceledMessage
    });
  });
</script>
