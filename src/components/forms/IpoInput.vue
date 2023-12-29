<template>
  <AutoComplete
    :model="model"
    :min-chars="0"
    :auto-select="true"
    :options="ipoList"
    :set-model="setModel"
    :filter="filter"
    :input-debounce="400"
    placeholder="Enter name"
    icon="search"
    option-value="uid"
    option-label="Name"
  />
</template>
<script setup>
import { ref, onMounted } from "vue";
import AutoComplete from "src/components/AutoComplete.vue";
import { useIpoList } from "src/composables/use-fn";

//const emits = defineEmits(["selected-staff"]);
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
    type: Object,
    default: () => {},
  },
});

const ipoList = useIpoList(props.status, props.searchOptions);

function filter(needle) {
  const filtered = ipoList.value.filter((s) => {
    return (
      s.Name.toLowerCase().indexOf(needle) === 0 ||
      s.Name.toLowerCase().indexOf(" " + needle) > 0
    );
    // v.toLowerCase().indexOf(needle) > -1)
  });
  return filtered;
}
onMounted(() => {
  //selectStaff(officer.value || {});
  //console.log(officer.value);
});
</script>
