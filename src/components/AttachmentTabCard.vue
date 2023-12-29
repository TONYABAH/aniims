<template>
  <q-card flat class="my-card bg-transparent">
    <q-toolbar>
      <q-icon name="attachment" size="sm" class="q-mr-md" />
      <span class="text-h6"> {{ store.currentCollection }} / Attachments</span>
    </q-toolbar>
    <q-card-section>
      <q-tabs
        v-model="attachmentTab"
        class="text-teal"
        shrink=""
        narrow-indicator=""
        outside-arrows=""
        active-bg-color="teal-2"
      >
        <q-tab name="documents" label="Documents" />
        <q-tab name="images" label="Images" />
        <q-tab name="videos" label="Videos" />
      </q-tabs>
      <q-tab-panels v-model="attachmentTab" animated>
        <q-tab-panel name="documents">
          <TableView
            :editable="false"
            :deletable="true"
            :data="attachedDocuments"
            :columns="document_columns"
            :onAddItem="() => addAttachment('doc')"
            :onRemoveItem="deleteAttachment"
            :onEditItem="onViewDocument"
            :onViewItem="onViewDocument"
            v-if="store.currentDocument?.id"
          />
        </q-tab-panel>
        <q-tab-panel name="images">
          <TableView
            :editable="false"
            :deletable="true"
            :data="attachedImages"
            :columns="document_columns"
            :onAddItem="() => addAttachment('image')"
            :onRemoveItem="deleteAttachment"
            :onEditItem="onViewDocument"
            :onViewItem="onViewDocument"
            v-if="store.currentDocument?.id"
          />
        </q-tab-panel>
        <q-tab-panel name="videos">
          <TableView
            :editable="false"
            :deletable="true"
            :data="attachedVideos"
            :columns="document_columns"
            :onAddItem="() => addAttachment('mp4')"
            :onRemoveItem="deleteAttachment"
            :onEditItem="onViewDocument"
            :onViewItem="onViewDocument"
            v-if="store.currentDocument?.id"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <FileViewerDialog
      :docTitle="docTitle"
      :fileSource="fileSource"
      :model="fileViewerDialogModel"
      :set-model="(v) => (fileViewerDialogModel = v)"
    />
    <UploadDialog
      v-on:doc-uploaded="onDocumentUploaded"
      :accept="accept"
      :model="dialogModel"
      :set-model="setDialogModel"
      title=""
    />
  </q-card>
</template>
<script setup>
import { useDefaultStore } from "src/stores/store";
import { Notify, Dialog } from "quasar";
import { ref, computed, defineAsyncComponent } from "vue";
import { getStorage, ref as reference, getDownloadURL } from "firebase/storage";
import {
  onAddAttachment,
  onDeleteAttachment,
  getStorageFolder,
} from "src/composables/remote";

const TableView = defineAsyncComponent(() =>
  import("src/components/TableView.vue")
);
const FileViewerDialog = defineAsyncComponent(() =>
  import("src/components/FileViewerDialog.vue")
);
const UploadDialog = defineAsyncComponent(() =>
  import("src/components/UploadDialog.vue")
);
const store = useDefaultStore();
const dialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const fileSource = ref("");
const docTitle = ref("");
const accept = ref(".pdf, .jpg, .jpeg, .png, .mp4");
const attachmentTab = ref("documents");
const attachedDocuments = computed(() => {
  return store.currentDocument?.Attachments?.filter(
    (f) => f.Type.indexOf("application/") > -1
  );
});
const attachedImages = computed(() => {
  return store.currentDocument?.Attachments?.filter((f) =>
    f.Type.match(/image\//)
  );
});
const attachedVideos = computed(() => {
  return store.currentDocument?.Attachments?.filter((f) =>
    f.Type.match(/video\//)
  );
});
const document_columns = [
  { name: "Title", field: "Title", label: "Title", align: "left" },
];

const currentDocument = computed({
  get: () => store.currentDocument || {},
  set: (v) => {
    store.currentDocument = v;
  },
});

function setDialogModel(val) {
  dialogModel.value = val;
}
function addAttachment(type) {
  if (type === "image") accept.value = ".jpg, .jpeg, .png";
  else if (type === "mp4") accept.value = ".mp4";
  else accept.value = ".pdf, .xls, .xlsx";
  dialogModel.value = true;
}
function deleteAttachment(d) {
  Dialog.create({
    noBackdropDismiss: true,
    title: "Delete file",
    message: "Do you want to delete " + d.Title + "?",

    ok: "Yes Delete",
    cancel: true,
  }).onOk(() => {
    onDeleteAttachment(store.currentCollection, currentDocument.value.id, d)
      .then(() => {
        const index = currentDocument.value.Attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        currentDocument.value.Attachments.splice(index, 1);
      })
      .catch((error) => {
        console.log(error);
        Notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  });
}
async function onEditDocument(d) {
  const storage = getStorage();
  let folder = getStorageFolder(d.Type);
  //const path = "http://localhost:3000/upload/" + d.id;
  const url = await getDownloadURL(reference(storage, folder + d.id));
  fileSource.value = url;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
async function onViewDocument(d) {
  const storage = getStorage();
  let folder = getStorageFolder(d.Type);
  //const path = "http://localhost:3000/upload/" + d.id;
  const url = await getDownloadURL(reference(storage, folder + d.id));
  fileSource.value = url;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
function onDocumentUploaded(doc) {
  currentDocument.value.Attachments
    ? currentDocument.value.Attachments.push(doc)
    : (currentDocument.value.Attachments = [doc]);
  if (currentDocument.value.id) {
    onAddAttachment(store.currentCollection, currentDocument.value.id, doc)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        Notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  }
}
</script>
