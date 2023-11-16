<template>
  <q-dialog
    v-model="fileViewerDialogModel"
    persistent
    ref="dialogRef"
    id="dialogRef"
    class="dialogRef"
    :seamless="true"
    :maximized="fullscreen"
    :full-height="fullscreen"
    :full-width="fullscreen"
    :position="fullscreen ? 'standard' : 'right'"
  >
    <q-card class="full-height q-pa-sm bg-grey-10">
      <q-toolbar class="bg-purple text-white">
        <q-btn flat round dense icon="visibility" />
        <q-toolbar-title>
          {{ docTitle }}
        </q-toolbar-title>
        <q-btn
          flat
          color="white"
          icon="open_in_new"
          size="md"
          @click="openInWindow"
          style=""
        />
        <q-btn
          flat
          color="white"
          icon="crop_square"
          size="md"
          @click="toggleFullscreen"
          style=""
        />
        <q-btn flat icon="close" color="white" v-close-popup style="" />
      </q-toolbar>
      <iframe
        :src="fileSource"
        style="width: 100%; height: calc(100% - 60px)"
      ></iframe>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const dialogRef = ref(null);
const fullscreen = ref(false);
const props = defineProps({
  fileSource: {
    type: String,
    required: true,
  },
  docTitle: {
    type: String,
    required: true,
  },
  model: {
    type: Boolean,
    default: false,
  },
  setModel: Function,
});
const fileViewerDialogModel = computed({
  get: () => props.model,
  set: (v) => props.setModel(v),
});
function toggleFullscreen() {
  fullscreen.value = !fullscreen.value;
}
function openInWindow() {
  const win = window.open(props.fileSource, "_blank");
}

onMounted(() => {
  window.addEventListener("DOMContentLoaded", () => {
    //makeDraggable(document.querySelector("dialogRef"));
  });
});
</script>
