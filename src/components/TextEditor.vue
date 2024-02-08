<template>
  <q-editor square="" v-model="text" :toolbar="toolbar" :fonts="fonts" />
</template>
<script setup>
import { useQuasar } from "quasar";
import { ref, computed } from "vue";

const $q = useQuasar();

const fonts = {
  times_new_roman: "Times New Roman",
  courier_new: "Courier New",
  tahoma: "Tahoma",
  arial: "Arial",
};
const toolbar = [
  [
    {
      label: "", //$q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: "no-icons",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"].reverse(),
    },
    {
      label: "", //$q.lang.editor.fontSize,
      icon: $q.iconSet.editor.size,
      list: "no-icons",
      options: [
        "size-1",
        "size-2",
        "size-3",
        "size-4",
        "size-5",
        "size-6",
        "size-7",
      ],
    },
  ],
  ["bold", "italic", "underline", "ordered", "unordered", "removeFormat"],
  ["left", "center", "right", "justify"],
  ["undo", "redo"],
];
const props = defineProps({
  Text: {
    type: String,
    default: "",
  },
  setText: {
    type: Function,
    required: true,
  },
});
const text = computed({
  get: () => props.Text || "",
  set: (val) => props.setText(val),
});
</script>
