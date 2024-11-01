<template>
  <q-form ref="form" class="q-gutter-sm">
    <div class="row">
      <div class="col col-xs-6 col-sm-6 col-md-6 col-lg-6">
        <q-select
          v-model="location.country"
          :options="[]"
          model-value="Nigeria"
          option-value="name"
          option-label="name"
          options-dense=""
          label="Country"
          outlined=""
          :disabled="true"
          stack-label=""
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <q-input
      v-model="location.name"
      label="Location name *"
      type="text"
      outlined=""
      stack-label=""
      :rules="[(val) => !!val || 'Name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      name="locationName"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      v-model="location.address"
      label="Location street address *"
      type="text"
      :rules="[(val) => !!val || 'Address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      multiline
      stack-label=""
    >
      <q-btn
        unelevated
        glossy
        color="teal"
        icon="map"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        :rules="[(val) => !!val || 'Address is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        name="locationAddress"
        :loading="loading"
        @click="onValidateAddress(location.address)"
        v-if="location.Address"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left"> Wait... </q-spinner-hourglass>
        </template>
      </q-btn>
    </q-input>
    <q-separator spaced inset vertical dark />
    <q-select
      v-model="location.state"
      label="Location State *"
      :options="states"
      options-dense=""
      outlined=""
      stack-label=""
      :rules="[(val) => !!val || 'Address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />

    <q-select
      v-model="location.city"
      label="Location City *"
      :options="cities"
      options-dense=""
      outlined=""
      stack-label=""
      :rules="[(val) => !!val || 'Address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 q-pr-xs">
        <q-input
          label="Latitude"
          v-model="location.lat"
          type="text"
          outlined=""
          stack-label=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6">
        <q-input
          label="Longitude"
          v-model="location.lng"
          type="text"
          outlined=""
          stack-label=""
        />
      </div>
    </div>
    <!--<CircularProgress :loading="loading" :size="140" />-->
    <q-separator spaced inset vertical dark />
    <q-expansion-item
      expand-separator
      icon="map"
      label="View Map"
      :caption="location.address"
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
  useGeolocation,
} from "src/composables/use-fn";
//import GoogleMapViewer from "../dashboard/GoogleMapViewer.vue";
import GoogleGeoViewer from "../dashboard/GoogleGeoViewer.vue";
//import { useGeolocation } from "src/composables/use-geocation";
import { Dialog, Notify } from "quasar";
//import CircularProgress from "src/components/CircularProgress.vue";

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
const cities = computed(() => useCities(location.value.state));
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
    [location.value?.Lat, location.value?.lng],
  ];
});
const validate = async () => await form.value?.validate(true);
function reset() {
  form.value?.resetValidation();
}

const onValidateAddress = async (address) => {
  if (!location.value.Name || !location.value.address) {
    Notify.create({
      title: "Validation error",
      message:
        "Please fill <strong>Name</strong> and <strong>Address</strong> of the place",
      html: true,
      color: "red",
      icon: "error",
      position: "bottom",
    });
    return false;
  }
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = location.value.name
      ? location.value.Name + ", " + address
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
          location.value.Lat = lat;
          location.value.Lng = lng;
        }
        if (data.includes("address")) {
          location.value.address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) location.value.Country = country.long_name;
        if (state) location.value.State = state.long_name;
        if (city) {
          setTimeout(() => (location.value.City = city.long_name), 100);
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
  () => location.value.state,
  () => {
    if (location.value.city) location.value.city = null;
  }
);

defineExpose({
  validate,
  reset,
  location,
});
</script>
