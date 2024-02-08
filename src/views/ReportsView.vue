<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :hide-tabs="true"
    :commentable="false"
    :search-fields="['Title']"
    collectionName="Reports"
  >
    <ReportForm
      :data="report"
      :setData="setDocument"
      :case-id="caseId"
      ref="form"
    />
  </FormCard>
</template>

<script setup>
//import { Dialog as dialog } from "quasar";
import { ref, computed, provide } from "vue";
import FormCard from "src/components/FormCard.vue";
import ReportForm from "src/components/forms/ReportForm.vue";
import { useRoute } from "vue-router";
//const store = useDefaultStore();
const form = ref(null);
const updateFields = [];
const report = ref({});
const route = useRoute();
const caseId = route.params?.id || "";
const setDocument = (v) => {
  report.value = v || {};
};

function getDocument() {
  return report.value;
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

provide("report", report);
provide("iconName", "book");
provide("titleField", "Title");
provide("secondTitle", "Date");
//provide("collection", store.currentCollection);
provide("searchFields", ["Title"]);

defineExpose({
  reset,
  validate,
});
</script>
<style></style>
