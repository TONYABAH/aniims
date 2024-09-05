<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :searchFields="SEARCH_FIELDS"
    :hide-save-button="hideSaveButton"
    :showPrevious="showPrevious"
    :onSaved="onDocumentSaved"
    :onPrevious="onPrevious"
    :commentable="complaint.id !== undefined"
    saveButtonLabel="Save & continue"
    collectionName="Complaints"
  >
    <q-tabs
      v-model="tab"
      class="text-teal"
      inline-label
      narrow-indicator
      v-if="complaint?.id"
    >
      <q-tab name="form" icon="edit" label="Form" />
      <q-tab name="locations" icon="map" label="Locations" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="form" style="padding-left: 0; padding-right: 0">
        <ComplaintApplication
          ref="form"
          :data="complaint"
          :setData="setDocument"
        />
      </q-tab-panel>
      <q-tab-panel
        name="locations"
        style="padding-left: 0; padding-right: 0; overflow: auto"
      >
        <TableView
          :data="locations"
          :columns="locationColumns"
          title="Where are the locations?"
          :onAddItem="showAddLocation"
          :onEditItem="showEditLocation"
          :onViewItem="showViewLocation"
          :onRemoveItem="removeLocation"
          :deletable="true"
          :editable="false"
          v-if="complaint.id"
        />
      </q-tab-panel>
    </q-tab-panels>
  </FormCard>

  <q-dialog full-width="" v-model="locationPopupModel">
    <q-card class="full-width">
      <q-toolbar class="bg-teal text-grey-1">
        <q-icon name="map" color="white" />
        <q-toolbar-title> Location</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="reset" />
      </q-toolbar>
      <q-card-section style="width: 100%; height: 280px; overflow: auto">
        <div>
          <LocationForm
            ref="locationFormRef"
            :data="location"
            :setLocation="setLocation"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Save"
          icon-right="arrow_right"
          color="secondary"
          unelevated
          :loading="loading"
          @click="addLocation"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Wait...
          </template>
        </q-btn>
        <q-btn
          unelevated
          label="Cancel"
          icon="clear"
          color="negative"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="previewMap" class="full-width">
    <q-card flat class="full-width">
      <GoogleGeoViewer :data="geoData.data" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, provide, ref, watch } from "vue";
import FormCard from "src/components/FormCard.vue";
import ComplaintApplication from "src/components/forms/ComplaintForm.vue";
import LocationForm from "src/components/forms/LocationForm.vue";
import TableView from "src/components/TableView.vue";
import {
  addChildDocument,
  onAddDocument,
  onDeleteDocument,
  onDeleteAttachment,
  update,
} from "src/composables/remote";
import Clipboard from "src/utils/clipboard.js";
import { useGeolocation } from "src/composables/use-fn";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import { Notify, Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const tab = ref("form");
const form = ref(null);
const updateFields = [];
//const complaint = ref({});
const geo = useGeolocation();

const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});
const showPrevious = ref(false);
const hideSaveButton = ref(false);
const location = ref({});
const locationPopupModel = ref(false);
const locationFormRef = ref(null);

const update_caseNumber = ref(false);
const SEARCH_FIELDS = ["Title", "Source", "Address"];
const locationColumns = [
  {
    name: "Address",
    label: "Address",
    field: "Address",
    title: "Address",
    align: "left",
  },
];

const setLocation = (l) => (location.value = l);
const complaint = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const locations = computed({
  get: () => complaint.value.Locations || [],
  set: (v) => (complaint.value.Locations = v),
});
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

function showAddLocation() {
  locationPopupModel.value = true;
  location.value = {};
}
async function addLocation(loc) {
  if (!(await locationFormRef.value?.validate())) {
    dialog.create({
      message: "Please fill form correctly",
      title: "Validation error",
    });
    return;
  }
  if (complaint.value?.id) {
    loading.value = true;
    const data = Object.assign({}, location.value);
    onAddDocument("Complaints", complaint.value.id, "Locations", data)
      .then(() => {
        //locations.value.push(data);
        if (!complaint.value?.Locations) complaint.value.Locations = [data];
        else complaint.value.Locations.push(data);
        locationPopupModel.value = false;
      })
      .catch((e) => {
        Notify.create({
          title: "Error",
          message: e.message || e,
          color: "red",
          position: "right",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    //if (!complaint.value?.Locations) complaint.value.Locations = [data];
    //else complaint.value.Locations.push(data);
    //locations.value.push(data);
    Notify.create({
      title: "Error",
      message: "No complaint selected",
      color: "red",
      position: "right",
    });
  }
  //location.value = {};
}
async function removeLocation(loc, index) {
  if (complaint.value?.id) {
    loading.value = true;
    onDeleteDocument("Complaints", store.currentDocument.id, "Locations", loc)
      .then(() => {
        //locations.value?.splice(index, 1);
        complaint.value.Locations.splice(index, 1);
      })
      .catch((e) => {
        Notify.create({
          title: "Error",
          message: e.message,
          color: "red",
          position: "right",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
function showViewLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}
function showEditLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}
function onDocumentSaved() {
  showPrevious.value = true;
  tab.value = "locations";
  //hideSaveButton.value = true;
}
function onPrevious() {
  tab.value = "form";
  showPrevious.value = false;
  //hideSaveButton.value = false;
}

watch(
  () => complaint.value?.CaseNumber,
  (newValue) => {
    //console.log(newValue);
    update_caseNumber.value = newValue ? true : false;
  }
);
watch(tab, (newValue) => {
  if (newValue === "form") {
    hideSaveButton.value = false;
  } else {
    hideSaveButton.value = true;
  }
});

provide("iconName", "campaign");
provide("titleField", "Title");
provide("secondTitle", "Date");
//provide("collection", "Complaints");
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
