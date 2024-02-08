<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="selectedIPO"
    :list="store.ipos"
    icon-name="perm_identity"
    :reset="reset"
    :validate="validate"
  >
    <IpoForm ref="ipoFormRef" :setProfile="setModel" :profile="selectedIPO" />
  </AdminViewer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import IpoForm from "src/components/forms/IpoForm.vue";
import { useDefaultStore } from "src/stores/store";
import AdminViewer from "src/views/AdminViewer.vue";

const store = useDefaultStore();
const ipoFormRef = ref(null);
const selectedIPO = ref({});
const collection = "IPOS";

const searchFields = ["Name", "Rank", "Phone"];

function setModel(m) {
  selectedIPO.value = m;
}
function reset() {
  ipoFormRef.value.reset();
}
function validate() {
  return ipoFormRef.value.validate();
}
defineExpose({
  validate,
  reset,
});
</script>
