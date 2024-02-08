<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :hide-tabs="true"
    :commentable="true"
    :search-fields="SEARCH_FIELDS"
    collectionName="Samples"
  >
    <SampleForm ref="form" :model="sample" :setModel="setDocument" />
  </FormCard>
</template>

<script setup>
import { ref, provide, onMounted, computed } from "vue";
import FormCard from "src/components/FormCard.vue";
import SampleForm from "src/components/forms/SampleForm.vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const form = ref(null);
const updateFields = [];
const SEARCH_FIELDS = ["Name", "CaseNumber", "Manufacturer"];

const sample = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const setDocument = (v) => (sample.value = v || {});

function getDocument() {
  return sample.value;
}
function reset() {
  form.value?.reset();
}
const validate = async () => {
  return await form.value.validate();
};
/*function updateReport() {
  store.loading = true;
  update(Sample.value.id, { ReportDate: Sample.value.ReportDate }, "Samples")
    .then((d) => {
      const dl = dialog.create({
        title: "Success",
        message: "Update succeeded",
        ok: {
          color: "teal",
        },
      });
      setTimeout(() => {
        dl.hide();
      }, 1000);
    })
    .catch((e) => {
      dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}

function required(val) {
  return (val && val.length > 0) || "Required field";
}*/

provide("product", sample);
provide("iconName", "sample");
provide("titleField", "Title");
provide("secondTitle", "Date");
//provide("collection", "Samples");
provide("searchFields", ["Title", "Source", "Address"]);

defineExpose({
  reset,
  validate,
});
onMounted(() => {
  store.currentCollection = "Samples";
});
</script>
<style></style>
