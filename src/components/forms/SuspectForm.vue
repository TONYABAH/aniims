<template>
  <q-form ref="form" class="q-gutter-md full-width">
    <div class="row">
      <div class="col col-xs-8 col-sm-4 col-md-4 q-pr-sm q-pt-md" align="left">
        <q-img
          :src="suspect.PhotoURL"
          spinner-color="orange"
          spinner-size="32px"
          width="168px"
          height="180px"
          alt="Passport photo"
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          style="border: 1px solid #bbb"
          class="bg-grey-9 cursor-pointer"
          @click="showUploadDialog"
        >
        </q-img>
        <q-separator spaced inset vertical dark />
        <q-btn
          no-caps
          color="teal-8"
          class="q-py-xs"
          style="width: 168px"
          :label="suspect.PhotoURL ? 'Change photo' : 'Upload photo'"
          @click="showUploadDialog"
        >
        </q-btn>
      </div>
      <div class="col col-xs-12 col-sm-8 col-md-8">
        <label>Full name *</label>
        <q-input
          outlined
          dense
          square
          v-model="suspect.Name"
          type="text"
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
        <label>Phone *</label>
        <q-input
          outlined
          dense
          square
          v-model="suspect.Phone"
          type="text"
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />

        <label>Date of birth *</label>
        <q-input
          outlined
          dense
          square
          v-model="suspect.DOB"
          type="date"
          label="Date of birrth"
          input-class="q-mt-sm"
        />

        <label>Nationality *</label>
        <q-select
          v-model="suspect.Nationality"
          :options="countries"
          option-value="name"
          option-label="name"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
    </div>

    <div class="row" v-if="suspect.Nationality === 'Nigeria'">
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>State of origin *</label>
        <q-select
          v-model="suspect.StateOfOrigin"
          :options="states"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>LGA *</label>
        <q-select
          v-model="suspect.LGA"
          :options="lgas"
          options-dense=""
          label="LGA"
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
    </div>

    <label>Residential address *</label>
    <q-input
      v-model="suspect.Address"
      type="text"
      outlined
      dense
      square
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 q-pr-xs">
        <label>State of residence *</label>
        <q-select
          v-model="suspect.State"
          :options="states"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>City of residence *</label>
        <q-select
          v-model="suspect.City"
          :options="cities"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
    </div>

    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 q-pr-xs">
        <label>ID Number</label>
        <q-input v-model="suspect.IdNumber" type="text" outlined dense square />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>Means of identification</label>
        <q-select
          v-model="suspect.IdentityCard"
          :options="identityOptions"
          options-dense=""
          outlined
          dense
          square=""
          clearable
        />
      </div>
    </div>
  </q-form>
  <UploadDialog
    accept=".jpg,.jpeg,.png"
    title="Passport photo"
    :model="dialogModel"
    :set-model="(v) => (dialogModel = v)"
    :maxSize="1028 * 100"
    position="top"
    v-on:DocUploaded="onDocumentUploaded"
  />
</template>
<script setup>
import { ref, computed, watch } from "vue";

import {
  useStates,
  useCities,
  useCountries,
  useLgas,
} from "src/composables/address-use";
import UploadDialog from "src/components/UploadDialog.vue";
import { deleteFile } from "src/composables/remote";

const identityOptions = [
  "Divers License",
  "National ID Card",
  "International Passport",
  "Others",
];
const props = defineProps({
  data: Object,
});
const dialogModel = ref(false);
const _suspect = ref(Object.assign({}, props.data));
const suspect = computed({
  get: () => _suspect.value || {},
  set: (v) => (_suspect.value = v),
});
const states = useStates("Nigeria");
const cities = computed(() => useCities(suspect.value?.State));
const lgas = computed(() => useLgas(suspect.value?.StateOfOrigin));
const countries = useCountries();
const form = ref(null);

function reset() {
  form.value.resetValidation();
}
async function validate() {
  return await form.value?.validate(true);
}
function extractFileName(downloadURL) {
  let ar = decodeURI(downloadURL).split("/");
  const name = ar.pop().replace("%2F", "/");
  return name.split("?")[0];
}
function showUploadDialog() {
  dialogModel.value = true;
}
async function onDocumentUploaded(doc) {
  dialogModel.value = false;
  let fileName = null;
  if (suspect.value.PhotoURL) {
    // remove photo
    fileName = extractFileName(suspect.value.PhotoURL);
  }
  suspect.value.PhotoURL = doc.downloadURL;
  // Delete previous image for this suspect
  if (fileName) await deleteFile(fileName);
}
watch(
  () => suspect.value.StateOfOrigin,
  (val) => {
    suspect.value.LGA = null;
  }
);
watch(
  () => suspect.value.State,
  (val) => {
    suspect.value.City = null;
  }
);
defineExpose({ suspect, reset, validate });
</script>
