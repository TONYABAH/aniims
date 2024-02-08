<template>
  <AutoComplete
    :filter="fn"
    :min-chars="0"
    :model="model"
    :set-model="setModel"
    :options="states"
    :input-debounce="400"
    label="State"
  />
</template>
<script setup>
import AutoComplete from "src/components/AutoComplete.vue";
import { useStates } from "src/composables/use-fn";
import { watch } from "vue";

const props = defineProps({
  model: String,
  setModel: Function,
  country: {
    type: String,
    default: "Nigeria",
  },
});

var states = useStates(props.country);

const fn = (val) => {
  if (!val) return states;
  return states.filter(
    (s) =>
      s.toLowerCase().indexOf(val) === 0 ||
      s.toLowerCase().indexOf(" " + val) > 0
  );
};
watch(
  () => props.country,
  (val) => (states = useStates(val))
);
</script>
