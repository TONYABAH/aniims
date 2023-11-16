<template>
  <div>
    <div v-if="title">{{ title }}</div>
    <table style="width: 100%">
      <thead class="bg-" v-if="database?.length > 0">
        <th class="btn-col" v-if="!bottonsRight"></th>
        <th class="btn-col" v-if="!bottonsRight"></th>
        <th class="btn-col" v-if="!bottonsRight"></th>
        <th class="sn-col">SN</th>
        <th v-for="(col, j) of columns" :key="j">
          <span v-if="database?.length > 0">{{ col.label }}</span>
        </th>
      </thead>
      <tbody>
        <tr v-if="!database || database.length === 0">
          <td colspan="100">
            <span> <q-icon name="info"></q-icon> No data available </span>
          </td>
        </tr>
        <tr v-for="(row, i) of database" :key="i" @click="viewItem(row, i)">
          <td class="btn-col" v-if="!bottonsRight">
            <q-btn
              v-if="editable"
              flat
              icon="edit"
              @click.stop="editItem(row, i)"
              class="pointer-cursor"
            ></q-btn>
          </td>
          <td class="btn-col" v-if="!bottonsRight">
            <q-btn
              flat
              icon="visibility"
              @click.stop="viewItem(row, i)"
              class="pointer-cursor"
            ></q-btn>
          </td>
          <td class="btn-col" v-if="!bottonsRight">
            <q-btn
              v-if="deletable || editable"
              flat
              icon="delete"
              @click.stop="deleteItem(row, i)"
              class="pointer-cursor"
            ></q-btn>
          </td>
          <td class="sn-col">{{ i + 1 }}</td>
          <td v-for="(col, j) of columns" :key="j">
            {{ row[col.field] }}
          </td>
          <td class="btn-col" v-if="bottonsRight">
            <q-icon
              flat
              name="visibility"
              @click.stop="viewItem(row, i)"
              class="pointer-cursor"
            ></q-icon>
          </td>
          <td class="btn-col" v-if="bottonsRight && editable">
            <q-icon
              v-if="editable"
              flat
              name="edit"
              @click.stop="editItem(row, i)"
              class="pointer-cursor"
            ></q-icon>
          </td>
          <td class="btn-col" v-if="bottonsRight">
            <q-icon
              v-if="deletable || editable"
              flat
              name="delete"
              @click.stop="deleteItem(row, i)"
              class="pointer-cursor"
            ></q-icon>
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-">
        <tr>
          <td class="sn-col" colspan="100">
            <q-btn
              outline=""
              no-caps=""
              color=""
              icon="add"
              glossy=""
              size="sm"
              @click="addItem(null, 0)"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
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
  data: { type: Array, required: true },
  columns: Array,
  editable: {
    type: Boolean,
    default: false,
  },
  deletable: {
    type: Boolean,
    default: false,
  },
  hideHeader: { type: Boolean, default: false },
  hideBottom: { type: Boolean, default: true },
  bottonsRight: {
    type: Boolean,
    default: true,
  },
  //removeItem: { type: Function, required: true },
  //addItem: Function,
  //editItem: Function,
});
const database = computed(() => props.data);

function showItem(e, data) {
  target.value = e.target;
  selectedItem.value = data;
  emits("view-item", data);
}
function deleteItem(item, i) {
  // props.removeItem(item)
  emits("remove-item", item, i);
}
function addItem() {
  emits("add-item", {});
}
function editItem(item, i) {
  emits("edit-item", item, i);
}
function viewItem(item, i) {
  emits("view-item", item, i);
}
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  border: 1px solid grey;
}

th {
  text-align: left;
}

td,
th {
  vertical-align: top;
  padding: 4px;
  border-collapse: collapse;
  font-weight: 400;
}

tr {
  border-collapse: collapse;
  border: 1px solid grey;
  cursor: pointer;
}

tbody tr:hover {
  background-color: bisque;
  color: black;
}
tfoot {
  border-collapse: collapse;
}

.pointer-cursor {
  cursor: pointer;
}

.btn-col {
  width: 16px;
}

.sn-col {
  width: 16px;
  text-align: right;
}
</style>
