<template>
  <ViewContainer :validateForm="validate" :resetForm="reset">
    <SampleForm ref="formRef" />
  </ViewContainer>
</template>

<script setup>
import { ref, onMounted, computed, provide } from "vue";
import ViewContainer from "./DefaultViewer.vue";
import SampleForm from "src/components/SampleForm.vue";
//const updateFields = ["FileNumber"];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}

provide("iconName", "sample");
provide("titleField", "Name");
provide("secondTitle", "Manufacturer");
provide("collection", "Samples");
provide("searchFields", ["Name", "Manufacturer", "Country"]);
</script>
