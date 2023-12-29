<template>
  <q-form ref="form" class="q-gutter-xs">
    <q-separator spaced inset vertical dark />
    <label>Case Number *</label>
    <q-input
      outlined
      square=""
      v-model="sample.CaseId"
      type="number"
      :rules="[(val) => !!val || 'Case number is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      class="q-mb-md"
    />
    <q-separator spaced inset vertical dark />
    <label>Product name *</label>
    <q-input
      outlined
      square
      v-model="sample.Name"
      type="text"
      :rules="[required]"
      lazy-rules
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <label>Manufacturer *</label>
    <q-input outlined square v-model="sample.Manufacturer" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Manufacturer address*</label>
    <q-input outlined square v-model="sample.ManAddress" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Country of origin</label>
    <q-select
      outlined
      square=""
      v-model="sample.Country"
      :options="countries"
      options-dense=""
      clear-icon="clear"
      clearable=""
    />
    <q-separator spaced inset vertical dark />
    <label>Category</label>
    <q-select
      outlined
      square
      v-model="sample.Category"
      :options="categories"
      clear-icon="clear"
      clearable=""
      options-dense
    />
    <q-separator spaced inset vertical dark />
    <label>Pharmacological class</label>
    <q-select
      v-if="sample.Category === 'Pharmaceuticals'"
      v-model="sample.PharmClass"
      :options="pharm_class"
      options-dense=""
      outlined
      square=""
    />
    <q-separator spaced inset vertical dark />
    <label>Batch</label>
    <q-input outlined square v-model="sample.Batch" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Pack size</label>
    <q-input outlined square v-model="sample.PackSize" type="text" />
    <q-separator spaced inset vertical dark />
    <label>NAFDAC Number</label>
    <q-input outlined square v-model="sample.NAFDACNumber" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Quantity *</label>
    <q-input
      outlined
      square
      v-model="sample.Quantity"
      type="text"
      :rules="[(val) => !!val || 'Quantity is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <label>Manufaturing date</label>
        <q-input
          outlined
          square
          v-model="sample.ManDate"
          type="date"
          label=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <label>Expiry date (Best Before date)</label>
        <q-input
          outlined
          square
          v-model="sample.ExpiryDate"
          type="date"
          label=""
        />
      </div>
    </div>
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical />
        <label>Date sent to Lab</label>
        <q-input
          outlined
          square
          name="sentDate"
          v-model="sample.SentDate"
          type="date"
          :rules="[required]"
          lazy-rules=""
          hide-bottom-space=""
          clearable=""
          clear-icon="close"
        >
          <template v-slot:append>
            <q-btn
              v-if="update_sentDate"
              flat
              color="primary"
              label="Update"
              @click="updateSentDate"
            />
          </template>
        </q-input>
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical />
        <label>Date report received from Lab *</label>
        <q-input
          outlined
          square=""
          name="reportDate"
          v-model="sample.ReportDate"
          type="date"
          hide-bottom-space=""
          clearable=""
          clear-icon="close"
        >
          <template v-slot:append>
            <q-btn
              v-if="update_reportDate"
              flat
              color="primary"
              label="Update"
              @click="updateReport"
            />
          </template>
        </q-input>
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical />
        <label>Lab result</label>
        <q-select
          v-model="sample.Result"
          options-dense
          :options="LAB_REPORT_OPTIONS"
          outlined
          square
        />
      </div>
    </div>
    <q-separator spaced inset vertical />
    <label>Exhibit Officer</label>
    <q-input
      v-model="sample.Sender"
      :model-value="sample.Sender || store.user.displayName"
      type="text"
      :rules="[(val) => !!val || 'Submitting officer is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined=""
    />
  </q-form>
</template>

<script setup>
import { Dialog as dialog } from "quasar";
import { ref, computed, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import { update, create } from "src/composables/remote";
import FormCard from "src/components/FormCard.vue";
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

const props = defineProps({
  model: Object,
  setModel: Function,
});
const sample = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});

function reset() {
  form.value?.resetValidation();
}
const validate = async () => {
  return await form.value?.validate(true);
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
