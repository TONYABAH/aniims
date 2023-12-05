<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <ComplaintApplication ref="form" :data="complaint" :setData="setDocument" />
  </FormCard>
</template>

<script setup>
import { onMounted, ref, watch, provide } from "vue";
import FormCard from "src/components/FormCard.vue";
import ComplaintApplication from "src/components/forms/ComplaintForm.vue";

/*const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  setEditable: Function,
  selectedComplaint: Object,
  setSelectedComplaint: Function,
});*/

const form = ref(null);
const location = ref({});
const updateFields = [];
const complaint = ref({});
const update_caseNumber = ref(false);

const setDocument = (v) => {
  complaint.value = v;
};

function getDocument() {
  return complaint.value;
}
function reset() {
  form.value?.reset();
}
const validate = async () => await form.value?.validate();
watch(
  () => complaint.value.CaseNumber,
  (newValue) => {
    //console.log(newValue);
    update_caseNumber.value = newValue ? true : false;
  }
);

const tableColumns = [
  {
    name: "Address",
    label: "Address",
    field: "Address",
    title: "Address",
    align: "left",
  },
];
provide("iconName", "campaign");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Complaints");
provide("searchFields", ["Title", "Source", "Address"]);

defineExpose({
  reset,
  validate,
  complaint,
});

onMounted(async () => {
  if (!complaint.value.Locations) {
    complaint.value.Locations = [];
  }
  provide("location", location);
  provide("locations", complaint.value.Locations);
});

// defineExpose({ reset, save, add })
</script>
