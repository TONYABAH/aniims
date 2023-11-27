<template>
  <q-card flat class="my-card bg-transparent">
    <q-form ref="form" class="q-gutter-sm">
      <q-separator spaced inset vertical dark />
      <label v-if="complaint.id">Complaint ID *</label>
      <q-input
        v-model="complaint.id"
        type="text"
        outlined
        square
        readonly=""
        v-if="complaint.id"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            no-caps
            unelevated
            color="secondary"
            id="copy_btn"
            @click="copyToClipboard(complaint.id)"
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
      <label>Mail ID</label>
      <q-input v-model="complaint.MailId" type="text" outlined square />
      <q-separator spaced inset vertical dark />
      <label>Complaint title *</label>
      <q-input
        outlined
        square
        v-model="complaint.Title"
        type="text"
        :rules="[(val) => !!val || 'Title is required']"
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
            @click="copyToClipboard(complaint.Title)"
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
      <label>Contact name *</label>
      <q-input
        v-model="complaint.Source"
        type="text"
        :rules="[(val) => !!val || 'Source is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square
      />
      <q-separator spaced inset vertical dark />
      <label>Contact phone *</label>
      <q-input
        v-model="complaint.Phone"
        type="text"
        hide-bottom-space=""
        outlined
        square
        :rules="[(val) => !!val || 'Address is required']"
        lazy-rules="ondemand"
      />
      <q-separator spaced inset vertical dark />
      <label>Contact email</label>
      <q-input
        v-model="complaint.Email"
        type="email"
        label="Contact email address"
        hide-bottom-space=""
        outlined
        square
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            no-caps
            unelevated
            color="secondary"
            id="copy_btn"
            @click="copyToClipboard(complaint.Email)"
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
      <div class="row q-col-gutter-sm">
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6"></div>
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6"></div>
      </div>
      <q-separator spaced inset vertical dark />
      <label>Contact address</label>
      <q-input
        v-model="complaint.Address"
        type="text"
        hide-bottom-space=""
        outlined
        square
      />
      <q-separator spaced inset vertical dark />
      <label>Company name</label>
      <q-input outlined square v-model="complaint.CoyName" type="text" />
      <q-separator spaced inset vertical dark />
      <label>Company address</label>
      <q-input outlined square v-model="complaint.CoyAddress" type="text" />
      <q-separator spaced inset vertical dark />
      <label>Company email</label>
      <q-input outlined square v-model="complaint.CoyEmail" type="text" />
      <q-separator spaced inset vertical dark />
      <label>Company phone</label>
      <q-input outlined square v-model="complaint.CoyPhone" type="text" />

      <div class="q-pl-xs">
        <label
          >Give short details of your complaint
          <q-space />
          <!--<TextEditor
            :Text="complaint.Details"
            :set-text="(v) => (complaint.Details = v)"
            style="border: 4px solid orange"
          />-->
          <textarea
            v-model="complaint.Details"
            rows="5"
            style="border: 4px solid orange"
            class="full-width"
          ></textarea>
        </label>
      </div>
      <template v-if="complaint">
        <TableView
          :data="locations"
          :columns="tableColumns"
          title="Where are the locations?"
          :onAddItem="showAddLocation"
          :onEditItem="showEditLocation"
          :onViewItem="showViewLocation"
          :onRemoveItem="removeLocation"
          :deletable="true"
          :editable="false"
        />

        <q-separator spaced inset vertical dark />
        <label>Attach application letter (pdf)</label>
        <TableView
          :editable="false"
          :deletable="true"
          :data="attachments"
          :columns="document_columns"
          :onAddItem="onAttachLetter"
          :onRemoveItem="onRemoveAttachment"
          :onEditItem="onEditAttachment"
          :onViewItem="onViewAttachment"
        />
      </template>
    </q-form>
  </q-card>
  <q-dialog v-model="locationPopupModel">
    <q-card>
      <q-card-section class="row items-center bg-teal text-grey-1">
        <q-icon name="location" color="white" />
        <q-toolbar-title> Location</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="reset" />
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="width: 400px; height: 280px">
          <LocationForm :data="location" :setLocation="setLocation" />
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Send" color="primary" @click="addLocation" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <FileViewerDialog
    :docTitle="docTitle"
    :fileSource="fileSource"
    :model="fileViewerDialogModel"
    :set-model="(v) => (fileViewerDialogModel = v)"
  />
  <UploadDialog
    :accept="fileTypes"
    v-on:doc-uploaded="onAttachmentUploaded"
    title="Application Letter"
    :model="uploadDialogModel"
    :set-model="(v) => (uploadDialogModel = v)"
  />
</template>

<script setup>
import { Notify, Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, unref, ref, watch, provide } from "vue";
import LocationForm from "src/components/forms/LocationForm.vue";
import TableView from "src/components/TableView.vue";
import { onAddDocument, onDeleteDocument } from "src/composables/remote";
import FileViewerDialog from "src/components/FileViewerDialog.vue";
import UploadDialog from "src/components/UploadDialog.vue";
import { onAddAttachment, onDeleteAttachment } from "../composables/remote";
import Clipboard from "src/utils/clipboard.js";

//const $q = useQuasar();
const uploadDialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const document_columns = [
  { name: "name", field: "Name", label: "Name", align: "left" },
  { name: "title", field: "Title", label: "Caption", align: "left" },
  // { name: "id", field: "id", label: "ID", align: "left" },
];
const tableColumns = [
  {
    name: "Address",
    label: "Address",
    field: "Address",
    title: "Address",
    align: "left",
  },
];

const searchFields = ["Title", "CoyName"];
const props = defineProps({
  data: Object,
  setData: Function,
});
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const docTitle = ref("");
const fileSource = ref("");
const store = useDefaultStore();
const fileTypes = ref("");
const form = ref(null);
const locationPopupModel = ref(false);
const location = ref({});
//const _complaint = ref(props.data);
const complaint = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});
const newAttachments = ref([]);
const locations = computed({
  get: () => complaint.value.Locations || [],
  set: (v) => (complaint.value.Locations = v),
});
const attachments = computed({
  get: () => complaint.value.Attachments || [],
  set: (v) => (complaint.value.Attachments = v),
});
const setLocation = (l) => (lLocation.value = l);

function reset() {
  form.value?.resetValidation();
  newAttachments.value.forEach(async (d) => {
    await onDeleteAttachment("Complaints", complaint.value?.id, d)
      .then(() => {
        const index = complaint.value.Attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        complaint.value.Attachments.splice(index, 1);
        const index2 = newAttachments.value?.findIndex(
          (doc) => doc.id === d.id
        );
        newAttachments.value.splice(index2, 1);
      })
      .catch((error) => {
        Notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  });
}
const validate = async () => await form.value?.validate(true);
function showAddLocation(loc) {
  locationPopupModel.value = true;
}
function onAttachLetter() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".pdf";
  //store.documentDialogModel = true;
  uploadDialogModel.value = true;
}
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
async function addLocation(loc) {
  const data = Object.assign({}, location.value);
  if (complaint.value?.id) {
    await onAddDocument("Complaints", complaint.value.id, "Locations", data);
    locations.value.push(data);
  } else {
    if (!complaint.value?.Locations) complaint.value.Locations = [data];
    else complaint.value.Locations.push(data);
    //locations.value.push(data);
  }
  //location.value = {};
  locationPopupModel.value = false;
}
async function removeLocation(loc, index) {
  if (complaint.value?.id) {
    await onDeleteDocument(
      "Complaints",
      store.currentDocumentId,
      "Locations",
      loc
    );
  }
  locations.value?.splice(index, 1);
}
function showViewLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}
function showEditLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}

function onAttachmentUploaded(doc) {
  //const isLetter = doc.Type === "application/pdf" ? true : false;
  //console.log(doc);
  if (complaint.value.Attachments) complaint.value.Attachments.push(doc);
  else complaint.value.Attachments = [doc];
  newAttachments.value.push(doc);
  if (complaint.value.id) {
    onAddAttachment("Complaints", complaint.value.id, doc)
      .then(() => {
        Notify.create({
          textColor: "teal",
          message: "Document uploaded",
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
      });
  }
}

function onRemoveAttachment(d) {
  dialog
    .create({
      noBackdropDismiss: true,
      title: "Delete file",
      message: "Do you want to delete " + d.Title + "?",

      ok: "Yes Delete",
      cancel: true,
    })
    .onOk(() => {
      onDeleteAttachment("Complaints", complaint.value.id, d)
        .then(() => {
          const index = complaint.value.Attachments?.findIndex(
            (doc) => doc.id === d.id
          );
          complaint.value.Attachments.splice(index, 1);
          const index2 = newAttachments.value?.findIndex(
            (doc) => doc.id === d.id
          );
          newAttachments.value.splice(index2, 1);
        })
        .catch((error) => {
          Notify.create({
            textColor: "red",
            message: error.message,
            icon: "error",
            iconColor: "red",
          });
        });
    });
}
async function onEditAttachment(d) {
  //const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
async function onViewAttachment(d) {
  //const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}

/*watch(
  complaint,
  (val) => {
    if (val && !complaint.value.Source) {
    }
  },
  { immediate: true }
);*/

onMounted(async () => {
  if (!complaint.value?.Locations) {
    //complaint.value.Locations = [];
  }
  if (!complaint.value?.Attachments) {
    //complaint.value.Attachments = [];
  }
  complaint.value.Source = store.user?.displayName;
  complaint.value.Phone = store.user?.phoneNumber;
  complaint.value.Email = store.user?.email;
  complaint.value.uid = store.user?.uid;
  complaint.value.CoyName = store.company?.Name;
  complaint.value.CoyAddress = store.company?.Address;
  complaint.value.CoyEmail = store.company?.Email;
  complaint.value.CoyPhone = store.company?.Phone;
  complaint.value.CoyId = store.company?.id;
  complaint.value.ApplicationYear = new Date().getFullYear();
  provide("location", location);
  provide("locations", complaint.value?.Locations);
  //complaint.value = store.currentDocument || {};
});

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
</script>
