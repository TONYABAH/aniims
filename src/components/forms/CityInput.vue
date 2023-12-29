<template>
  <AutoComplete
    :filter="fn"
    :min-chars="0"
    :model="model"
    :set-model="setModel"
    :options="cities"
    :input-debounce="400"
    option-label=""
    option-value=""
    label="City"
  />
</template>
<script setup>
import AutoComplete from "src/components/AutoComplete.vue";
import { useCities } from "src/composables/use-fn";
import { watch } from "vue";

const props = defineProps({
  model: String,
  setModel: Function,
  state: {
    type: String,
    required: true,
  },
});
var cities = useCities(props.state);

const fn = (val) => {
  if (!val) return cities;
  return cities.filter(
    (c) =>
      c.toLowerCase().indexOf(val) === 0 ||
      c.toLowerCase().indexOf(" " + val) > 0
  );
};
watch(
  () => props.state,
  (val) => {
    cities = useCities(val);
  }
);
</script>
