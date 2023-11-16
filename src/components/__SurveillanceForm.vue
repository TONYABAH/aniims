<template>
  <q-form ref="form" class="q-gutter-xs" autofocus>
    <q-input
      v-model="surveillance.CaseId"
      type="text"
      label="Case ID"
      color=""
      name="caseId"
      dense
      :rules="[(val) => !!val || 'This field is required']"
    />
    <label>Surveillance Date</label>
    <q-input
      v-model="surveillance.Date"
      dense
      type="date"
      label=""
      :rules="[(val) => !!val || 'Date is required']"
      :lazy-rules="true"
      hide-bottom-space=""
    />
    <!-- <label for="name"><b>Location</b></label><LocationForm :data="location" :setLocation="setLocation" />-->
    <q-input
      v-model="surveillance.Address"
      type="text"
      label="Address"
      dense
      :rules="[(val) => !!val || 'This field is required']"
    />
    <q-input
      v-model="surveillance.City"
      type="text"
      label="City"
      dense
      :rules="[(val) => !!val || 'This field is required']"
    />
    <q-select
      v-model="surveillance.State"
      :options="states"
      options-dense=""
      label="State"
      dense
      :rules="[(val) => !!val || 'This field is required']"
    />
    <q-input
      v-model="surveillance.Title"
      type="Title"
      label="Description of offence"
      :rules="[(val) => !!val || 'Title is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      dense=""
    />
    <label>Details</label>
    <TextEditor
      :Text="surveillance.Details"
      :set-text="(v) => (surveillance.Details = v)"
      style="border: 4px solid orange"
    />
  </q-form>
</template>
<script setup>
import { ref, computed, watch } from "vue";
//import LocationForm from "./LocationForm.vue";
import { Dialog, Notify } from "quasar";
import TextEditor from "./TextEditor.vue";

const props = defineProps({
  data: Object,
  setData: Function,
});

const surveillance = computed({
  get: () => props.data,
  set: (v) => props.setData(v),
});

/*const location = ref({});
function setLocation(v) {
  locaction.value = v;
}
watch(
  location.value,
  (Location) =>
    (surveillance.value = Object.assign({}, surveillance.value, { Location }))
);*/
</script>
