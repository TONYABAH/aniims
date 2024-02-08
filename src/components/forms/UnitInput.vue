<template>
  <AutoComplete
    :model="model"
    :min-chars="0"
    :auto-select="true"
    :options="units"
    :set-model="setModel"
    :filter="filter"
    :input-debounce="400"
    icon="search"
    option-value="Abbrev"
    option-label="Name"
  />
</template>
<script setup>
import { watch } from "vue";
import AutoComplete from "src/components/AutoComplete.vue";
import { useUnits } from "src/composables/use-fn";

//const emits = defineEmits(["selected-staff"]);
const props = defineProps({
  model: {
    type: Object,
  },
  setModel: {
    type: Function,
    required: true,
  },
  searchOptions: {
    type: Object,
    default: () => {},
  },
});

var units = []; //useUnits(props.searchOptions);

function filter(needle) {
  const filtered = units.value.filter((s) => {
    return (
      s.Name.toLowerCase().indexOf(needle) === 0 ||
      s.Name.toLowerCase().indexOf(" " + needle) > 0 ||
      s.Abbrev.toLowerCase().indexOf(needle) === 0
    );
    // v.toLowerCase().indexOf(needle) > -1)
  });
  return filtered;
}
watch(
  () => props.searchOptions,
  (val) => (units = useUnits(val)),
  { immediate: true }
);
</script>
