<template>
  <q-card
    flat
    class="search-card"
    style="border: 0px solid; border-radius: 0px 0px; max-width: 400px"
  >
    <q-toolbar>
      <q-toolbar-title>
        <q-input
          v-if="!expandModel"
          dense
          rounded
          outlined
          type="search"
          placeholder="Enter search term"
          clear-icon="close"
          clearable=""
          input-class="text-bold"
          bg-color=""
          color="cyan"
          style="font-size: 16px"
          v-model="searchText"
        >
          <template v-slot:prepend> </template>
          <template v-slot:append>
            <q-btn
              glossy
              unelevated=""
              no-caps=""
              color="secondary"
              label=""
              icon="search"
              v-close-popup
              class="right"
              @click.stop="searchNow()"
              style="border-radius: 0 2px 2px 0"
            />
          </template>
        </q-input>
        <label class="text-teal" v-else>Advanced search</label>
      </q-toolbar-title>
      <q-btn
        dense
        flat
        color="teal"
        icon="chevron_right"
        @click="expandModel = !expandModel"
        :style="expandIconRotation"
        rounded=""
      />
    </q-toolbar>
    <q-slide-transition>
      <q-form class="q-px-sm q-py-sm q-gutter-xs" v-if="expandModel">
        <q-input dense filled outlined="" v-model="search.date1" type="date" />
        <q-input dense filled outlined="" v-model="search.date2" type="date" />
        <div v-if="store.user.role === 'Director' || store.user.claims.admin">
          <q-select
            v-model="search.location"
            :options="store.locations"
            options-dense=""
            label="Location"
            dense
            filled
            outlined=""
            clearable=""
            clear-icon="close"
          />
        </div>
        <q-select
          v-model="search.unit"
          :options="units"
          label="Unit in charge"
          dense
          filled
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
        />
        <q-select
          v-model="search.staff"
          :options="staffList"
          label="Staff in charge"
          dense
          filled
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
          option-value="StaffId"
          option-label="Name"
        />

        <div class="q-px-xs q-pt-xs">
          <q-input
            v-model="searchText"
            type="search"
            placeholder="Enter search term"
            dense
            clear-icon="close"
            clearable=""
            color="blue"
            :autofocus="true"
            style="font-size: 14px"
            rounded
            outlined=""
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn
                no-caps=""
                glossy=""
                color="teal"
                label="Search"
                v-close-popup
                class="right"
                @click.stop="searchNow()"
                style="border-radius: 0 4px 4px 0"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-slide-transition>
  </q-card>
</template>
<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  computed,
  inject,
} from "vue";
import { useDefaultStore } from "src/stores/store";
//import StaffSelector from "./StaffSelector.vue";

const store = useDefaultStore();
const expandModel = ref(false);
const searchText = ref("");
const search = reactive({});
const onSearch = inject("on-search");

const units = computed(() => {
  if (store.user.role !== "Director" && !store.user.claims?.admin) {
    return store.user.claims.units;
  }
  return search.location
    ? store.units
        .filter((u) => u.Location === search.location)
        .map((u) => u.Abbrev)
    : store.units.map((u) => u.Abbrev);
});
const staffList = computed(() => {
  if (
    store.user.claims.role !== "Head" &&
    store.user.claims.role !== "Director" &&
    !store.user.claims.admin
  ) {
    return store.staffList.filter((s) => s.uid === store.user.uid);
  }
  return search.unit
    ? store.staffList.filter((s) => s.Units.includes(search.unit))
    : store.staffList;
});
const props = defineProps({
  isDark: Boolean,
});
const expandIconRotation = computed(
  () =>
    `transform: rotate(${
      expandModel.value ? "-90deg" : "90deg"
    });cursor:pointer;`
);
function searchNow() {
  expandModel.value = false;
  const filters = compose();
  console.log({ filters });
  onSearch(searchText.value, filters);
}

function compose() {
  const searchFilters = [];
  if (search.location) {
    searchFilters.push(["Location", "==", search.location]);
  }
  if (search.unit && !search.staff) {
    searchFilters.push(["Unit", "==", search.unit]);
  }
  /*if (search.assigned) {
    searchFilters.push(["Assigned", "==", search.assigned]);
  }*/
  if (
    search.staff ||
    (store.user.claims?.role !== "Director" && !store.user.claims?.admin)
  ) {
    searchFilters.push([
      "CreatedBy",
      "==",
      search.staff?.uid || store.user.uid,
    ]);
  }
  if (search.date1) {
    //console.log(Date.parse(search.date1));
    searchFilters.push([
      "CreatedAt",
      ">=",
      Date.parse(new Date(search.date1).toDateString()),
    ]);
  }
  if (search.date2) {
    searchFilters.push(["CreatedAt", "<=", Date.parse(search.date2)]);
  }
  //console.log(searchFilters);
  return searchFilters;
}
</script>
<style scoped>
.maron-bg {
  background: linear-gradient(#827, #827);
}
</style>
