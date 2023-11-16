<template>
  <q-form ref="form" class="q-gutter-sm q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col col-xs-12">
        <q-input
          v-model="location.Name"
          type="text"
          label="Location Name"
          dense
          :readonly="readOnly"
        />
      </div>
      <div class="col col-xs-12">
        <q-input
          v-model="location.Address"
          type="text"
          label="Location Address"
          dense
          :readonly="readOnly"
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <div class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <q-select
          v-model="location.State"
          :options="states"
          options-dense=""
          label="Location State"
          dense
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <q-select
          v-model="location.City"
          :options="cities"
          options-dense=""
          label="Location City"
          dense
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <div class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <q-input
          v-model="location.Longitude"
          type="text"
          label="Longitude (GPS)"
          :readonly="readOnly"
          dense=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <q-input
          v-model="location.Latitude"
          type="text"
          label="Latitude (GPS)"
          :readonly="readOnly"
          dense
        />
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { useStates, useCities } from "src/composables/address-use";

const form = ref(null);
const props = defineProps({
  readOnly: Boolean,
  dense: {
    type: Boolean,
    default: true,
  },
  filled: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
  },
  setLocation: Function,
});
const states = useStates("Nigeria");
const cities = computed(() => useCities(location.value.State));
const location = computed({
  get: () => props.data || {},
  set: (v) => props.setLocation(v),
});
const validate = async () => await form.value?.validate(true);
function reset() {
  form.value?.resetValidation();
}
watch(
  () => location.value.State,
  (val) => {
    location.value.City = null;
  }
);
defineExpose({
  validate,
  reset,
});
</script>
