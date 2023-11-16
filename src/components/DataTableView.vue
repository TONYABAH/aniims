<template>
  <q-table
    dense
    square
    flat
    :hide-header="hideHeader"
    :hide-bottom="hideBottom"
    :title="title"
    :rows="dataRows"
    :columns="columns"
    :row-key="rowKey"
    @row-click="showItem"
    @row-contextmenu="showContextMenu"
  >
  </q-table>
  <q-btn
    v-if="!dataRows || dataRows.length === 0"
    unelevated=""
    color="primary"
    icon="add"
    label="Add new document"
    @click="addRow"
    class="full-width"
  >
  </q-btn>
  <q-menu
    v-if="editable"
    contextmenu=""
    v-model="contextMenuModel"
    :target="target"
    class="q-pa-md"
  >
    <q-list style="min-width: 100px">
      <q-item dense clickable v-close-popup class="q-pr-md">
        <q-item-section>Menu</q-item-section>
        <q-item-section thumbnail=""><q-icon name="close" /></q-item-section>
      </q-item>
      <q-separator />
      <q-item dense clickable v-close-popup @click="addRow">
        <q-item-section thumbnail=""><q-icon name="add" /></q-item-section>
        <q-item-section>Add item</q-item-section>
      </q-item>
      <q-item dense clickable v-close-popup @click="editRow">
        <q-item-section thumbnail=""><q-icon name="edit" /></q-item-section>
        <q-item-section>Edit item</q-item-section>
      </q-item>
      <q-item dense clickable v-close-popup @click="deleteRow">
        <q-item-section thumbnail=""><q-icon name="delete" /></q-item-section>
        <q-item-section>Delete item</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup>
import { computed, ref } from "vue";
const contextMenuModel = ref(false);
const target = ref();
const selectedItem = ref();
const emits = defineEmits([
  "remove-item",
  "add-item",
  "edit-item",
  "view-item",
]);
const props = defineProps({
  title: String,
  rowKey: {
    type: String,
    default: "title",
  },
  data: Array,
  columns: Array,
  editable: {
    type: Boolean,
    default: false,
  },
  hideHeader: { type: Boolean, default: false },
  hideBottom: { type: Boolean, default: true },
  bottonsRight: {
    type: Boolean,
    default: true,
  },
});
const dataRows = computed(() => props.data);
function showItem(e, data) {
  e.preventDefault();
  contextMenuModel.value = false;
  emits("view-item", data);
}
function addRow(e) {
  //console.log(selectedItem.value);
  emits("add-item");
}
function editRow(e) {
  //console.log(selectedItem.value);
  emits("edit-item", selectedItem.value);
}
function deleteRow(e) {
  //console.log(selectedItem.value);
  emits("delete-item", selectedItem.value);
}
function showContextMenu(e, d) {
  target.value = e.target;
  e.preventDefault();
  selectedItem.value = d;
  contextMenuModel.value = true;
}
</script>
