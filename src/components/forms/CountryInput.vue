<template>
  <AutoComplete
    :filter="fn"
    :min-chars="2"
    :model="model"
    :set-model="setModel"
    :options="countries"
    :input-debounce="400"
    option-label="name"
    option-value="code"
    label="Nationality"
  />
</template>
<script setup>
import AutoComplete from "src/components/AutoComplete.vue";
import { useCountries } from "src/composables/use-fn";

const countries = useCountries();
const props = defineProps({
  model: String,
  setModel: Function,
});

const fn = (val) => {
  if (!val) return countries;
  return countries.filter(
    (c) =>
      c.toLowerCase().indexOf(val) === 0 ||
      c.toLowerCase().indexOf(" " + val) > 0
  );
};
</script>
