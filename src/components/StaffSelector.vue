<template>
  <search-auto
    :label="fieldLabel"
    :model="model"
    :min-chars="2"
    :auto-select="true"
    :options="store.staffList"
    :set-model="setModel"
    :filter="filter"
    :disable="readOnly"
    option-value="Email"
    option-label="Name"
  />
</template>
<script setup>
import { ref, onMounted, computed, watch, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import SearchAuto from "./AutoComplete.vue";
const store = useDefaultStore();
//const assigned = ref();
const emits = defineEmits(["selected-staff"]);
const props = defineProps({
  fieldLabel: {
    type: String,
  },
  selected: {
    type: Object,
    default: () => {
      return null;
    },
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
  const needle = val.toLocaleLowerCase();
  const filtered = store.staffList.filter((s) => {
    return (
      s.First.toLocaleLowerCase().indexOf(needle) > -1 ||
      s.Last.toLocaleLowerCase().indexOf(needle) > -1 ||
      s.StaffId.toLocaleLowerCase() === needle ||
      (s.Phone?.toLocaleLowerCase().length > 5 &&
        s.Phone?.toLocaleLowerCase().indexOf(needle) === 0)
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
