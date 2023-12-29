<template>
  <q-form ref="form">
    <label>Case Number</label>
    <q-input
      v-model="Case.CaseNumber"
      type="text"
      color=""
      name="caseNumber"
      filled
      square
      readonly=""
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
    <q-separator spaced inset vertical dark />
    <label>Complaint ID</label>
    <q-input v-model="Case.ComplaintId" type="text" filled square />
    <q-separator spaced inset vertical dark />
    <label>Case Title *</label>
    <q-input
      v-model="Case.Title"
      type="text"
      :rules="[(val) => !!val || 'Complaint is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
      square
    />
    <q-separator spaced inset vertical dark />
    <label>Location *</label>
    <q-select
      v-model="Case.Location"
      :options="nafdac_locations"
      options-dense=""
      :rules="[(val) => !!val || 'Location is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
      square=""
    />
    <q-separator spaced inset vertical dark />
    <label>Division in charge *</label>
    <q-select
      v-model="Case.Division"
      :options="units"
      :rules="[(val) => !!val || 'Division is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
      square=""
      options-dense=""
      option-value="Abbrev"
      option-label="Abbrev"
    />
    <q-separator spaced inset vertical dark />
    <label>Case IPO *</label>
    <q-select
      v-model="Case.IPO"
      :options="store.ipos"
      :rules="[(val) => !!val || 'IPO is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
      square=""
      options-dense=""
      option-value="Name"
      option-label="Name"
    />
    <q-separator spaced inset vertical dark />
    <label>File number *</label>
    <q-input
      v-model="Case.FileNumber"
      type="text"
      color=""
      name="fileNumber"
      filled
      square
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
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Status *</label>
    <q-select
      v-model="Case.Status"
      :options="CASE_STATUS_OPTIONS"
      filled
      square
      options-dense=""
      :rules="[(val) => !!val || 'Status is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <template v-slot:append>
        <q-btn
          v-if="update_status"
          flat
          color=""
          label="Update"
          @click.stop="updateCaseStatus"
        />
      </template>
    </q-select>
    <!--<TableView
            :editable="true"
            :data="suspects"
            :columns="suspect_columns"
            :onAddItem="() => handleSuspectPopup({})"
            :onRemoveItem="(data, index) => removeSuspect(data, index)"
            :onEditItem="(data, index) => handleSuspectPopup(data, index)"
            :onViewItem="(data, index) => handleSuspectPopup(data, index)"
            :deleteBtn="false"
            title="Suspects"
          />
          <TableView
            :editable="false"
            :data="raids"
            :columns="columns"
            :deleteBtn="false"
            :onAddItem="showRaid"
            :onViewItem="showRaid"
            :onEditItem="showRaid"
            title="Raids"
          />-->
  </q-form>
</template>
<script setup>
import { computed, ref, watch, provide } from "vue";
import { Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { update } from "src/composables/remote";

import Clipboard from "src/utils/clipboard.js";

const CASE_STATUS_OPTIONS = ["Open", "Progress", "Closed"];
const store = useDefaultStore();
const form = ref(null);

const update_fileNumber = ref(false);
const update_status = ref(false);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");

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
function updateFileNumber() {
  // send update file number field
  store.loading = true;
  update(Case.value.id, { FileNumber: Case.value.FileNumber }, "Cases")
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
function updateCaseStatus() {
  store.loading = true;
  update(Case.value.id, { Status: Case.value.Status }, "Cases")
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
    update_status.value = newValue ? true : false;
  }
);

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);
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
<style></style>
