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
    :commentable="true"
    saveButtonLabel="Save & continue"
    collectionName="Raids"
  >
    <q-tabs
      v-model="tab"
      class="text-teal"
      inline-label
      narrow-indicator
      v-if="raid?.id"
    >
      <q-tab name="form" icon="edit" label="Form" />
      <q-tab name="inventory" icon="map" label="Inventory" />
      <q-tab name="report" icon="book" label="Report" />
    </q-tabs>
    <q-tab-panels v-model="tab" vertical animated>
      <q-tab-panel name="form">
        <RaidForm ref="form" :model="raid" :setModel="setDocument" />
      </q-tab-panel>
      <q-tab-panel name="inventory" style="overflow: auto">
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
      </q-tab-panel>
      <q-tab-panel name="report">
        <q-separator spaced inset vertical dark />
        <label class="text-"> Reports </label>
        <q-input
          label="Number of arrests *"
          v-model="raid.Suspects"
          type="number"
          :rules="[(val) => !!val || 'Number of arrests is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined=""
        />
        <q-separator spaced inset vertical dark />
        <label>Brief</label>
        <TextEditor
          :Text="raid.Details"
          :set-text="(v) => (raid.Details = v)"
          style="border: 2px solid orange"
          class="q-ml-xs"
        />
        <q-separator spaced inset vertical dark />
        <q-btn
          unelevated=""
          color="primary"
          icon="save"
          label="Save changes"
          :loading="loading"
          @click="saveChanges"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left"></q-spinner-hourglass>
            Wait...
          </template>
        </q-btn>
      </q-tab-panel>
    </q-tab-panels>
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
        <q-card-actions align="right" class="bg-teal">
          <q-btn
            flat
            :loading="loading"
            label="Add product"
            color="grey-1"
            @click="addProduct(product)"
            :disable="product.id !== undefined"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Wait...
            </template>
          </q-btn>
          <q-btn flat label="Cancel" color="grey-1" v-close-popup />
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
import { Notify, Dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, provide, ref, watch } from "vue";
import ProductForm from "src/components/forms/ProductForm.vue";
import FormCard from "src/components/FormCard.vue";
import RaidForm from "src/components/forms/RaidForm.vue";
import {
  onAddDocument,
  onDeleteDocument,
  update,
} from "src/composables/remote";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
import TextEditor from "src/components/TextEditor.vue";
import TableView from "src/components/TableView.vue";

//const RAID_OPTIONS = ["Hawkers raid", "Investigative raid", "Mop up"];
const SEARCH_FIELDS = ["Title","CaseNumber"];

const tab = ref("form");
const form = ref(null);
const store = useDefaultStore();
const product = ref({});
const productPopupModel = ref(false);
const popupReadOnly = ref(false);
const updateFields = [];
const field = ref(1);
const productFormRef = ref(null);
const previewMap = ref(false);
const geoData = ref({});
const showPrevious = ref(false);
const hideSaveButton = ref(false);
const loading = ref(false);

const product_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
];

const raid = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const productsOnHold = computed({
  get: () => raid.value.ProductsOnHold || [],
  set: (v) => (raid.value.ProductsOnHold = v),
});
const productsEvacuated = computed({
  get: () => raid.value.ProductsEvacuated || [],
  set: (v) => (raid.value.ProductsEvacuated = v),
});

const location = ref(raid.value.Location);

const setDocument = (v) => (raid.value = v || {});

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

function onDocumentSaved() {
  showPrevious.value = true;
  tab.value = "inventory";
  //hideSaveButton.value = true;
}
function onPrevious() {
  tab.value = "form";
  showPrevious.value = false;
  //hideSaveButton.value = false;
}
function saveChanges() {
  let data = {
    Details: raid.value.Details,
    Suspects: raid.value.Suspects,
  };
  loading.value = true;
  update(raid.value.id, data, "Raids")
    .then(() => {
      Notify.create({
        title: "Success",
        message: "Update succeeded",
        color: "secondary",
        position: "right",
      });
    })
    .catch(() => {
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
}
async function addProduct(p) {
  const data = productFormRef.value.product;
  const _field = field.value === 1 ? "ProductsOnHold" : "ProductsEvacuated";
  loading.value = true;
  onAddDocument("Raids", raid.value.id, _field, data)
    .then(() => {
      productPopupModel.value = false;
      if (field.value === 1) {
        if (!raid.value.ProductsOnHold) raid.value.ProductsOnHold = [data];
        else raid.value.ProductsOnHold.push(data);
      } else {
        if (!raid.value.ProductsEvacuated)
          raid.value.ProductsEvacuated = [data];
        else raid.value.ProductsEvacuated.push(data);
      }
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
  /*if (raid.value?.id) {

  } else {
    if (field.value === 1) {
      if (!raid.value.ProductsOnHold) raid.value.ProductsOnHold = [data];
      else raid.value.ProductsOnHold.push(data);
    } else {
      if (!raid.value.ProductsEvacuated) raid.value.ProductsEvacuated = [data];
      else raid.value.ProductsEvacuated.push(data);
    }
  }*/
}
async function removeProduct(p, index, type) {
  const _field = field.value === 1 ? "ProductsOnHold" : "ProductsEvacuated";
  loading.value = true;
  onDeleteDocument("Raids", raid.value.id, _field, p)
    .then(() => {
      if (type === 1) {
        raid.value.ProductsOnHold.splice(index, 1);
      } else {
        raid.value.ProductsEvacuated.splice(index, 1);
      }
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
  /*if (raid.value?.id) {

  } else {
    if (type === 1) {
      raid.value.ProductsOnHold.splice(index, 1);
    } else {
      raid.value.ProductsEvacuated.splice(index, 1);
    }
  }*/
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

watch(
  () => raid.value?.State,
  (val) => {
    raid.value.City = null;
  }
);
watch(tab, (newValue) => {
  if (newValue === "form") {
    hideSaveButton.value = false;
  } else {
    hideSaveButton.value = true;
  }
});
watch(
  () => store.tabMoel,
  (newValue) => {
    if (newValue === "search") {
      tab.value = "edit";
    }
  }
);
provide("suspect", {});
provide("product", product);
provide("location", location);
provide("iconName", "hub");
provide("titleField", "title");
provide("secondTitle", "date");
//provide("collection", "Raids");
provide("searchFields", ["Title", "Location"]);

defineExpose({
  reset,
  validate,
  raid,
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
