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
    label="LGA"
  />
</template>
<script setup>
import AutoComplete from "src/components/AutoComplete.vue";
import { useLgas } from "src/composables/use-fn";
import { watch } from "vue";
const props = defineProps({
  model: String,
  setModel: Function,
  state: {
    type: String,
    required: true,
  },
});
var cities = useLgas(props.state);

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
  (val) => (cities = useLgas(val))
);
</script>
