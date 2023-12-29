<template>
  <q-form ref="form" class="q-gutter-sm q-my-md">
    <label>Application Number</label>
    <q-input
      v-model="destruction.ApplicationNumber"
      type="number"
      color=""
      name="applicationNumber"
      filled
      :readonly="true"
    >
      <template v-slot:append>
        <!-- <q-btn
          flat
          color=""
          icon="search"
          @click.stop="search"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
          </template>
        </q-btn>-->
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color=""
          id="copy_btn"
          icon="content_copy"
          @click.stop="copyToClipboard(destruction.ApplicationNumber)"
        >
        </q-btn>
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Application title*</label>
    <q-input
      filled
      v-model="destruction.Title"
      type="text"
      :rules="[(val) => !!val || 'Application title is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <label>Type of destruction*</label>
    <q-select
      optionsDense=""
      v-model="destruction.Type"
      :options="destructionOptions"
      :rules="[(val) => !!val || 'Type of destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
    />
    <template
      v-if="destruction?.Type === 'Private' || destruction?.Type === 'Special'"
    >
      <q-separator spaced inset vertical dark />
      <label>Site of destruction *</label>
      <q-input
        filled
        v-model="destruction.Site"
        type="text"
        :rules="[(val) => !!val || 'Type of destruction is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>State *</label>
      <!--<q-select
        optionsDense=""
        v-model="destruction.State"
        :options="states"
        :rules="[(val) => !!val || 'State is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        filled
      />-->
      <StateInput
        v-model="destruction.State"
        options-dense=""
        outlined
        dense
        square=""
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>City *</label>
      <!--<q-select
        v-model="destruction.City"
        :options="cities"
        options-dense=""
        :rules="[(val) => !!val || 'City is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        filled=""
      />-->
      <CityInput
        v-model="destruction.City"
        :state="destruction.State || ''"
        options-dense=""
        outlined
        dense
        square=""
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
    </template>
    <q-separator spaced inset vertical dark />
    <label>Reason(s) for description *</label>
    <q-select
      v-model="destruction.Reasons"
      options-dense=""
      :options="[
        'Expired items',
        'Damaged items',
        'Defective items',
        'Counterfeit items',
        'Other reasons',
      ]"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled=""
      multiple=""
      emit-value
      map-options
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item dense v-bind="itemProps">
          <q-item-section thumbnail="">
            <q-checkbox
              left-label
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
              size="xs"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      filled
      v-model="destruction.OtherReasons"
      type="text"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      label="Other reasons for destroying items *"
      v-if="destruction?.Reasons?.includes('Other reasons')"
    />

    <q-separator spaced inset vertical dark />
    <!--<LocationForm  ref="locationForm" />-->
    <q-separator spaced inset vertical dark />
    <label>Product location address *</label>
    <q-input
      filled
      v-model="destruction.ProductAddress"
      type="text"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <label>Product types *</label>
    <q-select
      filled=""
      v-model="destruction.ProductCategories"
      :options="store.productCategories"
      :rules="[(val) => !!val || 'Product type is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      multiple
      emit-value
      map-options
      options-dense=""
      :use-chips="false"
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item dense v-bind="itemProps">
          <q-item-section thumbnail="">
            <q-checkbox
              left-label
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
              size="xs"
            />
            <!--<q-toggle
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />-->
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-separator spaced inset vertical dark />
    <label>Destruction methods *</label>
    <q-select
      filled=""
      v-model="destruction.Methods"
      :options="store.destructionMetods"
      multiple
      emit-value
      map-options
      options-=""
      options-dense=""
      :use-chips="false"
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item dense v-bind="itemProps">
          <q-item-section thumbnail="">
            <q-checkbox
              left-label
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
              size="xs"
            />
            <!--<q-toggle
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />-->
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-separator spaced inset vertical dark />
    <label>Proposed destruction date *</label>
    <q-input
      filled
      v-model="destruction.ProposedDate"
      type="date"
      input-class="q-mt-sm"
      clearable=""
      clear-icon="clear"
    />
    <q-separator spaced inset vertical dark />
    <label>Contact name *</label>
    <q-input
      v-model="destruction.ContactName"
      type="text"
      name="contact-name"
      :rules="[(val) => !!val || 'Name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      filled
    />
    <q-separator spaced inset vertical dark />
    <label>Contact email *</label>
    <q-input
      filled
      v-model="destruction.ContactEmail"
      type="text"
      name="contact-email"
      :rules="[(val) => !!val || 'Email is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <label>Contact phone *</label>
    <q-input
      filled
      v-model="destruction.ContactPhone"
      type="text"
      name="contact-phone"
      :rules="[(val) => !!val || 'Phone number is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-dialog v-model="previewMap" class="full-width">
      <q-card flat class="full-width">
        <GoogleGeoViewer :data="geoData.data" />
      </q-card>
    </q-dialog>
  </q-form>
</template>
<script setup>
import { Notify as notify, Dialog as dialog, debounce } from "quasar";
import { ref, watch, computed, onMounted } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useStates, useCities, useGeolocation } from "src/composables/use-fn";
import { simpleSearch } from "src/composables/searchProvider";
import { onAddAttachment, onDeleteAttachment } from "src/composables/remote";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import Clipboard from "src/utils/clipboard.js";
import StateInput from "src/components/forms/StateInput.vue";
import CityInput from "src/components/forms/CityInput.vue";

const geo = useGeolocation();
const props = defineProps({
  data: Object,
  setData: Function,
  //search: Function,
});

const searchFields = ["Title", "CoyName"];
const store = useDefaultStore();
const destructionOptions = ["Private", "Special", "General"];
const collection = "Destructions";
const form = ref(null);
const newAttachments = ref([]);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});
const clipboard = new Clipboard("#copy_btn");
//const _destruction = ref(props.data);
const destruction = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});
//const states = useStates("Nigeria");
//const cities = computed(() => useCities(destruction.value.State));

function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}

function reset() {
  form.value?.resetValidation();
  newAttachments.value.forEach(async (d) => {
    await onDeleteAttachment("Complaints", destruction.value?.id, d)
      .then(() => {
        const index = destruction.value.Attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        destruction.value.Attachments.splice(index, 1);
        const index2 = newAttachments.value?.findIndex(
          (doc) => doc.id === d.id
        );
        newAttachments.value.splice(index2, 1);
      })
      .catch((error) => {
        notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  });
}
const validate = async () => await form.value?.validate(true);

const onPreviewMap = () => {
  const data = {
    name: destruction.value.CoyAddress,
    data: [
      ["lat", "lng"],
      [destruction.value?.Lat, destruction.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = destruction.value.CoyName
      ? destruction.value.CoyName + ", " + address
      : address;
    const { addr, lat, lng, comp, country, state, city } =
      await geo.getLocation(_address);
    //console.log(Comp);
    dialog
      .create({
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
          destruction.value.Lat = lat;
          destruction.value.Lng = lng;
        }
        if (data.includes("address")) {
          destruction.value.CoyAddress = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) destruction.value.Country = country.long_name;
        if (state) destruction.value.State = state.long_name;
        if (city) {
          setTimeout(() => (destruction.value.City = city.long_name), 100);
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
    notify.create({
      title: "Error",
      message: e.message || e,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
//watch(destruction.value, (newValue) => {});
watch(
  () => destruction.value.State,
  (val) => {
    destruction.value.City = null;
  }
);
const search = debounce(async () => {
  const num = destruction.value.ApplicationNumber;
  if (num) {
    const whereFilters = [["ApplicationNumber", "==", Number(num)]];
    loading.value = true;
    simpleSearch("Destructions", { whereFilters })
      .then((docs) => {
        //console.log(docs);
        if (docs.length > 0) {
          destruction.value = docs[0];
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}, 500);
defineExpose({
  reset,
  validate,
  data: destruction,
  searchFields,
  collection: "Destructions",
});

onMounted(() => {
  /*destruction.value.ApplicationYear = new Date().getFullYear();
  destruction.value.ContactName = store.user?.displayName;
  destruction.value.ContactPhone = store.user?.phoneNumber;
  destruction.value.ContactEmail = store.user?.email;
  destruction.value.uid = store.user?.uid;
  destruction.value.CoyName = store.company?.Name;
  destruction.value.CoyAddress = store.company?.Address;
  destruction.value.CoyEmail = store.company?.Email;
  destruction.value.CoyPhone = store.company?.Phone;
  destruction.value.CoyId = store.company?.id;
  */
});
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
