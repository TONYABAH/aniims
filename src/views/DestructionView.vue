<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <DestructionApplication
      ref="form"
      :data="destruction"
      :setData="setDocument"
    />
  </FormCard>
</template>
<script setup>
//import { Notify, Dialog } from "quasar";
import { ref, provide } from "vue";
import FormCard from "src/components/FormCard.vue";
import DestructionApplication from "src/components/forms/DestructionForm.vue";

const form = ref(null);
const updateFields = [];
const destruction = ref({});

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
provide("collection", "Destructions");
provide("searchFields", ["CoyName", "CoyAddress"]);
defineExpose({
  reset,
  validate,
  destruction,
});
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
