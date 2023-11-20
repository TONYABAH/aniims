<template>
  <q-dialog v-model="model" persistent>
    <q-card class="">
      <q-card-section class="row items-center bg-teal text-white">
        <q-icon name="map" />
        <span class="q-ml-sm">{{ location?.name || "Add new location" }}</span>
      </q-card-section>
      <q-card-section>
        <LocationForm
          :read-only="readOnly"
          :data="location"
          :setLocation="setLocation"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-if="!readOnly && location?.id"
          no-caps=""
          label="Delete"
          color="red"
          v-close-popup
          glossy=""
          unelevated=""
          @click="onDelete(location)"
        />
        <q-space />
        <q-btn
          v-if="!readOnly"
          no-caps=""
          label="Save"
          color="primary"
          v-close-popup
          glossy=""
          unelevated=""
          @click="onSubmit(location)"
        />
        <q-btn
          no-caps=""
          label="Cancel"
          color="red"
          v-close-popup
          glossy=""
          unelevated=""
          @click="model = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
//import { useDefaultStore } from "src/stores/store";
import { computed, ref, inject } from "vue";
import LocationForm from "./LocationForm.vue";
//const store = useDefaultStore();
const props = defineProps({
  popupModel: { type: Boolean, default: false },
  onChangeModel: Function,
  readOnly: Boolean,
  onSubmit: Function,
  onDelete: Function,
  data: Object,
  setLocation: Function,
});
const loc = ref(props.data);
const model = computed({
  get: () => props.popupModel,
  set: (v) => props.onChangeModel(v),
});
const location = computed({
  get: () => loc.value || {},
  set: (v) => (loc.value = v),
});
function setLocation(l) {
  location.value = l;
}
function onCancel() {
  location.value = {};
}
</script>
