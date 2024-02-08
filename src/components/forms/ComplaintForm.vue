<template>
  <q-form ref="form" class="q-gutter-md">
    <!--<label>Complaint ID *</label>-->
    <q-input
      v-model="complaint.id"
      type="text"
      label="Complaint ID"
      outlined
      stack-label
      readonly=""
      v-if="complaint.id"
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color=""
          id="copy_btn0"
          icon="content_copy"
          @click.stop="(e) => copyToClipboard(e, complaint.id)"
        >
        </q-btn>
      </template>
    </q-input>
    <template
      v-if="$route.name === 'Complaints' || $route.name === 'Investigations'"
    >
      <q-input
        label="Mail ID"
        v-model="complaint.MailId"
        type="text"
        outlined
        stack-label
      >
        <template v-if="complaint.id && complaint.MailId">
          <q-btn
            :loading="loadingMailId"
            flat
            color="teal"
            unelevated
            push
            label="Update"
            @click.stop="updateMailId"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </template>
      </q-input>
    </template>

    <q-input
      label="Title *"
      outlined
      stack-label
      v-model="complaint.Title"
      type="text"
      :rules="[(val) => !!val || 'Title is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
    </q-input>
    <q-input
      label="Company name"
      outlined
      stack-label
      v-model="complaint.CoyName"
      type="text"
    />

    <q-input
      label="Address"
      outlined
      stack-label
      v-model="complaint.Address"
      type="text"
    >
      <!--<q-btn
        flat
        dense
        unelevated
        glossy
        color="teal"
        icon="map"
        @click="onPreviewMap"
        v-if="complaint.Lat && complaint.Lng"
      />
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(complaint.Address)"
        v-if="complaint.Address"
      />-->
    </q-input>
    <q-input
      v-model="complaint.Source"
      label="Contact name *"
      type="text"
      :rules="[(val) => !!val || 'Source is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label
    />
    <q-input
      v-model="complaint.Phone"
      label="Phone"
      type="text"
      outlined
      stack-label
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
      v-model="complaint.Email"
      label="Email"
      type="email"
      hide-bottom-space=""
      outlined
      stack-label
    >
    </q-input>

    <div class="q-pl-xs">
      <label
        >Give short details of your complaint
        <q-space />
        <textarea
          v-model="complaint.Details"
          rows="5"
          style="border: 4px solid orange"
          class="full-width"
          :class="$q.dark.isActive ? 'bg-grey-10 text-white' : ''"
        ></textarea>
      </label>
    </div>
    <StatusInput
      collection-name="Complaints"
      :documentId="complaint?.id"
      :status="complaint?.Status"
      :set-status="(v) => (complaint.Status = v)"
      :rules="[(val) => !!val || 'Status is required']"
      outlined
    />
  </q-form>
</template>

<script setup>
import { Notify, Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, onBeforeUnmount, provide, ref, watch } from "vue";
import { getById } from "src/composables/remote";
import Clipboard from "src/utils/clipboard.js";
import StatusInput from "./StatusInput.vue";

const searchFields = ["Title", "CoyName"];
const props = defineProps({
  data: Object,
  setData: Function,
});
const uploadDialogModel = ref(false);
const loading = ref(false);
const store = useDefaultStore();
const fileTypes = ref("");
const form = ref(null);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn0");
const loadingMailId = ref(false);

const complaint = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});
//const newAttachments = ref([]);

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);
function updateMailId() {
  loadingMailId.value = true;
  update(complaint.value.id, { MailId: complaint.value.MailId }, "Complaints")
    .then(() => {
      Notify.create({
        textColor: "teal",
        message: "Update success",
        icon: "error",
        iconColor: "teal",
        title: "Success",
      });
    })
    .catch((error) => {
      dialog.create({
        textColor: "red",
        message: error.message,
        icon: "error",
        iconColor: "red",
        title: "Error",
      });
    })
    .finally(() => (loadingMailId.value = false));
}

function onAttachLetter() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".pdf";
  //store.documentDialogModel = true;
  uploadDialogModel.value = true;
}

function copyToClipboard(e, val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
watch(
  () => complaint.value?.MailId,
  (newValue) => {
    if (newValue) {
      getById(newValue, "Mails")
        .then((doc) => {
          if (doc && !complaint.value?.Title) {
            complaint.value.Title = doc.Title;
          }
        })
        .catch((e) => {});
    } else {
      //mail.value.FileId = null;
    }
  }
  //{ immediate: true }
);
defineExpose({
  reset,
  validate,
  data: complaint,
  searchFields,
  collection: "Complaints",
});
provide("iconName", "campaign");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Complaints");
provide("searchFields", ["Title", "Source", "Address"]);
// defineExpose({ reset, save, add })
onMounted(async () => {
  //complaint.value.Source = store.user?.displayName;
  //complaint.value.Phone = store.user?.phoneNumber;
  //complaint.value.Email = store.user?.email;
  //complaint.value.uid = store.user?.uid;
  complaint.value.ApplicationYear = new Date().getFullYear();
});
</script>
