<template>
  <div class="row q-col-gutter-xs q-mb-xl q-pb-xl">
    <div class="col col-xs-12 col-sm-6 col-md-5 col-lg-5">
      <q-card
        flat
        dark
        class="my-card q-ma-xs q-pb-sm q-pr-sm bg-pink"
        :class="
          $q.dark.isActive ? 'bg-blue-grey-9 q-ma-xs' : store.theme.bg.normal
        "
        style="opacity: 0.8"
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
                    :loading="loading"
                    @click="handleSearch(search)"
                  >
                    <template v-slot:loading>
                      <q-spinner-hourglass class="on-left" />
                    </template>
                  </q-btn>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              dende
              active-class="bg-pink text-white"
              :active="item.id === selected?.id"
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
        class="my-card q-pa-xs q-mt-sm q-mr-md q-mb-xl"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-grey-'"
        style="opacity: 0.8"
      >
        <q-card-section class="text-h6">
          {{
            selected?.Name ||
            selected?.displayName ||
            selected?.email ||
            collection
          }}
        </q-card-section>
        <q-card-section :class="$q.dark.isActive ? 'bg-blue-grey-10' : ''">
          <slot> </slot>
        </q-card-section>
        <q-card-actions class="">
          <q-space />
          <loading-button
            v-if="_selected.id || _selected.uid"
            unelevated
            rounded
            color="pink"
            :submit="onSave"
            :loading="loading"
            icon-right="arrow_right"
            icon=""
            label="Save"
          />
          <loading-button
            v-if="!_selected.id && onAdd"
            unelevated
            rounded
            color="pink"
            :submit="onAdd"
            :loading="loading"
            icon-right="arrow_right"
            icon=""
            label="Create"
          />
          <q-btn flat icon="close" label="Cancel" @click="onReset" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, inject, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import LoadingButton from "src/components/LoadingButton.vue";
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
  loading: Boolean,
  onAdd: Function,
  onSave: Function,
});

function _setModel(m) {
  _selected.value = m;
}
async function onReset() {
  _selected.value = {};
  props.reset();
  //store.loading = false;
}
</script>
<style lang="scss" scoped>
.absolute {
  position: absolute;
}
</style>
