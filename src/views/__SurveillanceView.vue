<template>
  <DefaultViewer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <SurcveillanceForm ref="formRef" />
  </DefaultViewer>
</template>

<script setup>
import SurcveillanceForm from "src/components/SurveillanceForm.vue";
import DefaultViewer from "./DefaultViewer.vue";
import { onMounted, ref, provide } from "vue";

const updateFields = [];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}
provide("iconName", "hearing");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Surveillances");
provide("searchFields", ["Title", "Address"]);

// watch(current, (c) => onPageChange(c))

onMounted(() => {});
</script>
