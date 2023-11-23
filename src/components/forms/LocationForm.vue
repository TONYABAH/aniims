<template>
  <q-form ref="form" class="q-gutter-sm">
    <div class="row">
      <div class="col col-xs-6 col-sm-6 col-md-6 col-lg-6">
        <q-select
          v-model="location.Country"
          :options="country_options"
          option-value="name"
          option-label="name"
          options-dense=""
          label="Country"
          outlined=""
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <label>Location name</label>
    <q-input
      v-model="location.Name"
      type="text"
      :readonly="readOnly"
      outlined=""
    />
    <q-separator spaced inset vertical dark />
    <label>Location street address</label>
    <q-input
      v-model="location.Address"
      type="text"
      :readonly="readOnly"
      outlined
    />
    <q-separator spaced inset vertical dark />
    <label>Location State</label>
    <q-select
      v-model="location.State"
      :options="states"
      options-dense=""
      outlined=""
    />
    <q-separator spaced inset vertical dark />
    <label>Location City</label>
    <q-select
      v-model="location.City"
      :options="cities"
      options-dense=""
      outlined=""
    />
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 q-pr-xs">
        <label>Latitude</label>
        <q-input v-model="location.Lat" type="text" outlined="" />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <label>Longitude</label>
        <q-input v-model="location.Lng" type="text" outlined="" />
      </div>
    </div>
    <CircularProgress :loading="loading" :size="140" />
    <q-separator spaced inset vertical dark />
    <q-expansion-item
      expand-separator
      icon="map"
      label="View Map"
      :caption="location.Address"
    >
      <GoogleGeoViewer :data="mapData" />
    </q-expansion-item>
  </q-form>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  useStates,
  useCities,
  useCountries,
} from "src/composables/address-use";
//import GoogleMapViewer from "../dashboard/GoogleMapViewer.vue";
import GoogleGeoViewer from "../dashboard/GoogleGeoViewer.vue";
import { useGeolocation } from "src/composables/use-geocation";
import { Dialog } from "quasar";
import CircularProgress from "src/components/CircularProgress.vue";

const geo = useGeolocation();

const props = defineProps({
  readOnly: Boolean,
  dense: {
    type: Boolean,
    default: true,
  },
  filled: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
  },
  setLocation: Function,
});

const states = useStates("Nigeria");
const cities = computed(() => useCities(location.value.State));
const country_options = useCountries();
const form = ref(null);
const loading = ref(false);
const _location = ref(props.data || {});
const location = computed({
  get: () => _location.value || {},
  set: (v) => (_location.value = v),
});
const mapData = computed(() => {
  return [
    ["Lat", "Long"],
    [location.value?.Lat, location.value?.Lng],
  ];
});
const validate = async () => await form.value?.validate(true);
function reset() {
  form.value?.resetValidation();
}
const getGeoLocation = async (address, callback) => {
  const { Geocoder } = await google.maps.importLibrary("geocoding");
  var geocoder = new Geocoder();
  var address = "10 - 15 Mobil Road, Apapa, Lagos Nigeria"; //document.getElementById("address").value;
  return geocoder.geocode(
    { address: address },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //console.log(results[0].geometry.location.lng());
        /*return Promise.resolve({
          Lat: results[0].geometry.location.lat(),
          Lng: results[0].geometry.location.lng(),
          Loc: results[0].geometry.location,
        });*/
        if (callback) callback(null, results[0].geometry.location);
      } else {
        console.log(
          "Geocode was not successful for the following reason: " + status
        );
        if (callback) callback(status);
        //return Promise.reject(status);
      }
    },
    1000
  );
};
watch(
  () => location.value.State,
  (val) => {
    location.value.City = null;
  }
);
watch(
  () => location.value.City,
  async (val) => {
    if (val) {
      loading.value = true;
      const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
      try {
        const { Addr, Lat, Lng } = await geo.getLocation(address);
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
              { label: Addr, value: "address", color: "secondary" },
              { label: Lat + " " + Lng, value: "location", color: "secondary" },
              // { label: Lng, value: "longitude", color: "secondary" },
            ],
          },
        })
          .onOk((data) => {
            if (data.includes("location")) {
              location.value.Lat = Lat ? Lat : "";
              location.value.Lng = Lng ? Lng : "";
            }
            if (data.includes("address"))
              location.value.Address = Addr ? Addr : location.value.Address;
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
        //console.log(JSON.stringify(data));
        //Lat: results[0].geometry.location.lat(),
        //Lng: results[0].geometry.location.lng(),
        //Loc: results[0].geometry.location,
        //location.value.Lat = loc.lat();
        //location.value.Lng = loc.lng();
      } catch (e) {
        console.log(e);
      } finally {
        loading.value = false;
      }
    }
  }
);
defineExpose({
  validate,
  reset,
  location,
  getGeoLocation,
});
</script>
