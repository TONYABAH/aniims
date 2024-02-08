<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-input
      v-model="Case.CaseNumber"
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
          @click="copyToClipboard(Case.CaseNumber)"
        >
        </q-btn>
      </template>
    </q-input>

    <q-input
      label="Complaint ID"
      v-model="Case.ComplaintId"
      outlined
      filled
      type="text"
    >
      <q-btn
        flat
        icon="visibility"
        :disable="!Case?.ComplaintId"
        :to="'/Complaints/#' + Case.ComplaintId"
      />
    </q-input>

    <q-input
      v-model="Case.Title"
      outlined
      filled
      label="Title *"
      type="text"
      :rules="[(val) => !!val || 'Complaint is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      v-model="Case.Location"
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
      v-model="Case.Unit"
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

    <!--<q-select
      v-model="Case.IPO"
      label="Case IPO *"
      :options="store.ipos"
      :rules="[(val) => !!val || 'IPO is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""

      =""
      options-dense=""
      option-value="uid"
      option-label="Name"
    />-->
    <ipo-input
      outlined
      filled
      :model="ipo"
      :set-model="(v) => (ipo = v)"
      :search-options="{ location: Case.Location }"
      :rules="[(val) => !!val || 'IPO is required']"
      hide-bottom-space=""
      lazy-rules="ondemand"
      label="IPO"
    />
    <!--<q-input
      v-model="Case.FileNumber"
      label="File number (optional)"
      type="text"
      color=""
      name="fileNumber"
    >
      <template v-slot:append>
        <q-btn
          v-if="update_fileNumber"
          flat
          color=""
          label="Update"
          @click.stop="updateFileNumber"
        />
      </template>
    </q-input>-->

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
//import { Dialog as dialog } from "quasar";
//import { useIpoList } from "src/composables/use-fn";

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
    ? store.units.filter((u) => u.Location === Case.value?.Location)
    : store.units;
});

/*const suspectyQuery = computed(() =>
  query(
    collection(firestore, "Suspects"),
    where("Cases", "array-contains", Case.value.CaseNumber || 0)
  )
);
const raidQuery = computed(() =>
  query(
    collection(firestore, "Raids"),
    where("CaseNumber", "==", Case.value.CaseNumber || 0)
  )
);*/
watch(
  () => Case.value.FileNumber,
  (newValue) => {
    update_fileNumber.value = newValue ? true : false;
  }
);
watch(
  () => Case.value.Status,
  (newValue) => {
    //console.log(Case.value?.IPO);
    update_status.value = newValue ? true : false;
  }
);
watch(ipo, (newValue, oldValue) => {
  Case.value.IPO = newValue?.uid;
});

watch(
  () => Case.value.IPO,
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
