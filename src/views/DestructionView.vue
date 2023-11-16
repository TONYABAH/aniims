<template>
  <ViewContainer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <DestructionForm ref="formRef" />
  </ViewContainer>
</template>

<script setup>
import { ref, provide } from "vue";
// import FileForm from "src/components/FileForm.vue";
import ViewContainer from "./DefaultViewer.vue";
import DestructionForm from "src/components/DestructionForm.vue";

const updateFields = [];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}
provide("iconName", "delete");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Destructions");
provide("searchFields", ["CoyName", "CoyAddress"]);
// watch(current, (c) => onPageChange(c))
</script>
