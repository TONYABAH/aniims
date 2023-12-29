<template>
  <q-form class="q-px-md">
    <label>Date</label>
    <q-input dense v-model="store.search.date1" type="date" />
    <!--<label>End date</label>
    <q-input dense v-model="store.search.date2" type="date" />-->
    <q-select
      v-model="store.search.location"
      :options="store.locations"
      options-dense=""
      label="Location"
      dense
      clearable=""
      clear-icon="close"
    />

    <q-select
      v-model="store.search.unit"
      :options="store.units"
      label="Unit in charge"
      dense
      options-dense=""
      clearable=""
      clear-icon="close"
      option-value="Name"
      option-label="Name"
    />
    <StaffSelector label="Officer" option-value="StaffId" option-label="Last" />
    <q-radio v-model="store.search.assigned" :val="true" label="Assigned" />
    <q-radio
      v-model="store.search.assigned"
      :val="false"
      label="Not assigned"
    />
  </q-form>
</template>

<script setup>
import { ref, watch, onMounted, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
//import SearchAuto from "./SearchAuto.vue";
import StaffSelector from "./StaffSelector.vue";
const store = useDefaultStore();
const selectedUnit = ref();
const unit = ref("DO");
//const assigned = ref(false);
const staffList = ref(store.staffList);
const searchFilters = inject("whereFilters");

function clear() {
  store.search.value = {};
}
function composeQuery() {
  searchFilters.value = [];
  if (store.search.date1) {
    searchFilters.value.push(["date", "==", `${store.search.date1}`]);
  }
  if (store.search.date2) {
    searchFilters.value.push(["date", "<=", `${store.search.date2}`]);
  }
  if (store.search.location) {
    searchFilters.value.push(["location", "==", `${store.search.location}`]);
  }
  if (store.search.unit) {
    searchFilters.value.push(["unit", "==", `${store.search.unit}`]);
  }
  if (store.search.assigned) {
    searchFilters.value.push(["assigned", "==", `${store.search.assigned}`]);
  }
  if (store.search.assignedTo) {
    searchFilters.value.push([
      "assignedTo",
      "==",
      `${store.search.assignedTo}`,
    ]);
  }
  // store.searchFilters = searchFilters
  //return searchFilters.join(" && ");
}
function compose() {
  store.searchFilters = [];
  if (store.search.location) {
    store.searchFilters.push(["location", store.search.location]);
  }
  if (store.search.unit) {
    store.searchFilters.push(["unit", store.search.unit]);
  }
  if (store.search.assigned) {
    store.searchFilters.push(["assigned", store.search.assigned]);
  }
  if (store.search.assignedTo) {
    store.searchFilters.push(["assignedTo", store.search.assignedTo]);
  }
  if (store.search.date1) {
    store.searchFilters.push(["date1", store.search.date1]);
  }
  if (store.search.date2) {
    store.searchFilters.push(["date2", store.search.date2]);
  }
}

watch(store.search, (obj) => {
  //console.log(obj);
  compose();
});
defineExpose({
  // store.search,
});
</script>
