<template>
  <ViewContainer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <MailForm ref="formRef" />
  </ViewContainer>
</template>

<script setup>
import { ref, onMounted, computed, provide } from "vue";
import MailForm from "src/components/MailForm.vue";
import ViewContainer from "./DefaultViewer.vue";

const updateFields = ["OutDate", "FileNumber", "_meta"];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  await formRef.value?.reset();
}

provide("iconName", "mail");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Mails");
provide("searchFields", ["Title", "Source", "Address"]);

onMounted(() => {
  // store.searchResults = null;
});
</script>
