<template>
  <q-form ref="form" class="q-gutter-md">
    <q-select
      label="Reason for payment *"
      v-model="payment.item"
      :options="payment_options"
      options-dense=""
      option-value="label"
      option-label="label"
      :rules="[(val) => !!val || 'Reason for payment is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label
      :disable="payment.id !== undefined"
    />
    <q-input
      v-if="payment.item?.label?.indexOf('Destruction') === -1"
      label="Case number *"
      outlined
      stack-label
      v-model="payment.case_number"
      type="number"
      :rules="[(val) => !!val || 'Case number is required']"
      lazy-rules="ondemand"
      hide-bottom-space
    />
    <q-input
      label="Invoice Number (payment advice) *"
      outlined
      stack-label
      v-model="payment.invoice_id"
      type="text"
      :rules="[(val) => !!val || 'Invoice number is required']"
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
          @click="copyToClipboard(payment.invoice_id)"
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

    <q-input
      v-if="payment?.id"
      label="Receipt Number *"
      outlined
      stack-label
      v-model="payment.receipt_id"
      type="text"
      :rules="[(val) => !!val || 'Receipt number is required']"
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
          @click="copyToClipboard(payment.receipt_id)"
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
        <q-btn
          flat
          color="secondary"
          label="Update"
          :loading="loading"
          @click.stop="updateReceipt"
        />
      </template>
    </q-input>

    <q-input
      label="Remita Reference (RRR)"
      outlined
      stack-label
      v-model="payment.rrr"
      type="text"
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
          @click="copyToClipboard(payment.rrr)"
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
        <q-btn
          flat
          color="secondary"
          label="Update"
          :loading="loading"
          @click.stop="updateRRR"
        />
      </template>
    </q-input>

    <q-input
      label="Subject *"
      v-model="payment.subject"
      type="text"
      :rules="[(val) => !!val || 'Subject is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label=""
    />

    <q-input
      label="Payee Name *"
      v-model="payment.name"
      type="text"
      :rules="[(val) => !!val || 'Payee name is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label=""
    />

    <q-input
      label="Payee Email (optional)"
      v-model="payment.email"
      type="email"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label=""
    />

    <q-input
      label="Payee phone number (optional)"
      v-model="payment.phone"
      type="text"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label=""
    />

    <div class="row">
      <div class="col col-xs-6 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
        <q-input
          label="Amount *"
          v-model="payment.amount"
          type="number"
          :rules="[(val) => !!val || 'Amount is required']"
          lazy-rules="ondemand"
          hide-bottom-space
          outlined
          stack-label=""
        />
      </div>
      <div class="col col-xs-6 col-sm-6 col-md-6 col-lg-6">
        <q-select
          label="Currency *"
          v-model="payment.currency"
          options-dense=""
          :options="CURRENCIES"
          :rules="[(val) => !!val || 'Currency is required']"
          lazy-rules="ondemand"
          hide-bottom-space
          outlined
          stack-label=""
        />
      </div>
    </div>

    <StatusInput
      collection-name="Payments"
      :documentId="payment?.id"
      :status="payment?.status"
      :set-status="(v) => (payment.status = v)"
      :options="['Confirmed', 'Received', 'Closed']"
    />
    <q-toolbar :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-amber-2'">
      <q-checkbox
        :left-label="false"
        v-model="confirmed"
        :label="payment.confirmed ? 'Confirmed' : 'Not Confirmed'"
        color="secondary"
        size="xl"
        :class="payment.confirmed ? 'text-teal' : 'text-red'"
        :disable="!isAccountant"
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
        :loading="loading"
      />
    </q-toolbar>
  </q-form>
</template>

<script setup>
import { Dialog, Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { ref, computed, provide, watch } from "vue";
//import FormCard from "src/components/FormCard.vue";
import Clipboard from "src/utils/clipboard.js";
import { update } from "src/composables/remote";
import { simpleSearch } from "src/composables/searchProvider";
import StatusInput from "./StatusInput.vue";

const store = useDefaultStore();
const form = ref(null);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const loading = ref(false);

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

//const updateFields = [];
const payment = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
});
const confirmed = computed({
  get: () => payment.value.confirmed || false,
  set: (v) => (payment.value.confirmed = v),
});
//const setDocument = (v) => (payment.value = v);

const isAccountant = computed(() => store.user.claims.confirmpay === true);

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
  loading.value = true;
  update(payment.value.id, { confirmed: val }, "Payments")
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
    })
    .finally(() => {
      loading.value = false;
    });
}
function updateReceipt() {
  loading.value = true;
  update(payment.value.id, { receipt_id: payment.value.receipt_id }, "Payments")
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
    })
    .finally(() => {
      loading.value = false;
    });
}
function updateRRR() {
  loading.value = true;
  update(payment.value.id, { rrr: payment.value.rrr }, "Payments")
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
    })
    .finally(() => {
      loading.value = false;
    });
}

watch(
  () => payment.value?.case_number,
  (newValue) => {
    if (newValue) {
      simpleSearch("Investigations", {
        whereFilters: [["CaseNumber", "==", Number(newValue)]],
      })
        .then((list) => {
          if (list.length > 0) {
            payment.value.case_id = list[0].id;
          } else {
            payment.value.case_id = null;
          }
        })
        .catch((e) => {});
    } else {
      payment.value.case_id = null;
    }
    //update_fileNumber.value = newValue ? true : false;
  },
  { immediate: true }
);
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
