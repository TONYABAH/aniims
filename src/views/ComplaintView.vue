<template>
  <ViewContainer
    :validateForm="validate"
    :resetForm="reset"
    :updateFields="updateFields"
  >
    <ComplaintForm ref="formRef" id="myForm" />
  </ViewContainer>
</template>

<script setup>
import ViewContainer from "src/views/DefaultViewer.vue";
import ComplaintForm from "src/components/ComplaintForm.vue";
import { onMounted, ref, provide } from "vue";
// const $q = useQuasar()
const complaint = ref({});
const dataTable = "complaints";
const readOnly = ref(false);
const complaintFormRef = ref(null);
const formRef = ref(null);
const columns = [
  {
    name: "Date",
    field: "date",
    label: "Date",
    align: "left",
  },
  {
    name: "Title",
    field: "title",
    label: "Title",
    align: "left",
  },
];

async function onComplaintLoaded(s) {
  complaint.value = s;
}
function setEditable(value) {
  readOnly.value = value !== undefined ? !value : false;
}
function onUpdateData(d) {
  complaint.value = d;
}

async function validate() {
  return await formRef.value?.validate();
}
async function reset() {
  await formRef.value?.reset();
}
// watch(current, (c) => onPageChange(c))

provide("iconName", "campaign");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Complaints");
provide("searchFields", ["Title", "Source", "Address"]);
onMounted(() => {});
</script>
