<template>
  <q-form ref="form" class="q-gutter-">
    <AutoComplete
      :model="search"
      :min-chars="0"
      :auto-select="true"
      :options="suspects"
      :set-model="(v) => (search = v)"
      :filter="filter"
      :input-debounce="400"
      placeholder="Enter name..."
      icon="search"
      option-value="id"
      option-label="Name"
      outlined
      stack-label
      rounded
      style="max-width: 500px"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      v-model="suspect.Name"
      outlined
      stack-label
      label="Name"
      type="text"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />

    <q-input
      v-model="suspect.Phone"
      outlined
      stack-label
      label="Phone"
      type="text"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />

    <q-input
      label="Date of birth *"
      outlined
      stack-label
      v-model="suspect.DOB"
      type="date"
      input-class="q-mt-sm"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />

    <CountryInput
      label="Nationality *"
      v-model="suspect.Nationality"
      option-value=""
      option-label=""
      options-dense=""
      outlined
      stack-label=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />
    <template v-if="suspect.Nationality?.name === 'Nigeria'">
      <StateInput
        v-model="suspect.StateOfOrigin"
        label="State of origin *"
        options-dense=""
        outlined
        stack-label=""
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
      />
      <LgaInput
        v-model="suspect.LGA"
        label="LGA *"
        :state="suspect.StateOfOrigin || ''"
        options-dense=""
        outlined
        stack-label
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
      />
    </template>
    <q-input
      v-model="suspect.Address"
      label="Residential address *"
      type="text"
      outlined
      stack-label
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    >
      <template v-if="suspect.Address">
        <q-btn
          flat
          unelevated
          glossy
          color="teal"
          icon="map"
          @click="onPreviewMap"
          class="q-mr-xs"
        />
        <q-btn
          unelevated
          glossy
          color="teal"
          :label="$q.screen.gt.xs ? 'Validate' : ''"
          @click="onValidateAddress(suspect.Address)"
        />
      </template>
    </q-input>
    <StateInput
      v-model="suspect.State"
      label="State *"
      options-dense=""
      outlined
      stack-label=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-12">
        <!--<q-select
          v-model="suspect.Nationality"
          :options="countries"
          option-value="name"
          option-label="name"
          options-dense=""
          outlined stack-label
          dense
          =""
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"

        />-->
      </div>
    </div>
    <CityInput
      v-model="suspect.City"
      label="City"
      :state="suspect.State || ''"
      options-dense=""
      outlined
      stack-label=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />
    <q-select
      label="Means of identification *"
      v-model="suspect.IdentityCard"
      :options="identityOptions"
      options-dense=""
      outlined
      stack-label=""
      clearable
      clear-icon="clear"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
    />
    <q-input
      label="ID Number"
      v-model="suspect.IdNumber"
      type="text"
      outlined
      stack-label
    />
    <div class="row">
      <div class="col col-xs-6 col-sm-5 col-md-4 q-pr-sm q-pt-md text-center">
        <q-img
          :src="suspect.PhotoURL"
          spinner-color="orange"
          spinner-size="32px"
          width="224px"
          height="224px"
          alt="Passport photo"
          :rules="[(val) => !!val || 'This field is required']"
          lazy-rules="ondemand"
          style="
            border: 1px solid #bbb;
            border-radius: 4px 4px;
            background-image: url('/assets/avatar3.jpg');
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
    position="left"
    v-on:DocUploaded="onDocumentUploaded"
  />
</template>
<script setup>
import { ref, computed, watch } from "vue";

import { useGeolocation } from "src/composables/use-fn";
import UploadDialog from "src/components/UploadDialog.vue";
import { deleteFile } from "src/composables/remote";
import { Dialog, Notify } from "quasar";
//import CircularProgress from "src/components/CircularProgress.vue";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import StateInput from "./StateInput.vue";
import CityInput from "./CityInput.vue";
import LgaInput from "./LgaInput.vue";
import CountryInput from "./CountryInput.vue";
import AutoComplete from "../AutoComplete.vue";
import { useSuspects } from "src/composables/use-fn";

const geo = useGeolocation();

const identityOptions = [
  "Divers License",
  "National ID Card",
  "International Passport",
  "Others",
];
const props = defineProps({
  model: Object,
  setModel: Function,
});
const suspect = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});

const search = ref();
const dialogModel = ref(false);
//const _suspect = ref({ id: "", Name: "" }, props.data);
const suspects = useSuspects();
/*const suspect = computed({
  get: () => _suspect.value,
  set: (v) => (_suspect.value = v),
});*/
const form = ref(null);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});

function setSuspect(v) {
  suspect.value = v;
}
function filter(needle) {
  const filtered = suspects.value.filter((s) => {
    return (
      s.Name.toLowerCase().indexOf(needle) === 0 ||
      s.Name.toLowerCase().indexOf(" " + needle) > 0
    );
    // v.toLowerCase().indexOf(needle) > -1)
  });
  return filtered;
}
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
  (newVal, oldVal) => {
    if (oldVal) suspect.value.LGA = null;
  }
);
watch(
  () => suspect.value.State,
  (newVal, oldVal) => {
    // console.log(newVal, oldVal);
    if (oldVal) suspect.value.City = null;
  }
);
watch(search, (newVal, oldVal) => {
  //console.log(newVal, oldVal);
  suspect.value = newVal || {};
});
defineExpose({ suspect, reset, validate });
</script>
