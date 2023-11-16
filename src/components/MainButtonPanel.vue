<template>
  <q-toolbar style="padding-right: 0">
    <q-space />
    <q-btn
      unelevated=""
      icon="save"
      color=""
      size="md"
      :label="store.currentDocument?.id ? 'Save' : 'Create'"
      @click="onSave"
      class="q-mr-xs"
      v-if="commentable"
    />
    <q-btn
      unelevated=""
      icon="close"
      color=""
      size="md"
      label="Cancel"
      @click="reset"
    />
  </q-toolbar>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const props = defineProps({
  reset: {
    type: Function,
    required: true,
  },
  onSave: {
    required: true,
    type: Function,
  },
});
const commentable = computed(() => {
  return (
    store.currentDocument?.id &&
    (store.user?.claims?.admin ||
      store.user.uid === store.currentDocument.To ||
      (store.currentDocument.Status === "Created" &&
        store.user.uid === store.currentDocument.CreatedBy))
  );
});
</script>
