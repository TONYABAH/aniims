<template>
  <ViewContainer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <RaidForm ref="formRef" />
  </ViewContainer>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import RaidForm from "src/components/RaidForm.vue";
import ViewContainer from "./DefaultViewer.vue";

const updateFields = [];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}
provide("iconName", "hub");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Raids");
provide("searchFields", ["Title", "Address"]);
// watch(current, (c) => onPageChange(c))

onMounted(() => {});
</script>
