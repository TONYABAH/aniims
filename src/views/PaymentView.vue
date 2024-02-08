<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :hide-tabs="false"
    :commentable="true"
    :search-fields="searchFields"
    collectionName="Payments"
  >
    <PaymentForm ref="form" :model="payment" :setModel="setDocument" />
  </FormCard>
</template>

<script setup>
//import { Dialog, Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { ref, provide, computed } from "vue";
import FormCard from "src/components/FormCard.vue";
import PaymentForm from "src/components/forms/PaymentForm.vue";
//import Clipboard from "src/utils/clipboard.js";
//import { update } from "src/composables/remote";
const store = useDefaultStore();
const form = ref(null);
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  setEditable: Function,
});
const searchFields = ["InvoiceId", "ReceiptId", "CaseNumber", "Name"];
const updateFields = [];
//const payment = ref({});
const payment = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const setDocument = (v) => {
  payment.value = v || {};
};

function getDocument() {
  return payment.value;
}

function reset() {
  form.value?.resetValidation();
}
const validate = async () => {
  return await form.value?.validate(true);
};

provide("iconName", "payment");
provide("titleField", "Title");
provide("secondTitle", "Location");
//provide("collection", "Payments");
provide("searchFields", ["Title", "Location", "Reference"]);

defineExpose({
  reset,
  validate,
  payment,
});
</script>
<style>
.min-width {
  width: 380px;
}
</style>
