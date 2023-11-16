<template>
  <AdminViewer
    :set-model="setProfile"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="selectedStaff"
    :list="store.staffList"
    icon-name="perm_identity"
    :reset="reset"
    :validate="validate"
  >
    <StaffForm
      ref="staffFormRef"
      :searchBtn="true"
      :profile="selectedStaff"
      :set-profile="setProfile"
    />
  </AdminViewer>
</template>

<script setup>
import { ref } from "vue";
import StaffForm from "src/components/forms/StaffForm.vue";
import { useDefaultStore } from "src/stores/store";
import AdminViewer from "./AdminViewer.vue";

const store = useDefaultStore();
const staffFormRef = ref(null);
const selectedStaff = ref({});
const collection = "Staff";
const searchFields = ["Name", "Rank", "Phone"];

function setProfile(s) {
  selectedStaff.value = s;
}
function reset() {
  staffFormRef.value.reset();
}
function validate() {
  return staffFormRef.value.validate(true);
}
defineExpose({
  reset,
  validate,
});
</script>
