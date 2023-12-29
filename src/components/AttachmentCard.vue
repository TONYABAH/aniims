<template>
  <q-card flat class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : ''">
    <q-toolbar
      class="text-white q-pl-lg"
      :class="$q.dark.isActive ? 'bg-grey-9' : store.theme.bg.default"
    >
      <q-icon name="attachment" color="" />
      <q-toolbar-title> Attachments </q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <template v-if="true">
        <template v-if="pdf">
          <label>Attach application letter (pdf)</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="letters"
            :columns="document_columns"
            :onAddItem="attachLetter"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
          <q-separator spaced inset vertical dark />
        </template>
        <template v-if="excel">
          <label>Attach product list (Spreadsheet)</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="inventory"
            :columns="document_columns"
            :onAddItem="attachList"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
          <q-separator spaced inset vertical dark />
        </template>
        <template v-if="image">
          <label>Attach images (jpg, png)</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="images"
            :columns="document_columns"
            :onAddItem="attachImages"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
          <q-separator spaced inset vertical dark />
        </template>
        <template v-if="video">
          <label>Attach videos(mp4)</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="videos"
            :columns="document_columns"
            :onAddItem="attachVideos"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
        </template>

        <q-separator spaced inset vertical dark />
      </template>
    </q-card-section>
    <q-card-actions align="center" class="bg-">
      <q-space />
      <q-btn
        unelevated
        icon="arrow_left"
        label="Previous"
        :color="store.theme.color.normal"
        @click="previousTab"
      />
      <q-btn
        unelevated
        icon-right="arrow_right"
        label="Submit"
        class="q-mr-xs"
        :color="store.theme.color.normal"
        @click="submit"
      />
    </q-card-actions>

    <FileViewerDialog
      :docTitle="docTitle"
      :fileSource="fileSource"
      :model="fileViewerDialogModel"
      :set-model="(v) => (fileViewerDialogModel = v)"
    />
    <UploadDialog
      :accept="fileTypes"
      :model="uploadDialogModel"
      :set-model="(v) => (uploadDialogModel = v)"
      v-on:doc-uploaded="onAttachmentUploaded"
      :title="uploadTitle"
    />
  </q-card>
</template>
<script setup>
import { computed, ref } from "vue";
import { useDefaultStore } from "src/stores/store";
import { Notify, Dialog } from "quasar";
import TableView from "src/components/TableView.vue";
import FileViewerDialog from "src/components/FileViewerDialog.vue";
import UploadDialog from "src/components/UploadDialog.vue";
import { onAddAttachment, onDeleteAttachment } from "src/composables/remote";

const store = useDefaultStore();
const document_columns = [
  { name: "name", field: "Name", label: "Name", align: "left" },
  { name: "title", field: "Title", label: "Caption", align: "left" },
];
const fileTypes = ref("");
const docTitle = ref("");
const fileSource = ref("");
const newAttachments = ref([]);
const uploadDialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const collection = "Destructions";
const uploadTitle = ref("Attachment");
//const destruction = inject("destruction");
const props = defineProps({
  attachedDocuments: {
    type: Array,
    default: () => null,
  },
  nextTab: Function,
  previousTab: Function,
  addAttachment: Function,
  setAttachments: Function,
  removeAttachment: Function,
  documentId: Number,
  submit: Function,
  video: {
    type: Boolean,
    default: false,
  },
  image: {
    type: Boolean,
    default: true,
  },
  pdf: {
    type: Boolean,
    default: true,
  },
  excel: {
    type: Boolean,
    default: false,
  },
});
const attachments = computed({
  get: () => props.attachedDocuments,
  set: (v) => props.setAttachments(v),
});
const letters = computed({
  get: () =>
    attachments.value?.filter((f) => f.Type === "application/pdf") || [],
});
const inventory = computed({
  get: () => attachments.value?.filter((f) => f.Type.indexOf("xls") > -1) || [],
});
const images = computed({
  get: () =>
    attachments.value?.filter((f) => f.Type.indexOf("image/") > -1) || [],
});
const videos = computed({
  get: () =>
    attachments.value?.filter((f) => f.Type.indexOf("video/") > -1) || [],
});
function attachLetter() {
  fileTypes.value = ".pdf";
  uploadTitle.value = "Application Letter";
  uploadDialogModel.value = true;
}
function attachList() {
  fileTypes.value = [".xls", ".xlsx"].join(",");
  uploadTitle.value = "Inventory";
  uploadDialogModel.value = true;
}
function attachImages() {
  fileTypes.value = [".png", ".jpg"].join(",");
  uploadTitle.value = "Images";
  uploadDialogModel.value = true;
}
function attachVideos() {
  fileTypes.value = [".mp4"].join(",");
  uploadTitle.value = "Videos";
  uploadDialogModel.value = true;
}
function onAttachmentUploaded(doc) {
  attachments.value ? props.addAttachment(doc) : (attachments.value = doc);

  newAttachments.value.push(doc);

  if (props.documentId?.value) {
    onAddAttachment(collection, props.documentId.value, doc)
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
        Dialog.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
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
      onDeleteAttachment(collection, props.documentId.value, d)
        .then(() => {
          const index = attachments.value?.findIndex((doc) => doc.id === d.id);
          //props.attachments.value?.splice(index, 1);
          props.removeAttachment(index);
          const index2 = newAttachments.value?.findIndex(
            (doc) => doc.id === d.id
          );
          newAttachments.value.splice(index2, 1);
        })
        .catch((error) => {
          notify.create({
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
</script>
