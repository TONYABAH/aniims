<template>
 <q-dialog v-model="model" class="" full-height="" style="height: 75%">
    <q-card class="full-width" style="overflow: hidden">
      <q-card-section class="row items-center bg-teal text-white">
        <q-icon name="basket" color="white" />
        <q-toolbar-title> Product</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="reset" />
      </q-card-section>
      <q-card-section style="overflow: auto; height: calc(100% - 7rem)">
        <ProductForm :data="product" :setProduct="setProduct" />
      </q-card-section>
      <q-card-actions align="center" class="bg-teal">
        <q-btn
          flat
          label="Cancel"
          color="grey-1"
          v-close-popup
          @click="onCancel"
        />
        <q-btn
          flat
          label="Add"
          color="grey-1"
          v-close-popup
          @click="onAdd(product)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { computed, ref } from "vue";
import ProductForm from "./ProductForm.vue";

//const backend = useBackend()
const store = useDefaultStore();

const props = defineProps({
  popupModel: { type: Boolean, default: false },
  onChangeModel: Function,
  data: Object,
  readOnly: Boolean,
  onSave: Function,
  onDelete: Function,
  onAdd: Function,
});

const product = computed(props.data || {});

const model = computed({
  get: () => props.popupModel,
  set: (v) => props.onChangeModel(v),
});
function setProduct(p) {
  product.value = p;
}
function onCancel() {
  product.value = {};
}
defineExpose({
  setProduct,
});
</script>
