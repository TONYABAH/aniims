<template>
  <div class="row q-col-gutter-xs q-mb-xl q-pb-xl">
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
        <div class="q-pl-sm q-pt-md">
          <q-list dense>
            <q-item>
              <q-item-section avatar>
                <q-icon :name="iconName"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6 text-teal-2">{{
                  collection
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="search"
                  type="text"
                  color="white"
                  placeholder="Search..."
                  dark
                  dense
                  @update:model-value="handleSearch"
                  :debounce="400"
                  class="q-my-md"
                >
                  <q-btn
                    color="primary"
                    icon="search"
                    @click="handleSearch(search)"
                  />
                </q-input>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of list"
              :key="i"
              @click="_setModel(item)"
            >
              <q-item-section thumbnail="" class="q-pl-lg text-grey-2">
                {{ i + 1 }}.
              </q-item-section>
              <q-item-section
                >{{ item.Name || item.displayName || item.email }}
                {{ item.Location ? " | " + item.Location : "" }}</q-item-section
              >
            </q-item>
          </q-list>
        </div>
      </q-card>
    </div>
    <div class="col col-xs-12 col-sm-6 col-md-7 col-lg-7">
      <q-card
        flat
        class="my-card q-pa-xs q-ma-xs q-mb-xl"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-teal'"
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
        </q-card-section>
        <q-card-actions class="text-white">
          <q-space />
          <q-btn
            v-if="!_selected.id && onAdd"
            flat=""
            icon-right="arrow_right"
            label="Create"
            @click="onAdd"
          />
          <q-btn
            v-if="_selected.id || _selected.uid"
            flat
            icon="check"
            label="Save"
            @click="onSave"
          />
          <q-btn flat icon="close" label="Cancel" @click="onReset" />
          <q-circular-progress
            :thickness="0.2"
            indeterminate
            size="256px"
            color="lime"
            center-color="orange-9"
            track-color="orange-8"
            class="q-ma-md absolute"
            style="position: fixed; left: 144px; top: 20px; opacity: 0.8"
            v-if="store.loading"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, inject, provide } from "vue";
//import * as remote from "../composables/remote.js";
//import { Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
//import { createUser, addIPO, addCompany } from "src/composables/functions";
//import { addipo } from "app/altfunctions";

const store = useDefaultStore();
const search = ref("");

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
  reset: Function,
  handleSearch: Function,
  onAdd: Function,
  onSave: Function,
});

function _setModel(m) {
  _selected.value = m;
}

/*async function onSave() {
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
    const createFn = addipo;
    if (props.collection === "Units") {
      createFn = addUnit;
    } else if (props.collection === "Staff") {
      createFn = createUser;
    }
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
}*/
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
<style lang="scss" scoped>
.absolute {
  position: absolute;
}
</style>
