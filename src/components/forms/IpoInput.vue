<template>
  <AutoComplete
    :model="model"
    :min-chars="0"
    :auto-select="true"
    :options="ipoList"
    :set-model="setModel"
    :filter="filter"
    :input-debounce="400"
    icon="perm_identity"
    option-value="uid"
    option-label="Name"
  />
</template>
<script setup>
import { watch } from "vue";
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

var ipoList = [];
function filter(needle) {
  const filtered = ipoList?.value?.filter((s) => {
    return (
      needle.trim() === "" ||
      s.Name.toLowerCase().indexOf(needle) === 0 ||
      s.Name.toLowerCase().indexOf(" " + needle) > 0
    );
    // v.toLowerCase().indexOf(needle) > -1)
  });
  return filtered;
}

watch(
  () => props.searchOptions,
  (val) => (ipoList = useIpoList(val)),
  { immediate: true }
);
</script>
