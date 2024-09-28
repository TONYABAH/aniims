<template>
  <q-form ref="form" class="q-gutter-md q-pt-md">
    <q-input
      v-model="destruction.application_no"
      label="Application Number"
      type="number"
      color=""
      name="applicationNumber"
      stack-label
      outlined
      :readonly="true"
      v-if="destruction.id"
    >
      <template v-slot:append>
        <q-btn
          flat
          no-caps
          unelevated
          color=""
          id="copy_btn"
          icon="content_copy"
          @click.stop="copyToClipboard(destruction.application_no)"
        >
        </q-btn>
      </template>
    </q-input>

    <q-input
      stack-label
      outlined
      label="Subject*"
      v-model="destruction.subject"
      type="text"
      :rules="[(val) => !!val || 'Subject is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      label="Type of destruction *"
      v-model="destruction.type"
      :options="destructionOptions"
      options-dense
      :rules="[(val) => !!val || 'Type of destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      stack-label
      outlined
    />
    <template
      v-if="destruction?.type === 'Private' || destruction?.type === 'Special'"
    >
      <q-input
        label="Destruction site address*"
        stack-label
        outlined
        v-model="destruction.site"
        type="text"
        :rules="[(val) => !!val || 'Type of destruction is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />

      <StateInput
        label="State *"
        v-model="destruction.state"
        options-dense=""
        outlined
        stack-label
        square=""
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />

      <CityInput
        label="City"
        v-model="destruction.city"
        :state="destruction.state || ''"
        options-dense=""
        outlined
        stack-label
        square=""
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
    </template>

    <q-select
      v-model="destruction.reasons"
      label="Reason(s) for description *"
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
      stack-label
      outlined=""
      multiple=""
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps">
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
      stack-label
      outlined
      v-model="destruction.other_reasons"
      type="text"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      label="Other reasons for destroying items *"
      v-if="destruction?.reasons?.includes('Other reasons')"
    />

    <q-input
      label="Product location address *"
      stack-label
      outlined
      v-model="destruction.product_address"
      type="text"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      label="Product types *"
      stack-label
      outlined=""
      v-model="destruction.product_categories"
      :options="store.productCategories"
      :rules="[(val) => !!val || 'Product type is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      multiple
      options-dense=""
      :use-chips="false"
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps">
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

    <q-select
      label="Destruction methods *"
      stack-label
      outlined=""
      v-model="destruction.methods"
      :options="store.destructionMetods"
      options-dense
      multiple
      :use-chips="false"
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps">
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
      label="Proposed destruction date *"
      stack-label
      outlined
      v-model="destruction.proposed_date"
      type="date"
      input-class="q-mt-sm"
      clearable=""
      clear-icon="clear"
    />

    <q-input
      label="Contact name *"
      v-model="destruction.contact_name"
      type="text"
      name="contact-name"
      :rules="[(val) => !!val || 'Name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      stack-label
      outlined
    />

    <q-input
      label="Contact email *"
      stack-label
      outlined
      v-model="destruction.contact_email"
      type="text"
      name="contact-email"
      :rules="[(val) => !!val || 'Email is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-input
      label="Contact phone *"
      stack-label
      outlined
      v-model="destruction.contact_phone"
      type="text"
      name="contact-phone"
      :rules="[(val) => !!val || 'Phone number is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
      label="Company name *"
      stack-label
      outlined
      v-model="destruction.coy_name"
      type="text"
      name="contact-phone"
      :rules="[(val) => !!val || 'Company name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
      label="Company address *"
      stack-label
      outlined
      v-model="destruction.coy_address"
      type="text"
      name="contact-phone"
      :rules="[(val) => !!val || 'Company address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <q-btn
        icon="map"
        flat
        :color="$q.dark.isActive ? 'white' : store.theme.color.normal"
        class="q-mr-xs"
        @click="onPreviewMap"
        v-if="destruction.coy_address"
      />
      <q-btn
        :color="$q.dark.isActive ? 'grey-8' : store.theme.color.light"
        unelevated=""
        label="Validate"
        :loading="loading"
        v-if="destruction.coy_address"
        @click="onValidateAddress(destruction.CoyAddress)"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Validating...
        </template>
      </q-btn>
    </q-input>
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
import { useGeolocation } from "src/composables/use-fn";
//import { simpleSearch } from "src/composables/searchProvider";
import { onDeleteAttachment } from "src/composables/remote";
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
//const collection = "Destructions";
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
        const index = destruction.value.attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        destruction.value.attachments.splice(index, 1);
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
    name: destruction.value.coy_address,
    data: [
      ["lat", "lng"],
      [destruction.value?.lat, destruction.value?.lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = destruction.value.coy_name
      ? destruction.value.coy_name + ", " + address
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
          destruction.value.coy_address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) destruction.value.country = country.long_name;
        if (state) destruction.value.state = state.long_name;
        if (city) {
          setTimeout(() => (destruction.value.city = city.long_name), 100);
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
  () => destruction.value.state,
  (val) => {
    destruction.value.city = null;
  }
);
defineExpose({
  reset,
  validate,
  data: destruction,
  searchFields,
  collection: "Destructions",
});

/*onMounted(() => {
  destruction.value.ApplicationYear = new Date().getFullYear();
  destruction.value.ContactName = store.user?.displayName;
  destruction.value.ContactPhone = store.user?.phoneNumber;
  destruction.value.ContactEmail = store.user?.email;
  destruction.value.uid = store.user?.uid;
  destruction.value.CoyName = store.company?.Name;
  destruction.value.CoyAddress = store.company?.Address;
  destruction.value.CoyEmail = store.company?.Email;
  destruction.value.CoyPhone = store.company?.Phone;
  destruction.value.CoyId = store.company?.id;
});*/
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
