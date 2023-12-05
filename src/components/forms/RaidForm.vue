<template>
  <q-form ref="form" class="q-gutter-sm" lazy-rules>
    <q-separator spaced inset vertical dark />
    <label>Case number *</label>
    <q-input
      v-model="raid.CaseNumber"
      type="text"
      color=""
      name="caseNumber"
      :rules="[(val) => !!val || 'Case number is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      filled
      style="max-width: 49%"
    />
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>Type of raid *</label>
        <q-select
          v-model="raid.Type"
          :options="RAID_OPTIONS"
          options-dense=""
          :rules="[(val) => !!val || 'Type of raid is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined
          filled
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical dark />
        <label>Date of raid *</label>
        <q-input
          v-model="raid.Date"
          type="date"
          input-class="q-mt-md q-pb-md"
          clear-icon="clear"
          :rules="[(val) => !!val || 'Date of raid is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined
          filled
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <label>Nature of offence *</label>
    <q-input
      v-model="raid.Title"
      type="text"
      :rules="[(val) => !!val || 'Offence is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      filled
    />
    <q-separator spaced inset vertical dark />
    <label>Raid location address *</label>
    <q-input
      v-model="raid.Address"
      type="text"
      outlined
      filled
      :rules="[(val) => !!val || 'Location address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(raid.Address)"
        v-if="raid.Address"
      />
      <template v-slot:prepend>
        <q-btn
          dense
          unelevated
          glossy
          color="teal"
          icon="map"
          @click="onPreviewMap"
          v-if="raid.Lat && raid.Lng"
        />
      </template>
    </q-input>
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>State *</label>
        <q-select
          v-model="raid.State"
          :options="states"
          options-dense=""
          outlined
          filled
          :rules="[(val) => !!val || 'State is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical dark />
        <label>City *</label>
        <q-select
          v-model="raid.City"
          :options="cities"
          options-dense=""
          outlined
          filled
          :bottom-slots="false"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
    </div>
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>Team members *</label>
        <q-select
          outlined
          filled
          v-model="raid.Team"
          :options="staffList"
          :rules="[(val) => !!val || 'Team is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          multiple
          emit-value
          map-options
          options-=""
          options-dense=""
          option-value="Name"
          option-label="Name"
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
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ opt.Name }} ({{ opt.Rank }})</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical dark />
        <label>Division filter</label>
        <q-select
          options-dense=""
          v-model="unitFilter"
          :options="store.units"
          option-label="Abbrev"
          option-value="Abbrev"
          outlined
          filled
          :clearable="true"
          clear-icon="close"
        />
      </div>
    </div>
    <q-separator spaced inset vertical dark />
    <label>Team leader *</label>
    <q-select
      outlined
      filled
      v-model="raid.TeamLead"
      :options="raid.Team"
      :rules="[(val) => !!val || 'Team Leader is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      :multiple="false"
      emit-value
      map-options
      options-=""
      options-dense=""
      option-value="Name"
      option-label="Name"
      :use-chips="false"
    />
    <q-separator spaced inset vertical dark />
    <label>IPO *</label>
    <q-select
      outlined
      filled
      v-model="raid.IPOs"
      :options="store.ipos"
      :rules="[(val) => !!val || 'IPO is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      multiple
      emit-value
      map-options
      options-=""
      options-dense=""
      option-value="Name"
      option-label="Name"
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
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt.Name }} ({{ opt.Rank }})</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>Number of Mopols *</label>
        <q-input
          outlined
          filled
          mask="number"
          v-model="raid.Mopols"
          type="number"
          :rules="[(val) => !!val || 'Number of Mopols is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-separator spaced inset vertical dark />
        <label>Number of arrests *</label>
        <q-input
          v-model="raid.Suspects"
          type="number"
          :rules="[(val) => !!val || 'Number of arrests is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined
          filled=""
        />
      </div>
    </div>

    <q-separator spaced inset vertical dark />
    <label>Division in Charge *</label>
    <q-select
      options-dense=""
      v-model="raid.Unit"
      :options="store.units"
      option-label="Abbrev"
      option-value="Abbrev"
      :rules="[(val) => !!val || 'Division is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      filled
    />

    <TableView
      :data="productsOnHold"
      :columns="product_columns"
      :onAddItem="() => showAddProduct(1)"
      :onRemoveItem="(p, i) => removeProduct(p, i, 1)"
      :onViewItem="(p, i) => showViewProduct(p, i, 1)"
      :deletable="true"
      :editable="false"
      title="Products on HOLD"
    />
    <TableView
      :data="productsEvacuated"
      :columns="product_columns"
      :onAddItem="() => showAddProduct(0)"
      :onRemoveItem="(p, i) => removeProduct(p, i, 0)"
      :onViewItem="(p, i) => showViewProduct(p, i, 0)"
      :deletable="true"
      :editable="false"
      title="Products Evacuated"
    />

    <q-separator spaced inset vertical dark />
    <label>Report (brief)</label>
    <TextEditor
      :Text="raid.Details"
      :set-text="(v) => (raid.Details = v)"
      style="border: 4px solid orange"
      class="full-width"
    />
    <q-dialog
      v-model="productPopupModel"
      class=""
      full-height=""
      style="height: 75%"
    >
      <q-card class="full-width" style="overflow: hidden">
        <q-card-section class="row items-center bg-teal text-white">
          <q-icon name="basket" color="white" />
          <q-toolbar-title> Product</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="reset" />
        </q-card-section>
        <q-card-section style="overflow: auto; height: calc(100% - 7rem)">
          <ProductForm
            ref="productFormRef"
            :data="product"
            :setProduct="setProduct"
          />
        </q-card-section>
        <q-card-actions align="center" class="bg-teal">
          <q-btn flat label="Cancel" color="grey-1" v-close-popup />
          <q-btn flat label="Add" color="grey-1" @click="addProduct(product)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="previewMap" class="full-width">
      <q-card flat class="full-width">
        <GoogleGeoViewer :data="geoData.data" />
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script setup>
//import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, provide, ref, watch } from "vue";
import ProductForm from "src/components/forms/ProductForm.vue";
import TableView from "src/components/TableView.vue";
import TextEditor from "src/components/TextEditor.vue";
import FormCard from "src/components/FormCard.vue";
import { onAddDocument, onDeleteDocument } from "src/composables/remote";
import { useStates, useCities } from "src/composables/address-use";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import { useGeolocation } from "src/composables/use-geocation";
import { Dialog, Notify } from "quasar";

const RAID_OPTIONS = ["Hawkers raid", "Investigative raid", "Mop up"];
//const $q = useQuasar();
const geo = useGeolocation();
const store = useDefaultStore();
const product = ref({});
const productPopupModel = ref(false);
const popupReadOnly = ref(false);
const form = ref(null);
const updateFields = [];

const unitFilter = ref();

const field = ref(1);
const productFormRef = ref(null);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});
const props = defineProps({
  model: Object,
  setModel: Function,
});
const raid = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});
const location = ref(raid.value.Location);
const states = useStates("Nigeria");
const cities = computed(() => useCities(raid.value.State));

const staffList = computed(() => {
  return store.staffList.filter((s) =>
    unitFilter.value ? s.Units?.includes(unitFilter.value.Abbrev) : s
  );
});
const productsOnHold = computed({
  get: () => raid.value.ProductsOnHold || [],
  set: (v) => (raid.value.ProductsOnHold = v),
});
const productsEvacuated = computed({
  get: () => raid.value.ProductsEvacuated || [],
  set: (v) => (raid.value.ProductsEvacuated = v),
});
const setDocument = (v) => (raid.value = v);

function getDocument() {
  return raid.value;
}
function reset() {
  form.value?.resetValidation();
}
function setProduct(p) {
  product.value = p;
}

const validate = async () => await form.value?.validate(true);

const product_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
];

async function addProduct(p) {
  const data = productFormRef.value.product;
  const _field = field.value === 1 ? "ProductsOnHold" : "ProducsEvacuated";
  if (raid.value?.id) {
    await onAddDocument("Raids", raid.value.id, _field, data);
  } else {
    if (field.value === 1) {
      if (!raid.value.ProductsOnHold) raid.value.ProductsOnHold = [data];
      else raid.value.ProductsOnHold.push(data);
    } else {
      if (!raid.value.ProductsEvacuated) raid.value.ProductsEvacuated = [data];
      else raid.value.ProductsEvacuated.push(data);
    }
  }
  productPopupModel.value = false;
}
async function removeProduct(p, index, type) {
  const _field = field.value === 1 ? "ProductsOnHold" : "ProducsEvacuated";
  if (raid.value?.id) {
    await onDeleteDocument("Raids", raid.value.id, _field, p);
  } else {
    if (type === 1) {
      raid.value.ProductsOnHold.splice(index, 1);
    } else {
      raid.value.ProductsEvacuated.splice(index, 1);
    }
  }
}
function showViewProduct(p, index, type) {
  field.value = type;
  product.value = p;
  productPopupModel.value = true;
  popupReadOnly.value = true;
}
function showAddProduct(type) {
  field.value = type;
  product.value = {};
  productPopupModel.value = true;
  popupReadOnly.value = false;
}

function showEditProduct(p, index, type) {
  field.value = type;
  product.value = p;
  productPopupModel.value = true;
  popupReadOnly.value = false;
}
const onPreviewMap = () => {
  const data = {
    name: raid.value.Address,
    data: [
      ["lat", "lng"],
      [raid.value?.Lat, raid.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = raid.value.Name ? raid.value.Name + ", " + address : address;
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
          raid.value.Lat = lat;
          raid.value.Lng = lng;
        }
        if (data.includes("address")) {
          raid.value.Address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) raid.value.Country = country.long_name;
        if (state) raid.value.State = state.long_name;
        if (city) {
          setTimeout(() => (raid.value.City = city.long_name), 100);
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
  () => raid.value.State,
  (val) => {
    raid.value.City = null;
  }
);

provide("suspect", {});
provide("product", product);
provide("location", location);
provide("iconName", "hub");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Raids");
provide("searchFields", ["Title", "Location"]);

defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  if (!raid.value.ProductsEvacuated) {
    raid.value.ProductsEvacuated = [];
  }
  if (!raid.value.ProductsOnHold) {
    raid.value.ProductsOnHold = [];
  }
  provide("product", product);
});
</script>
