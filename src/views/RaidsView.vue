<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <RaidForm :model="raid" :setModel="setDocument" />
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
  </FormCard>
</template>

<script setup>
//import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, provide, ref, watch } from "vue";
import ProductForm from "src/components/forms/ProductForm.vue";
//import TableView from "src/components/TableView.vue";
//import TextEditor from "src/components/TextEditor.vue";
import FormCard from "src/components/FormCard.vue";
import RaidForm from "src/components/forms/RaidForm.vue";
import { onAddDocument, onDeleteDocument } from "src/composables/remote";
import { useStates, useCities, useGeolocation } from "src/composables/use-fn";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
//import { useGeolocation } from "src/composables/use-fn";
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
const raid = ref({});
const unitFilter = ref();
const location = ref(raid.value.Location);
const states = useStates("Nigeria");
const cities = computed(() => useCities(raid.value.State));
const field = ref(1);
const productFormRef = ref(null);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});

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
