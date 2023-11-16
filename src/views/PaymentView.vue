<template>
  <ViewContainer :validateForm="validate" :resetForm="reset">
    <PaymentForm ref="formRef" />
  </ViewContainer>
</template>

<script setup>
import { ref, onMounted, computed, provide } from "vue";
import ViewContainer from "./DefaultViewer.vue";
import PaymentForm from "src/components/PaymentForm.vue";
//const updateFields = ["FileNumber"];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}

provide("iconName", "payment");
provide("titleField", "Title");
provide("secondTitle", "Location");
provide("collection", "Payments");
provide("searchFields", ["Title", "Location", "Reference"]);
</script>
