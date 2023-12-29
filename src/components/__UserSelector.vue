<template>
  <AutoComplete
    label="User"
    :model="assigned"
    :min-chars="2"
    :auto-select="true"
    :options="store.users"
    :set-model="setModel"
    :filter="filter"
  />
</template>
<script setup>
import { ref, onMounted, computed, watch, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import AutoComplete from "./AutoComplete.vue";
import { useStaffList } from "src/composables/use-fn";

const store = useDefaultStore();
const assigned = ref(null);
const emits = defineEmits(["selected-user"]);
const props = defineProps({
  fieldLabel: {
    type: String,
    default: "User",
  },
  selectedOfficer: Object,
});
// const officer = computed(() => props.selectedOfficer || {});
function setModel(model) {
  assigned.value = model;
  emits("selected-user", model);
}
function filter(val) {
  const needle = val.toLocaleLowerCase();
  const filtered = store.ipos.filter((v) => {
    return (
      v.email.toLocaleLowerCase().indexOf(needle) > -1 ||
      (v.displayName &&
        v.displayName.toLocaleLowerCase().indexOf(needle) > -1) ||
      (v.phone && v.phone.toLocaleLowerCase().indexOf(needle) === 0)
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
