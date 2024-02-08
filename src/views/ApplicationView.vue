<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :searchFields="SEARCH_FIELDS"
    :commentable="true"
    collectionName="Applications"
  >
    <DestructionApplicationForm
      ref="form"
      :data="destruction"
      :setData="setDocument"
    />
  </FormCard>
</template>
<script setup>
//import { Notify, Dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { ref, provide, computed } from "vue";
import FormCard from "src/components/FormCard.vue";
import DestructionApplicationForm from "src/components/forms/DestructionApplicationForm.vue";
//import ApplicationView from "src/views/ApplicationView.vue";

const form = ref(null);
const updateFields = [];
const store = useDefaultStore();
const SEARCH_FIELDS = ["CoyName", "CoyAddress", "Title"];
const destruction = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const setDocument = (v) => (destruction.value = v);

function getDocument() {
  return destruction.value;
}
function reset() {
  form.value?.reset();
}
const validate = async () => await form.value?.validate();

provide("iconName", "delete");
provide("titleField", "Title");
provide("secondTitle", "Date");
//provide("collection", "Destructions");
provide("searchFields", ["CoyName", "CoyAddress"]);
defineExpose({
  reset,
  validate,
  destruction,
});
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
