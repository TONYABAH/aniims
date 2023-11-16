<template>
  <div class="row q-col-gutter-xs">
    <div
      class="col col-xs-12 col-sm-6 col-md-5 col-lg-5"
      :class="$q.dark.isActive ? 'bg-grey-grey-9' : 'bg-blue-grey-9'"
    >
      <q-card
        flat
        dark
        class="my-card"
        :class="$q.dark.isActive ? 'bg-blue-grey-9 q-ma-xs' : 'bg-blue-grey-9'"
      >
        <q-card-section>
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6 text-teal-2">{{
                  collection
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of list"
              :key="i"
              @click="_setModel(item)"
            >
              <q-item-section thumbnail="" top>
                <q-icon :name="iconName" class="q-ml-sm text-grey-2" />
              </q-item-section>
              <q-item-section
                >{{ item.Name || item.displayName || item.email }}
                {{ item.Location ? " | " + item.Location : "" }}</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col col-xs-12 col-sm-6 col-md-7 col-lg-7">
      <q-card
        flat
        class="my-card q-pa-xs q-ma-xs q-mb-xl"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-teal-7'"
      >
        <q-card-section class="text-white text-h6">
          {{
            selected?.Name ||
            selected?.displayName ||
            selected?.email ||
            collection
          }}
        </q-card-section>
        <q-card-section
          :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-yellow-1'"
        >
          <slot> </slot>
          <q-circular-progress
            indeterminate
            size="90px"
            :thickness="0.2"
            color="lime"
            center-color="grey-8"
            track-color="transparent"
            class="q-ma-md absolute"
            style="position: absolute; right: 144px; bottom: 0px"
            v-if="store.loading"
          />
        </q-card-section>
        <q-card-actions class="text-white">
          <q-space />

          <q-btn flat no-caps="" icon="close" @click="onReset" label="Reset" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
//import BaseForm from "src/components/BaseForm.vue";
//import UnitForm from "src/components/UnitForm.vue";
import { ref, computed, onBeforeMount, inject, provide } from "vue";
import * as remote from "../composables/remote.js";
import { Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
const store = useDefaultStore();
//const loading = inject("loading");
const tab = ref("search");
const _selected = computed({
  get: () => props.selected || {},
  set: (val) => props.setModel(val),
});

const props = defineProps({
  title: String,
  iconName: String,
  setModel: Function,
  collection: String,
  selected: Object,
  list: Array,
  searchFields: {
    type: Array,
    default: () => [],
  },
  reset: Function,
});

function _setModel(m) {
  _selected.value = m;
}
async function onSave() {
  if (!_selected.value.id) return onAdd();
  try {
    await remote.update(_selected.value.id, _selected.value, props.collection);
    Notify.create({
      timeout: 800,
      message: "Updated successfully",
      caption: "Update",
      color: "secondary",
      textColor: "white",
      icon: "check",
      position: "right",
    });
  } catch (e) {
    Notify.create({
      timeout: 2000,
      message:
        "There were errors. Admin previledge is needed for this operation.",
      caption: "Update",
      color: "negative",
      textColor: "white",
      icon: "error",
      position: "right",
    });
  }
}
async function onAdd() {
  if (_selected.value.id) return onSave();
  try {
    //_selected.value.role = "Staff";
    const result = await remote.create(
      _selected.value,
      props.collection,
      props.searchFields
    );
    _selected.value.id = result;
    _selected.value = {};
    Notify.create({
      timeout: 800,
      message: "Updated successfully",
      caption: "Update",
      color: "secondary",
      textColor: "white",
      icon: "check",
      position: "right",
    });
  } catch (e) {
    console.error(e);
    Notify.create({
      timeout: 2000,
      message: "There were errors: " + e.message,
      caption: "Update",
      color: "negative",
      textColor: "white",
      icon: "error",
      position: "right",
    });
  }
}
async function onReset() {
  _selected.value = {};
  props.reset();
  store.loading = false;
}

onBeforeMount(async () => {
  //const results = await remote.list(collection);
  //store.units = results;
  //console.log(store.units);
});
</script>
<style scoped>
.absolute {
  position: absolute;
}
</style>
