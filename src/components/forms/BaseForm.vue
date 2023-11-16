<template>
  <q-card flat class="my-card" :class="bgColor" style="border: 1px solid #009699;">
    <!--<q-toolbar class="text-white" :class="bgColor">
      <q-btn flat round dense :icon="bannerIcon" />
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
      <slot name="button">
        <q-icon :name="bannerIconRight" color="yellow" />
      </slot>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>-->
    <q-card-section tag="div">
      <slot></slot>
    </q-card-section>
    <q-toolbar class="text-white" :class="bgColor">
      <q-btn
        v-if="deleteBtn && !readOnly"
        no-caps=""
        label="Delete"
        color="negative"
        icon="delete"
        @click="onDelete"
      />
      <q-space />
      <q-btn
        v-if="saveBtn && !readOnly"
        no-caps=""
        label="Save"
        color="purple"
        icon="save"
        class="q-ml-xs"
        @click="onSave"
      />
      <q-btn
        v-if="addBtn && !readOnly"
        no-caps=""
        label="Add"
        color="purple"
        icon="add"
        class="q-ml-xs"
        @click="onAdd"
      />
      <q-btn
        v-if="resetBtn"
        no-caps=""
        label="Clear"
        color="orange"
        icon="clear"
        class="q-ml-xs"
        @click="onReset"
      />
    </q-toolbar>
  </q-card>
</template>

<script setup>
//import { emit } from 'process';
import { computed } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const emit = defineEmits(["save", "add", "reset"]);
const props = defineProps({
  bannerIcon: String,
  bannerIconRight: {
    type: String,
    default: "",
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  title: String,
  saveBtn: { type: Boolean, default: true },
  addBtn: { type: Boolean, default: true },
  resetBtn: { type: Boolean, default: true },
  deleteBtn: { type: Boolean, default: false },

  //searchBtn: { type: Boolean, default: false },
  //disableSearch: { type: Boolean, default: true }
  //onReset: Function,
  //onAdd: Function,
  //onSave: Function
});
const bgColor = computed(() => {
  return $q.dark.isActive ? "bg-grey-10" : "bg-blue-1 text-grey-10";
});
function onAdd(e) {
  emit("add", e);
}
function onSave(e) {
  emit("save", e);
}
function onDelete(e) {
  emit("delete", e);
}
function onReset(e) {
  emit("reset", e);
}
</script>
