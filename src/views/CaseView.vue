<template>
  <ViewContainer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <CaseDashboard />
    <CaseForm ref="formRef" id="myForm" />
  </ViewContainer>
</template>

<script setup>
import CaseDashboard from "src/components/CaseDashboard.vue";
import ViewContainer from "./DefaultViewer.vue";
import CaseForm from "src/components/CaseForm.vue";
import { onMounted, ref, provide } from "vue";

const updateFields = ["OutDate", "FileNumber"];

const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  await formRef.value?.reset();
}

provide("iconName", "cases");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Cases");
provide("searchFields", ["Title", "Location"]);

onMounted(() => {});
</script>
