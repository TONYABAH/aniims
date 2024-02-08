<template>
  <AutoComplete
    :model="model"
    :min-chars="0"
    :auto-select="true"
    :options="staffList"
    :set-model="setModel"
    :filter="filter"
    :input-debounce="400"
    icon="search"
    option-value="uid"
    option-label="Name"
  />
</template>
<script setup>
import { watch } from "vue";
//import { useDefaultStore } from "src/stores/store";
import AutoComplete from "src/components/AutoComplete.vue";
import { useStaffList } from "src/composables/use-fn";

const emits = defineEmits(["selected-staff"]);
const props = defineProps({
  model: {
    type: Object,
  },
  setModel: {
    type: Function,
    required: true,
  },
  status: {
    type: String,
    default: null,
  },
  searchOptions: {
    //{unit, location, status, role}
    type: Object,
    default: () => {},
  },
});

var staffList = [];

function filter(needle) {
  const filtered = staffList?.value?.filter((s) => {
    return (
      s.Name.toLowerCase().indexOf(needle) === 0 ||
      s.Name.toLowerCase().indexOf(" " + needle) > 0
    );
    // v.toLowerCase().indexOf(needle) > -1)
  });
  return filtered;
}

watch(
  () => props.searchOptions,
  (val) => (staffList = useStaffList(val)),
  { immediate: true }
);
</script>
