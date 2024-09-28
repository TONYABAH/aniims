<template>
  <search-auto
    label="IPO"
    :model="model"
    :min-chars="2"
    :auto-select="true"
    :options="store.ipos"
    :set-model="setModel"
    :filter="filter"
    :disable="readOnly"
    option-value="Phone"
    option-label="Name"
  />
</template>
<script setup>
import { ref, onMounted, computed, watch, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import SearchAuto from "./AutoComplete.vue";
const store = useDefaultStore();
//const assigned = ref(null);
const emits = defineEmits(["selected-ipo"]);
const props = defineProps({
  fieldLabel: {
    type: String,
    default: "IPO",
  },
  selected: {
    type: Function,
    required: true,
  },
  setModel: {
    type: Function,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
const model = computed({
  get: () => props.selected,
  set: (v) => setModel(v),
});

function filter(val) {
  const needle = val?.toLocaleLowerCase() || "";
  const filtered = store.ipos.filter((v) => {
    return (
      v.first?.toLocaleLowerCase().indexOf(needle) > -1 ||
      v.last?.toLocaleLowerCase().indexOf(needle) > -1 ||
      (v.phone?.toLocaleLowerCase().length > 5 &&
        v.phone?.toLocaleLowerCase().indexOf(needle) === 0)
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
