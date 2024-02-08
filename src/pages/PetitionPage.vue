<template>
  <q-tab-panels
    v-model="tab"
    animated
    vertical=""
    transition-next="scale"
    transition-prev="scale"
    style="overflow: auto; height: calc(100vh - 20px); padding: 0"
  >
    <q-tab-panel name="form" style="padding: 4px">
      <q-card
        class="bg-grey-1 shadow-22"
        :class="$q.screen.lt.sm ? '' : 'q-mx-xl q-mb-xl'"
      >
        <q-toolbar class="bg-cyan-7 text-white">
          <q-btn fab dense color="" icon="home" unelevated="" @click="goHome" />
          <q-toolbar-title> Petition Form </q-toolbar-title>
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>

        <q-card-section :class="$q.screen.lt.sm ? '' : 'q-px-xl'">
          <ComplaintForm ref="form" :data="complaint" :set-data="setData" />
        </q-card-section>
        <q-card-actions
          :class="$q.screen.lt.sm ? '' : 'q-px-xl'"
          class="bg-cyan-8-"
          :align="$q.screen.lt.sm ? 'center' : 'right'"
        >
          <q-btn
            push
            unelevated=""
            padding="md"
            color="negative"
            icon="close"
            title="Clear"
            label="Clear"
            class="q-my-sm"
            @click="cancel"
          />
          <q-btn
            push=""
            unelevated=""
            padding="md"
            label="Save & continue"
            icon-right="arrow_right"
            color="secondary"
            :loading="loading"
            class="q-my-sm"
            @click="submit"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Saving...
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="attachment" style="padding: 0">
      <q-card flat :class="$q.screen.lt.sm ? '' : 'q-px-xl q-pb-xl'">
        <q-card-section>
          <div class="text-h6 text-secondary text-bold text-uppercase">
            Attach documents
          </div>
          <q-separator spaced inset vertical dark />
          <label>Attach PDF</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="pdf"
            :columns="document_columns"
            :onAddItem="onAttachLetter"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
          <q-separator spaced inset vertical dark />
          <label>Attach Images</label>
          <TableView
            :editable="false"
            :deletable="true"
            :data="images"
            :columns="document_columns"
            :onAddItem="onAttachImage"
            :onRemoveItem="onRemoveAttachment"
            :onEditItem="onEditAttachment"
            :onViewItem="onViewAttachment"
          />
        </q-card-section>
        <q-card-section>
          <FileViewerDialog
            :docTitle="docTitle"
            :fileSource="fileSource"
            :model="fileViewerDialogModel"
            :set-model="(v) => (fileViewerDialogModel = v)"
          />
          <UploadDialog
            :accept="fileTypes"
            v-on:doc-uploaded="onAttachmentUploaded"
            :title="uploadTitle"
            :model="uploadDialogModel"
            :set-model="(v) => (uploadDialogModel = v)"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            push=""
            unelevated=""
            padding="md"
            label="Previous"
            color="negative"
            icon="arrow_back"
            class="q-my-sm"
            @click="goBack"
          />
          <q-btn
            push=""
            unelevated=""
            padding="md"
            label="Done"
            color="secondary"
            icon="check"
            class="q-my-sm"
            @click="done"
          />
        </q-card-actions>
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="done" align="center" style="padding: 0">
      <q-card flat :class="$q.screen.lt.sm ? '' : 'q-px-xl q-pb-xl'">
        <q-card-section>
          <q-avatar
            size="124px"
            font-size="96px"
            color="teal"
            text-color="white"
            icon="check"
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-teal">
            Thank you for submiting a complaint.
          </div>
          <div class="text-h6">
            Please check your email or phone line for feedback
          </div>
          <q-separator spaced inset vertical dark />
          <div class="text-subheading2">Aniims&trade; Team</div>
        </q-card-section>
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch, onBeforeMount } from "vue";
import { Notify, Dialog } from "quasar";
import ComplaintForm from "src/components/forms/ComplaintForm.vue";
import FileViewerDialog from "src/components/FileViewerDialog.vue";
import UploadDialog from "src/components/UploadDialog.vue";
import TableView from "src/components/TableView.vue";
import {
  //onAddDocument,
  //onDeleteDocument,
  // update,
  onAddAttachment,
  onDeleteAttachment,
  create,
} from "src/composables/remote";

const document_columns = [
  { name: "name", field: "Name", label: "Name", align: "left" },
  { name: "title", field: "Title", label: "Caption", align: "left" },
  // { name: "id", field: "id", label: "ID", align: "left" },
];

const router = useRouter();
const route = useRoute();
const store = useDefaultStore();
const tab = ref("form");
const form = ref(null);
const complaint = ref({});
const loading = ref(false);
const uploadDialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const newAttachments = ref([]);
const docTitle = ref("");
const fileSource = ref("");
const fileTypes = ref("");
const pendingEdits = ref(false);
const uploadTitle = ref("Application Letter");
const collectionName = "Complaints";
const attachments = computed({
  get: () => complaint.value.Attachments || [],
  set: (v) => (complaint.value.Attachments = v),
});
const images = computed(() =>
  attachments.value.filter((item) => item.Type.indexOf("image/") === 0)
);
const pdf = computed(() =>
  attachments.value.filter((item) => item.Type.indexOf("application/pdf") === 0)
);
const setData = (v) => (complaint.value = v);
let id = route.hash ? route.hash.substring(1) : 0;

function goHome() {
  //return (window.location.href = "/");
  if (pendingEdits.value) {
    var dl = Dialog.create({
      title: "Going away",
      message: "Do you want to discard changes?",
      ok: {
        label: "Yes, Discard",
        color: "negative",
      },
      cancel: {
        label: "No",
        color: "secondary",
      },
    });
    dl.onOk(() => router.push("/"));
  } else {
    //window.location.href = "/";
    router.push("/");
  }
}
function cancel() {
  if (pendingEdits.value) {
    var dl = Dialog.create({
      title: "Cancel edits",
      message: "Do you want to discard changes?",
      ok: {
        label: "Yes, Discard",
        color: "negative",
      },
      cancel: {
        label: "No",
        color: "secondary",
      },
    });
    dl.onOk(() => {
      setData({});
      form.value?.reset();
    });
  } else {
    setData({});
    form.value?.reset();
  }
}
function done() {
  tab.value = "done";
}
function goBack() {
  tab.value = "form";
}
async function submit() {
  const valid = await form.value.validate();
  if (!valid) return;
  loading.value = true;
  create(complaint.value, "Complaints", ["Title"])
    .then((id) => {
      //console.log(id);
      //success.value = true;
      complaint.value.id = id;
      tab.value = "attachment";
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function onAttachLetter() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".pdf";
  uploadTitle.value = "Application Letter";
  uploadDialogModel.value = true;
}
function onAttachImage() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".jpg,.png";
  uploadTitle.value = "Photo";
  uploadDialogModel.value = true;
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
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
async function onViewAttachment(d) {
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
watch(
  complaint.value,
  (newVal) => {
    if (newVal) pendingEdits.value = true;
    else pendingEdits.value = false;
  },
  { immediate: false }
);
window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
});

onBeforeMount(async () => {
  let d = id > 0 ? await getById(id, collectionName) : null;
  complaint.value = d || {};
  if (!d) {
    complaint.value.ContactName = store.user.displayName;
    complaint.value.ContactPhone = store.user.phoneNumber;
    complaint.value.ContactEmail = store.user.email;
  }
  store.currentCollection = collectionName;
  store.currentDocument = complaint.value;
  //destruction.value.ApplicationYear = applicationYear.value;
});
</script>
