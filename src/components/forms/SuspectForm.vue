<template>
  <q-form ref="form" class="q-gutter-md full-width q-pa-md">
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-12">
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
          input-class="q-mt-sm"
        />

        <label>Nationality *</label>
        <CountryInput
          v-model="suspect.Nationality"
          option-value=""
          option-label=""
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
        <!--<q-select
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
        />-->
      </div>
    </div>

    <div class="row" v-if="suspect.Nationality?.name === 'Nigeria'">
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>State of origin *</label>
        <!--<q-select
          v-model="suspect.StateOfOrigin"
          :options="states"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />-->
        <StateInput
          v-model="suspect.StateOfOrigin"
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
        <LgaInput
          v-model="suspect.LGA"
          :state="suspect.StateOfOrigin || ''"
          options-dense=""
          label="LGA"
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
        <!--<q-select
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
        />-->
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
    >
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(suspect.Address)"
        v-if="suspect.Address"
      />
      <template v-slot:prepend>
        <q-btn
          dense
          unelevated
          glossy
          color="teal"
          icon="map"
          @click="onPreviewMap"
          v-if="suspect.Lat && suspect.Lng"
        />
      </template>
    </q-input>

    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 q-pr-xs">
        <label>State of residence *</label>
        <StateInput
          v-model="suspect.State"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
        <!--<q-select
          v-model="suspect.State"
          :options="states"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />-->
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>City of residence *</label>
        <CityInput
          v-model="suspect.City"
          :state="suspect.State || ''"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
        <!--<q-select
          v-model="suspect.City"
          :options="cities"
          options-dense=""
          outlined
          dense
          square=""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />-->
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
    <div class="row">
      <div
        class="col col-xs-6 col-sm-5 col-md-4 q-pr-sm q-pt-md text-left"
        align="left"
      >
        <q-img
          :src="suspect.PhotoURL"
          spinner-color="orange"
          spinner-size="32px"
          width="224px"
          alt="Passport photo"
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          style="
            border: 1px solid #bbb;
            border-radius: 4px 4px;
            background-image: url('https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg');
            background-repeat: no-repeat;
            background-size: cover;
          "
          class="cursor-pointer"
          @click="showUploadDialog"
        >
        </q-img>
        <q-separator spaced inset vertical dark />
        <q-btn
          rounded
          unelevated=""
          no-caps
          color="blue-grey-8"
          class="q-py-xs q-ml-sm"
          style="width: 168px"
          :label="suspect.PhotoURL ? 'Change photo' : 'Upload photo'"
          @click="showUploadDialog"
        >
        </q-btn>
      </div>
    </div>
    <CircularProgress :loading="loading" :size="140" />
  </q-form>
  <q-dialog v-model="previewMap" class="full-width">
    <q-card flat class="full-width">
      <GoogleGeoViewer :data="geoData.data" />
    </q-card>
  </q-dialog>
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
  useGeolocation,
} from "src/composables/use-fn";
import UploadDialog from "src/components/UploadDialog.vue";
import { deleteFile } from "src/composables/remote";
//import { useGeolocation } from "src/composables/use-fn";
import { Dialog, Notify } from "quasar";
import CircularProgress from "src/components/CircularProgress.vue";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import StateInput from "./StateInput.vue";
import CityInput from "./CityInput.vue";
import LgaInput from "./LgaInput.vue";
import CountryInput from "./CountryInput.vue";

const geo = useGeolocation();

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
//const states = useStates("Nigeria");
//const cities = computed(() => useCities(suspect.value?.State));
//const lgas = computed(() => useLgas(suspect.value?.StateOfOrigin));
//const countries = useCountries();
const form = ref(null);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});
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
const onPreviewMap = () => {
  const data = {
    name: suspect.value.Address,
    data: [
      ["lat", "lng"],
      [suspect.value?.Lat, suspect.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = suspect.value.Name
      ? suspect.value.Name + ", " + address
      : address;
    const { addr, lat, lng, comp, country, state, city } =
      await geo.getLocation(_address);
    //console.log(Comp);
    Dialog.create({
      title: "Accept Address?",
      message: "Select Location components to use",
      ok: {
        push: true,
      },
      cancel: {
        push: true,
        color: "negative",
      },
      persistent: true,
      options: {
        type: "checkbox",
        model: ["address", "location"],
        // inline: true
        items: [
          { label: addr, value: "address", color: "secondary" },
          { label: lat + " " + lng, value: "location", color: "secondary" },
          // { label: Lng, value: "longitude", color: "secondary" },
        ],
      },
    })
      .onOk((data) => {
        if (data.includes("location")) {
          suspect.value.Lat = lat;
          suspect.value.Lng = lng;
        }
        if (data.includes("address")) {
          suspect.value.Address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) suspect.value.Country = country.long_name;
        if (state) suspect.value.State = state.long_name;
        if (city) {
          setTimeout(() => (suspect.value.City = city.long_name), 100);
        }
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  } catch (e) {
    //console.log(e);
    Notify.create({
      title: "Error",
      message: e.message || e,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
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
