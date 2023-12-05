<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-separator spaced inset vertical dark />
    <label>Case Number</label>
    <q-input
      outlined
      filled
      v-model="payment.CaseNumber"
      type="number"
      lazy-rules="ondemand"
      hide-bottom-space=""
      style="max-width: 380px"
    />
    <q-separator spaced inset vertical dark />
    <label>Invoice Number (payment advice) *</label>
    <q-input
      outlined
      filled
      v-model="payment.InvoiceId"
      type="text"
      :rules="[(val) => !!val || 'RRR is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      style="max-width: 380px"
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color="secondary"
          id="copy_btn"
          @click="copyToClipboard(payment.InvoiceId)"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 3C6 1.34315 7.34315 0 9 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893L21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V17C22 18.6569 20.6569 20 19 20H18V21C18 22.6569 16.6569 24 15 24H5C3.34315 24 2 22.6569 2 21V7C2 5.34315 3.34315 4 5 4H6V3ZM6 6H5C4.44772 6 4 6.44772 4 7V21C4 21.5523 4.44772 22 5 22H15C15.5523 22 16 21.5523 16 21V20H9C7.34315 20 6 18.6569 6 17V6ZM9 2C8.44772 2 8 2.44772 8 3V17C8 17.5523 8.44771 18 9 18H19C19.5523 18 20 17.5523 20 17V9H16C14.3431 9 13 7.65685 13 6V2H9ZM15 3.41421L18.5858 7H16C15.4477 7 15 6.55228 15 6V3.41421Z"
              fill="teal"
            />
          </svg>
        </q-btn>
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Receipt Number</label>
    <q-input
      outlined
      filled
      v-model="payment.ReceiptId"
      type="text"
      :rules="[(val) => !!val || 'RRR is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color="secondary"
          id="copy_btn"
          @click="copyToClipboard(payment.ReceiptId)"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 3C6 1.34315 7.34315 0 9 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893L21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V17C22 18.6569 20.6569 20 19 20H18V21C18 22.6569 16.6569 24 15 24H5C3.34315 24 2 22.6569 2 21V7C2 5.34315 3.34315 4 5 4H6V3ZM6 6H5C4.44772 6 4 6.44772 4 7V21C4 21.5523 4.44772 22 5 22H15C15.5523 22 16 21.5523 16 21V20H9C7.34315 20 6 18.6569 6 17V6ZM9 2C8.44772 2 8 2.44772 8 3V17C8 17.5523 8.44771 18 9 18H19C19.5523 18 20 17.5523 20 17V9H16C14.3431 9 13 7.65685 13 6V2H9ZM15 3.41421L18.5858 7H16C15.4477 7 15 6.55228 15 6V3.41421Z"
              fill="teal"
            />
          </svg>
        </q-btn>
        <q-btn flat color="primary" label="Update" @click.stop="updateReceipt" />
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Remita Reference (RRR)</label>
    <q-input
      outlined
      filled
      v-model="payment.RRR"
      type="text"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          filled
          no-caps
          unelevated
          color="secondary"
          id="copy_btn"
          @click="copyToClipboard(payment.RRR)"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 3C6 1.34315 7.34315 0 9 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893L21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V17C22 18.6569 20.6569 20 19 20H18V21C18 22.6569 16.6569 24 15 24H5C3.34315 24 2 22.6569 2 21V7C2 5.34315 3.34315 4 5 4H6V3ZM6 6H5C4.44772 6 4 6.44772 4 7V21C4 21.5523 4.44772 22 5 22H15C15.5523 22 16 21.5523 16 21V20H9C7.34315 20 6 18.6569 6 17V6ZM9 2C8.44772 2 8 2.44772 8 3V17C8 17.5523 8.44771 18 9 18H19C19.5523 18 20 17.5523 20 17V9H16C14.3431 9 13 7.65685 13 6V2H9ZM15 3.41421L18.5858 7H16C15.4477 7 15 6.55228 15 6V3.41421Z"
              fill="teal"
            />
          </svg>
        </q-btn>
        <q-btn flat color="primary" label="Update" @click.stop="updateRRR" />
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Subject *</label>
    <q-input
      v-model="payment.Title"
      type="text"
      :rules="[(val) => !!val || 'Subject is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined=""
      filled
    />
    <q-separator spaced inset vertical dark />
    <label>Payee Name *</label>
    <q-input
      v-model="payment.Name"
      type="text"
      :rules="[(val) => !!val || 'Payee name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined=""
      filled
    />
    <q-separator spaced inset vertical dark />
    <label>Payee Email *</label>
    <q-input
      v-model="payment.Email"
      type="email"
      :rules="[(val) => !!val || 'Payee email is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined=""
      filled
    />
    <q-separator spaced inset vertical dark />
    <label>Payee phone number *</label>
    <q-input
      v-model="payment.Phone"
      type="text"
      :rules="[(val) => !!val || 'Payee phone number is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined=""
      filled
    />
    <div class="row">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>Reason for payment *</label>
        <q-select
          v-model="payment.Item"
          :options="payment_options"
          options-dense=""
          option-value="label"
          option-label="label"
          :rules="[(val) => !!val || 'Reason for payment is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined
          filled
        />
      </div>
      <div class="col col-xs-6 col-sm-4 col-md-4 col-lg-4 q-pr-xs">
        <q-separator spaced inset vertical dark />
        <label>Amount *</label>
        <q-input
          v-model="payment.Amount"
          type="number"
          :rules="[(val) => !!val || 'Amount is required']"
          lazy-rules="ondemand"
          hide-bottom-space
          outlined=""
          filled
        />
      </div>
      <div class="col col-xs-6 col-sm-2 col-md-2 col-lg-2">
        <q-separator spaced inset vertical dark />
        <label>Currency *</label>
        <q-select
          v-model="payment.Currency"
          options-dense=""
          :options="CURRENCIES"
          :rules="[(val) => !!val || 'Currency is required']"
          lazy-rules="ondemand"
          hide-bottom-space
          outlined=""
          filled
        />
      </div>
    </div>

    <q-separator spaced inset vertical dark />
    <q-toolbar :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-amber-2'">
      <q-checkbox
        :left-label="false"
        v-model="confirmed"
        :label="payment.Confirmed ? 'Confirmed' : 'Not Confirmed'"
        color="secondary"
        size="xl"
        :class="payment.Confirmed ? 'text-teal' : 'text-red'"
        disable=""
      />
      <q-space />
      <label>Confirmed?</label>
      <q-btn-toggle
        glossy=""
        v-model="confirmed"
        :toggle-color="confirmed ? 'teal' : 'red'"
        :disable="!isAccountant"
        :options="[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ]"
        :on-update:model-value="onConfirmPayment"
      />
    </q-toolbar>
  </q-form>
</template>

<script setup>
import { Dialog, Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { onMounted, ref, computed, provide } from "vue";
import FormCard from "src/components/FormCard.vue";
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
  model: Object,
  setModel: Function,
});

const updateFields = [];
const payment = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});
const confirmed = computed({
  get: () => payment.value.Confirmed || false,
  set: (v) => (payment.value.Confirmed = v),
});
const setDocument = (v) => (payment.value = v);

const isAccountant = computed(() => store.user.claims.confirmpay !== true);
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
        message: e.message,
        icon: "error",
        iconColor: "orange",
        color: "red",
      });
    });
}
function updateRRR() {
  update(payment.value.id, { RRR: payment.value.RRR }, "Payments")
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
