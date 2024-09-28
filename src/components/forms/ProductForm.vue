<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-input
      dense

      v-model="product.name"
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

      v-model="product.manufacturer"
      type="text"
      label="Manufacturer"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense

      v-model="product.man_address"
      type="text"
      label="Manufacturer address"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      dense

      v-model="product.country"
      :options="countries"
      options-dense=""
      label="Country of origin"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      dense

      v-model="product.category"
      :options="categories"
      options-dense
      label="Category"
    />
    <q-separator spaced inset vertical dark />
    <q-select
      v-if="product.category === 'Pharmaceuticals'"
      v-model="product.Class"
      :options="pharm_class"
      options-dense=""
      label="Pharmacological class"
      dense
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense

      v-model="product.batch"
      type="text"
      label="Batch"
      :readonly="readOnly"
    />
    <q-input
      dense

      v-model="product.pack_size"
      type="text"
      label="Pack Size"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense

      v-model="product.nafdac_no"
      type="text"
      label="NAFDAC number"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <q-input
      dense

      v-model="product.quantity"
      type="text"
      label="Quantity"
      :readonly="readOnly"
    />
    <q-separator spaced inset vertical dark />
    <label>Manufaturing date</label>
    <q-input
      dense

      v-model="product.man_date"
      type="date"
      label=""
    />
    <q-separator spaced inset vertical dark />
    <label>Expiry date (Best Before)</label>
    <q-input dense  v-model="product.expiry_date" type="date" label="" />
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
