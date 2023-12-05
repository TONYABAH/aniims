<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <SampleForm ref="form" :model="sample" :setModel="setDocument" />
  </FormCard>
</template>

<script setup>
import { Dialog as dialog } from "quasar";
import { ref, computed, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import { update, create } from "src/composables/remote";
import FormCard from "src/components/FormCard.vue";
import SampleForm from "src/components/forms/SampleForm.vue";
import _countries from "src/data/countries.json";

const categories = [
  "Food",
  "Water",
  "Beverages",
  "Pharmaceuticals",
  "Medical Devices",
  "Chemicals",
  "Cosmetics",
];
const pharm_class = [
  "Antibiotics",
  "Anticancer",
  "Antimalaria",
  "Antihelminthes",
  "Narcotics",
  "Psychtropics",
  "Sedative",
  "Neutraceuticals",
  "Others",
];
const countries = computed(() => _countries.map((c) => c.name));
const store = useDefaultStore();
const collection = "Samples";
const form = ref(null);
const document_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
];
const LAB_REPORT_OPTIONS = ["Satisfactory", "Unsatisfactory", "Inconclusive"];
const docTitle = ref("");
const fileSource = ref("");
const assigned = ref();
const updateFields = [];
const sample = ref({});

const setDocument = (v) => (sample.value = v);

function getDocument() {
  return sample.value;
}
function reset() {
  form.value?.reset();
}
const validate = async () => {
  return await form.value.validate();
};
function updateReport() {
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
}

provide("product", sample);
provide("iconName", "sample");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Samples");
provide("searchFields", ["Title", "Source", "Address"]);

defineExpose({
  reset,
  validate,
});
</script>
<style></style>
