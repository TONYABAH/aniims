<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :hide-tabs="true"
    :commentable="false"
    :search-fields="SEARCH_FIELDS"
    collectionName="Suspects"
  >
    <SuspectForm ref="form" :model="suspect" :setModel="setDocument" />
  </FormCard>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import FormCard from "src/components/FormCard.vue";
import SuspectForm from "src/components/forms/SuspectForm.vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const form = ref(null);
const updateFields = [];
const suspect = ref({});
const SEARCH_FIELDS = ["Name", "Phone", "Address"];
const setDocument = (v) => (suspect.value = v);

function getDocument() {
  return suspect.value;
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

provide("product", suspect);
provide("iconName", "suspect");
provide("titleField", "Title");
provide("secondTitle", "Date");
//provide("collection", "Samples");
provide("searchFields", ["Name", "Address"]);

defineExpose({
  reset,
  validate,
});
onMounted(() => {
  store.currentCollection = "Suspects";
});
</script>
<style></style>
