<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-input
      dense
      filled
      v-model="product.Name"
      type="text"
      label="Product name"
      :readonly="readOnly"
      :rules="[required]"
      lazy-rules
      :bottom-slots="false"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense
      filled
      v-model="product.Manufacturer"
      type="text"
      label="Manufacturer"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense
      filled
      v-model="product.ManAddress"
      type="text"
      label="Manufacturer address"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      dense
      filled=""
      v-model="product.Country"
      :options="countries"
      options-dense=""
      label="Country of origin"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      dense
      filled
      v-model="product.Category"
      :options="categories"
      options-dense
      label="Category"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      v-if="product.Category === 'Pharmaceuticals'"
      v-model="product.Class"
      :options="pharm_class"
      options-dense=""
      label="Pharmacological class"
      filled=""
      dense
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense
      filled
      v-model="product.Batch"
      type="text"
      label="Batch"
      :readonly="readOnly"
    />
    <q-input
      dense
      filled
      v-model="product.PackSize"
      type="text"
      label="Pack Size"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense
      filled
      v-model="product.NAFDACNumber"
      type="text"
      label="NAFDAC number"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense
      filled
      v-model="product.Quantity"
      type="text"
      label="Quantity"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <label>Manufaturing date</label>
    <q-input
      dense
      filled
      v-model="product.ManufactureDate"
      type="date"
      label=""
    />
    <q-separator spaced inset vertical dark />
    <label>Expiry date (Best Before)</label>
    <q-input dense filled v-model="product.ExpiryDate" type="date" label="" />
    <!--
    <div class="row q-mt-xs">
      <label class="q-ml-sm"><i>Action on product</i></label>
      <div class="col col-xs-12">
        <q-radio v-model="product.Status" val="onhold" label="On Hold" />
        <q-radio v-model="product.Status" val="evacuated" label="Evacuated" />
        <q-radio v-model="product.Status" val="sampled" label="Sampled" />
      </div>
    </div>
    <hr />-->
  </q-form>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import _countries from "src/data/countries.json";

const form = ref(null);
const countries = computed(() => _countries.map((c) => c.name));
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
  setProduct: Function,
});
const categories = [
  "Food",
  "Water",
  "Beverages",
  "Pharmaceuticals",
  "Medical Devices",
  "Chemicals",
  "Cosmetics",
];
const pharm_class = [
  "Antibiotics",
  "Anticancer",
  "Antimalaria",
  "Antihelminthes",
  "Narcotics",
  "Psychtropics",
  "Sedative",
  "Neutraceuticals",
  "Others",
];
const _product = ref(Object.assign({}, props.data || {}));
const product = computed({
  get: () => _product.value,
  set: (v) => (_product.value = v),
});

function required(val) {
  return (val && val.length > 0) || "Required field";
}
function reset() {
  form.value.resetValidation();
}
const validate = async () => await form.value?.validate(true);

defineExpose({
  reset,
  product,
  validate,
});
</script>
