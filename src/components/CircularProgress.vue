<template>
  <q-circular-progress
    indeterminate
    :size="size"
    :thickness="thickness"
    color="lime"
    center-color="grey-8"
    track-color="red"
    class="q-ma-md"
    style="position: absolute"
    :style="style"
    v-if="store.loading"
  />
</template>
<script setup>
import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useQuasar } from "quasar";
const store = useDefaultStore();
const $q = useQuasar();
const props = defineProps({
  size: {
    type: String,
    default: "190px",
  },
  thickness: {
    type: Number,
    default: 0.3,
  },
});
const style = computed(() => {
  return $q.screen.gt.xs ? "left:33%;top:33%" : "left:24px;top:30%";
});
</script>
