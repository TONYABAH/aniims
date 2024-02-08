<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="selectedUnit"
    :list="store.units"
    icon-name="room"
    :reset="reset"
    :validate="validate"
  >
    <UnitForm
      ref="unitFormRef"
      :set-model="setModel"
      :selected="selectedUnit"
    />
  </AdminViewer>
</template>

<script setup>
import { ref } from "vue";
import UnitForm from "src/components/forms/UnitForm.vue";
import { useDefaultStore } from "src/stores/store";
import AdminViewer from "src/views/AdminViewer.vue";

const store = useDefaultStore();
const unitFormRef = ref(null);
const selectedUnit = ref({});
const collection = "Units";
const searchFields = ["Name", "Abbrev", "Location"];

function reset() {
  unitFormRef.value.reset();
}
function validate() {
  return unitFormRef.value.validate(true);
}
function setModel(m) {
  selectedUnit.value = m;
  // console.log(m);
}
defineExpose({
  reset,
  validate,
});
</script>
<style scoped>
.my-card {
}
</style>
