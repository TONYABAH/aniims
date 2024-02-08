<template>
  <q-form ref="form" class="q-gutter-xs">
    <q-input
      label="Case number *"
      outlined
      stack-label
      v-model="sample.CaseNumber"
      type="number"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-input
      label="Product name *"
      outlined
      stack-label
      v-model="sample.Name"
      type="text"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-input
      label="Manufacturer *"
      outlined
      stack-label
      v-model="sample.Manufacturer"
      type="text"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-input
      label="Manufacturer address *"
      outlined
      stack-label
      v-model="sample.ManAddress"
      type="text"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-select
      label="Country of origin"
      outlined
      stack-label=""
      v-model="sample.Country"
      :options="countries"
      options-dense=""
      clear-icon="clear"
      clearable=""
    />
    <q-select
      label="Category *"
      outlined
      stack-label
      v-model="sample.Category"
      :options="categories"
      clear-icon="clear"
      options-dense
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-select
      v-if="sample.Category === 'Pharmaceuticals'"
      label="Pharmacological class"
      v-model="sample.PharmClass"
      :options="pharm_class"
      options-dense=""
      outlined
      stack-label=""
      :rules="[required]"
      lazy-rules="ondemand"
    />
    <q-input
      label="NAFDAC Number"
      outlined
      stack-label
      v-model="sample.NAFDACNumber"
      type="text"
    />
    <q-input
      label="Batch"
      outlined
      stack-label
      v-model="sample.Batch"
      type="text"
    />
    <q-input
      label="Pack size"
      outlined
      stack-label
      v-model="sample.PackSize"
      type="text"
    />

    <q-input
      label="Quantity"
      outlined
      stack-label
      v-model="sample.Quantity"
      type="text"
      :rules="[(val) => !!val || 'Quantity is required']"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-input
      label="Manufaturing date"
      outlined
      stack-label
      v-model="sample.ManDate"
      type="date"
    />
    <q-input
      label="Expiry date (Best Before date)"
      outlined
      stack-label
      v-model="sample.ExpiryDate"
      type="date"
    />
    <q-input
      label="Date sent to Lab"
      outlined
      stack-label
      name="sentDate"
      v-model="sample.SentDate"
      type="date"
      :rules="[required]"
      lazy-rules="ondemand"
      clearable=""
      clear-icon="close"
      hide-bottom-space=""
    >
      <template v-slot:append>
        <q-btn
          v-if="sample.SentDate"
          flat
          color="primary"
          label="Update"
          :loading="loading"
          @click="updateReport('sent-date')"
        />
      </template>
    </q-input>
    <q-input
      label="Date report received from Lab *"
      outlined
      stack-label=""
      name="reportDate"
      v-model="sample.ReceiveDate"
      type="date"
      clearable=""
      clear-icon="close"
    >
      <template v-slot:append>
        <q-btn
          v-if="sample.ReceiveDate"
          flat
          color="primary"
          label="Update"
          :loading="loading"
          @click="updateReport('receive-date')"
        />
      </template>
    </q-input>
    <q-select
      v-if="sample.ReportDate"
      label="Lab result"
      v-model="sample.Result"
      options-dense
      :options="LAB_REPORT_OPTIONS"
      outlined
      stack-label
    >
      <template v-slot:append>
        <q-btn
          v-if="sample.ReportDate"
          flat
          color="primary"
          label="Update"
          :loading="loading"
          @click="updateReport('result')"
        />
      </template>
    </q-select>
    <!--<q-input
      label="Exhibit Officer"
      v-model="sample.Sender"
      type="text"
      :rules="[(val) => !!val || 'Submitting officer is required']"
      lazy-rules="ondemand"
      outlined
      stack-label=""
    />-->
    <StatusInput
      collection-name="Samples"
      :documentId="sample?.id"
      :status="sample?.Status"
      :set-status="(v) => (sample.Status = v)"
      outlined
    />
  </q-form>
</template>

<script setup>
import { Notify } from "quasar";
import { ref, computed, provide, watch } from "vue";
//import { useDefaultStore } from "src/stores/store";
import { update } from "src/composables/remote";
import { simpleSearch } from "src/composables/searchProvider";
import StatusInput from "./StatusInput.vue";
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
//const store = useDefaultStore();
const form = ref(null);
const loading = ref(false);
const LAB_REPORT_OPTIONS = ["Satisfactory", "Unsatisfactory", "Inconclusive"];

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
function updateReport(param) {
  loading.value = true;
  let data = {
    Result: sample.value.Result,
  };
  if (param === "receive-date") {
    data = { ReceiveDate: sample.value.ReceiveDate };
  } else if (param === "sent-date") {
    data = { sentDate: sample.value.SentDate };
  }
  update(sample.value.id, data, "Samples")
    .then((d) => {
      Notify.create({
        title: "Success",
        message: "Update succeeded",
        position: "right",
        timeout: 1000,
      });
    })
    .catch((e) => {
      Notify.create({
        title: "Error",
        message: e.message,
        position: "right",
        color: "red",
        timeout: 1000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

function required(val) {
  return (val && val.length > 0) || "Required field";
}
watch(
  () => sample.value?.CaseNumber,
  (newValue) => {
    if (newValue && !sample.value.CaseId) {
      simpleSearch("Investigations", {
        whereFilters: [["CaseNumber", "==", Number(newValue)]],
      })
        .then((list) => {
          if (list.length > 0) {
            sample.value.CaseId = list[0].id;
          } else {
            sample.value.CaseId = null;
          }
        })
        .catch((e) => {});
    } else {
      sample.value.CaseId = null;
    }
    //update_fileNumber.value = newValue ? true : false;
  },
  { immediate: true }
);
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
