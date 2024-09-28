<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-input
      v-model="Case.case_number"
      label="Case Number"
      type="text"
      color=""
      name="caseNumber"
      readonly=""
      borderless=""
      v-if="Case.id"
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color=""
          id="copy_btn"
          icon="content_copy"
          @click="copyToClipboard(Case.case_number)"
        >
        </q-btn>
      </template>
    </q-input>

    <q-input
      label="Complaint ID"
      v-model="Case.complaint_id"
      outlined
      filled
      type="text"
    >
      <q-btn
        flat
        icon="visibility"
        :disable="!Case?.ComplaintId"
        :to="'/Complaints/#' + Case.complaint_id"
      />
    </q-input>

    <q-input
      v-model="Case.title"
      outlined
      filled
      label="Title *"
      type="text"
      :rules="[(val) => !!val || 'Complaint is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      v-model="Case.location"
      outlined
      filled
      label="Location *"
      :options="nafdac_locations"
      options-dense=""
      :rules="[(val) => !!val || 'Location is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      v-model="Case.unit"
      outlined
      filled
      label="Division in charge *"
      :options="units"
      :rules="[(val) => !!val || 'Division is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      options-dense=""
      option-value="Abbrev"
      option-label="Abbrev"
      emit-value=""
    />
    <ipo-input
      outlined
      filled
      :model="ipo"
      :set-model="(v) => (ipo = v)"
      :search-options="{ location: Case.location }"
      :rules="[(val) => !!val || 'IPO is required']"
      hide-bottom-space=""
      lazy-rules="ondemand"
      label="IPO"
    />

    <StatusInput
      outlined
      filled
      collection-name="Investigations"
      :options="CASE_STATUS_OPTIONS"
      :documentId="Case?.id"
      :status="Case?.Status"
      :set-status="(v) => (Case.Status = v)"
      :rules="[(val) => !!val || 'Status is required']"
    />
  </q-form>
</template>
<script setup>
import { computed, ref, watch, provide, onMounted } from "vue";
import { useDefaultStore } from "src/stores/store";
import { getById } from "src/composables/remote";
import Clipboard from "src/utils/clipboard.js";
import IpoInput from "./IpoInput.vue";
import StatusInput from "./StatusInput.vue";

const CASE_STATUS_OPTIONS = ["Open", "Police", "Legal", "Court", "Closed"];
const store = useDefaultStore();
const form = ref(null);
const update_fileNumber = ref(false);
const update_status = ref(false);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const ipo = ref(null);

const props = defineProps({
  onCaseLoaded: Function,
  model: Object,
  setModel: Function,
});
const Case = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});

function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
const nafdac_locations = computed(() => {
  return store.locations;
});
const units = computed(() => {
  return Case.value.Location
    ? store.units.filter((u) => u.location === Case.value?.location)
    : store.units;
});

watch(
  () => Case.value.file_number,
  (newValue) => {
    update_fileNumber.value = newValue ? true : false;
  }
);
watch(
  () => Case.value.status,
  (newValue) => {
    //console.log(Case.value?.IPO);
    update_status.value = newValue ? true : false;
  }
);
watch(ipo, (newValue, oldValue) => {
  Case.value.IPO = newValue?.uid;
});

watch(
  () => Case.value.ipo,
  async (newValue, oldValue) => {
    if (!oldValue) {
      //let ipos = useIpoList({ uid: Case.value?.IPO });
      ipo.value = await getById(newValue, "Users");
    }
  }
);
function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

onMounted(() => {});
provide("iconName", "cases");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Cases");
provide("searchFields", ["Title", "Location"]);

defineExpose({
  reset,
  validate,
});
</script>
<style>
.q-input,
.q-select {
  border-radius: 4px 4px;
}
</style>
