<template>
  <!--<ViewContainer :validateForm="validate" :resetForm="reset">
    <FileForm ref="formRef" />
  </ViewContainer>-->
  <FormCard>
    <FileForm ref="formRef" :rest="reset" :validateForm="validate" />
  </FormCard>
</template>

<script setup>
import { ref, onMounted, computed, provide } from "vue";
import FileForm from "src/components/FileForm.vue";
import FormCard from "src/components/FormCard.vue";
//const updateFields = ["FileNumber"];
const formRef = ref(null);

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  return await formRef.value?.reset();
}
provide("iconName", "folder");
provide("titleField", "Title");
provide("secondTitle", "CreatedAt");
provide("collection", "Files");
provide("searchFields", ["Title", "Name"]);
</script>
