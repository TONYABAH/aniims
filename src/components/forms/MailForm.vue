<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setMail"
    :getDocument="getDocument"
  >
    <q-form ref="form" class="q-gutter-sm">
      <q-separator spaced inset vertical dark />
      <label v-if="mail.id">Mail ID *</label>
      <q-input
        v-model="mail.id"
        type="text"
        outlined
        square
        readonly=""
        v-if="mail.id"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            no-caps
            unelevated
            color="secondary"
            id="copy_btn"
            @click="copyToClipboard(mail.id)"
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
      <label>File number *</label>
      <q-input
        v-model="mail.FileNumber"
        type="text"
        color=""
        name="fileNumber"
        outlined
        square=""
      >
        <template v-slot:append>
          <q-btn
            v-if="update_fileNumber && mail.id"
            flat
            color="primary"
            label="Update"
            @click="updateFileNumber"
          />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Subject *</label>
      <q-input
        v-model="mail.Title"
        type="text"
        color=""
        name="title"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        :rules="[(val) => !!val || 'Subject is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
      />
      <q-separator spaced inset vertical dark />
      <label>Source name *</label>
      <q-input
        v-model="mail.Source"
        type="text"
        color=""
        name="source"
        :rules="[(val) => !!val || 'Source is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
      />
      <q-separator spaced inset vertical dark />
      <label>Source address *</label>
      <q-input
        v-model="mail.Address"
        type="text"
        color=""
        name="address"
        :rules="[(val) => !!val || 'Address is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
      />
      <div class="row q-col-gutter-xs">
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-separator spaced inset vertical dark />
          <label>Incoming date *</label>

          <q-input
            name="inDate"
            v-model="mail.InDate"
            type="date"
            clear-icon="clear"
            input-class="q-mt-md q-pb-md"
            :rules="[(val) => !!val || 'In coming date is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            outlined
            square=""
          />
        </div>
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-separator spaced inset vertical dark />
          <label>Outgoing date</label>
          <q-input
            name="outDate"
            v-model="mail.OutDate"
            type="date"
            clear-icon="clear"
            outlined
            square=""
            input-class="q-mt-md q-pb-md"
          >
            <template v-slot:append>
              <q-btn
                v-if="update_outdate && mail.id"
                flat
                color="primary"
                label="Update"
                @click="updateOutDate"
              />
            </template>
          </q-input>
        </div>
      </div>
    </q-form>
    <!--<q-toolbar class="q-mt-sm">
      <q-toolbar-title> </q-toolbar-title>
      <q-btn
        no-caps=""
        unelevated=""
        color="primary"
        icon="campaign"
        label="Generate Complaint"
        v-if="store.currentDocument?.id"
        @click="generateComplaint"
      />
    </q-toolbar>-->
  </FormCard>
</template>

<script setup>
import { Dialog as dialog } from "quasar";
import { ref, onMounted, watch, provide, unref } from "vue";
import FormCard from "src/components/FormCard.vue";
import { update } from "src/composables/remote";
import { useDefaultStore } from "src/stores/store";
import Clipboard from "src/utils/clipboard.js";

const store = useDefaultStore();
const mail = ref({});
const form = ref(null);
const update_fileNumber = ref(false);
const update_outdate = ref(false);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");

const setMail = (v) => (mail.value = unref(v));

const validate = async () => await form.value?.validate(true);

function getDocument() {
  return mail.value;
}
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
function updateFileNumber() {
  store.loading = true;
  update(mail.value.id, { FileNumber: mail.value.FileNumber }, "Mails")
    .then((d) => {
      const dl = dialog.create({
        title: "Success",
        message: "Update succeeded",
        ok: {
          color: "teal",
        },
      });
      setTimeout(() => {
        dl.hide();
      }, 1000);
    })
    .catch((e) => {
      dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}
function updateOutDate() {
  // send update file number field
  store.loading = true;
  update(mail.value.id, { OutDate: mail.value.OutDate }, "Mails")
    .then((d) => {
      const dl = dialog.create({
        title: "Success",
        message: "Update succeeded",
        ok: {
          color: "teal",
        },
      });
      setTimeout(() => {
        dl.hide();
      }, 1000);
    })
    .catch((e) => {
      dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}
function reset() {
  form.value?.resetValidation();
  //store.currentDocument = null;
  mail.value = {};
}

function generateComplaint() {}
watch(
  () => mail.value.FileNumber,
  (newValue) => {
    console.log(mail.value);
    update_fileNumber.value = newValue ? true : false;
  }
);
watch(
  () => mail.value.OutDate,
  (newValue) => {
    //console.log(newValue);
    update_outdate.value = newValue ? true : false;
  }
);

provide("iconName", "mail");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Mails");
provide("searchFields", ["Title", "Source", "Address"]);

onMounted(() => {
  //console.log(mail.value.fileNumber);
  store.loading = false;
});

defineExpose({ validate, reset });
</script>
<style></style>
