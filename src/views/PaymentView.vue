<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <PaymentForm :model="payment" :setModel="setDocument" />
  </FormCard>
</template>

<script setup>
import { Dialog, Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { onMounted, ref, computed, provide } from "vue";
import FormCard from "src/components/FormCard.vue";
import PaymentForm from "src/components/forms/PaymentForm.vue";
import Clipboard from "src/utils/clipboard.js";
import { update } from "src/composables/remote";

const store = useDefaultStore();
const form = ref(null);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const CURRENCIES = ref(["NGN", "USD", "EUR", "GBP"]);

const payment_options = [
  { label: "Laboratory Analysis", value: "280000.00" },
  { label: "Admin Charge", value: "1200000.00" },
  { label: "Destruction Service charge", value: "1200000.00" },
  { label: "Destruction Logistics", value: "1200000.00" },
];
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  setEditable: Function,
});

const updateFields = [];
const payment = ref({});
const confirmed = computed({
  get: () => payment.value.Confirmed || false,
  set: (v) => (payment.value.Confirmed = v),
});

const isAccountant = computed(() => store.user.claims.confirmpay !== true);
const setDocument = (v) => (payment.value = v);

function getDocument() {
  return payment.value;
}
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
function reset() {
  form.value?.resetValidation();
}
const validate = async () => {
  return await form.value?.validate(true);
};
function onConfirmPayment(val) {
  //payment.value.Confirmed = !payment.value.Confirmed;
  update(payment.value.id, { Confirmed: val }, "Payments")
    .then(() => {
      Notify.create({
        message: "Success",
        color: "secondary",
        icon: "check",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: e.message,
        icon: "error",
        iconColor: "orange",
        color: "red",
      });
    });
}
function updateReceipt() {
  update(payment.value.id, { ReceiptId: payment.value.ReceiptId }, "Payments")
    .then(() => {
      Notify.create({
        message: "Success",
        color: "secondary",
        icon: "check",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: e.message,
        icon: "error",
        iconColor: "orange",
        color: "red",
      });
    });
}
function updateRRR() {
  update(payment.value.id, { InvoiceId: payment.value.InvoiceId }, "Payments")
    .then(() => {
      Notify.create({
        message: "Success",
        color: "secondary",
        icon: "check",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: e.message,
        icon: "error",
        iconColor: "orange",
        color: "red",
      });
    });
}

provide("iconName", "payment");
provide("titleField", "Title");
provide("secondTitle", "Location");
provide("collection", "Payments");
provide("searchFields", ["Title", "Location", "Reference"]);

defineExpose({
  reset,
  validate,
});
</script>
<style>
.min-width {
  width: 380px;
}
</style>
