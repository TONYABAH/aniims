<template>
  <q-card
    flat
    square
    class="my-card"
    style="opacity: 0.85"
    :class="+$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
  >
    <div :class="$q.screen.gt.xs ? 'q-px-xl q-pb-xl q-pt-xs' : ''">
      <q-toolbar class="q-pb-sm">
        <q-tabs
          v-model="tab"
          narrow-indicator=""
          indicator-color=""
          inline-label=""
          dense
          align="left"
          no-caps=""
          mobile-arrows=""
          outside-arrows=""
          shrink=""
          active-bg-color=""
          class="q-pb-xs text-"
        >
          <!--<q-btn dense flat icon="house" to="/" />-->
          <q-tab
            name="edit"
            icon="edit"
            title="Edit"
            :label="$q.screen.lt.sm ? '' : 'Edit'"
            style="border-radius: 4px 4px 0 0"
          />

          <q-tab
            name="attachments"
            icon="attachment"
            title="attachments"
            :label="$q.screen.lt.sm ? '' : 'Attach'"
            style="border-radius: 4px 4px 0 0"
            v-if="isDocumentSaved"
          />
          <q-tab
            name="timeline"
            icon="timer"
            title="Timeline"
            :label="$q.screen.lt.sm ? '' : 'Timeline'"
            style="border-radius: 4px 4px 0 0"
            v-if="isDocumentSaved"
          />
          <q-tab
            name="minutes"
            icon="comment"
            title="Minute"
            :label="$q.screen.lt.sm ? '' : 'Minutes'"
            style="border-radius: 4px 4px 0 0"
            v-if="isDocumentSaved"
          />
        </q-tabs>
      </q-toolbar>
      <q-tab-panels
        :keep-alive="true"
        ref="tabPanelsRef"
        v-model="tab"
        animated
        style="padding: 0"
        class="bg-transparent"
      >
        <q-tab-panel name="edit" style="overflow: auto; padding-bottom: 80px">
          <q-card
            flat
            class="shadow-1"
            style="opacity: 0.99; border-radius: 2px"
          >
            <q-toolbar>
              <q-icon :name="iconName" size="sm" class="q-mr-md" />
              <span class="text-h6">
                {{ currentCollection }}
              </span>

              <q-toolbar-title></q-toolbar-title>
              <q-btn
                flat
                icon="close"
                style="float: right"
                @click="close"
                v-if="Object.keys(currentDocument || {}).length > 0"
              />
            </q-toolbar>
            <q-card-section>
              <!--<slot>Form slot</slot>-->
              <router-view></router-view>
            </q-card-section>
            <div align="right" class="q-pr-md q-pb-lg">
              <LoadingButton
                no-caps
                unelevated
                color="pink"
                label="Submit"
                class="text-white q-ml-xs"
                icon-right="arrow_right"
                icon=""
                :submit="onSave"
                :loading="store.loading"
              />
              <q-btn
                unelevated
                icon="close"
                label="Cancel"
                color=""
                flat
                @click="close"
              />
            </div>
          </q-card>
        </q-tab-panel>

        <q-tab-panel
          name="attachments"
          style="overflow: auto; padding-bottom: 80px"
        >
          <q-card flat class="my-card bg-transparent">
            <q-toolbar>
              <q-icon name="attachment" size="sm" class="q-mr-md" />
              <span class="text-h6">
                {{ currentCollection }} / Attachments</span
              >
            </q-toolbar>
            <q-card-section>
              <q-list>
                <q-item>
                  <q-item-section>
                    <label>Attachments</label>
                    <TableView
                      :editable="false"
                      :deletable="true"
                      :data="store.currentDocument?.Attachments"
                      :columns="document_columns"
                      :onAddItem="addAttachment"
                      :onRemoveItem="deleteAttachment"
                      :onEditItem="onEditDocument"
                      :onViewItem="onViewDocument"
                      v-if="store.currentDocument?.id"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel
          name="timeline"
          style="overflow: auto; padding-bottom: 80px"
        >
          <q-card flat class="my-card bg-transparent">
            <q-toolbar>
              <q-icon name="history" size="sm" class="q-mr-md" />
              <span class="text-h6"> {{ currentCollection }} / History</span>
            </q-toolbar>
            <q-card-section>
              <q-timeline
                color="secondary"
                :layout="$q.screen.gt.xs ? 'loose' : 'dense'"
              >
                <q-timeline-entry heading class="text-teal text-h6"
                  >History</q-timeline-entry
                >
                <q-timeline-entry
                  v-for="(h, i) of store.history"
                  :key="i"
                  :title="h.op"
                  :subtitle="new Date(h.date).toLocaleDateString('en-GB')"
                >
                  <div>By: {{ h.user }}</div>
                  <div v-if="h.op === 'Minuted'">To: {{ h.to }}</div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel
          name="minutes"
          style="overflow: auto; padding-bottom: 80px"
          v-if="commentable"
        >
          <q-card flat class="my-card bg-transparent">
            <q-toolbar>
              <q-icon name="comment" size="sm" class="q-mr-md" />
              <span class="text-h6"> {{ currentCollection }} / minutes</span>
            </q-toolbar>
            <q-card-section>
              <MinutesPanel
                :minutes="store.minutes"
                :handleComment="handleComment"
              />
              <q-separator spaced inset vertical dark />
              <q-form autofocus="" class="text-teal">
                <label for="" class="">Write minutes</label>
                <textarea
                  v-model="comment"
                  autofocus
                  rows="5"
                  class="full-width q-px-sm"
                  :class="
                    $q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'
                  "
                ></textarea>
                <q-bar class="bg-transparent" style="padding: 0">
                  <q-toolbar-title> </q-toolbar-title>
                  <!--<q-btn
                      icon="check"
                      class="q-mx-xs"
                      size="md"
                      label="Send"
                      unelevated=""
                      :disable="!comment"
                      icon-right="arrow_right"
                      color="teal"
                    >
                      <q-menu persistent="">
                        <SubmitDialog />
                      </q-menu>
                    </q-btn>-->
                  <q-btn
                    :disable="!comment"
                    icon="person"
                    class="q-mx-xs"
                    size="md"
                    label="Send minutes"
                    unelevated=""
                    icon-right="arrow_right"
                    color="blue-9"
                    glossy
                  >
                    <q-menu persistent="">
                      <AssignDialog />
                    </q-menu>
                  </q-btn>
                </q-bar>
              </q-form>
            </q-card-section>
            <q-bar align="center" class="bg-transparent">
              <q-btn
                icon="check"
                class="q-mx-xs"
                size="md"
                label="Submit"
                unelevated=""
                :disable="!comment"
                v-if="!store.currentDocument?.id"
              >
                <q-menu persistent="">
                  <SubmitDialog />
                </q-menu>
              </q-btn>
              <q-btn
                v-if="showAssignDialog"
                :disable="!comment"
                icon="person"
                class="q-mx-xs"
                size="md"
                label="Assign"
                unelevated=""
              >
                <q-menu persistent="">
                  <AssignDialog />
                </q-menu>
              </q-btn>
            </q-bar>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
  <CircularProgress
    :loading="store.loading"
    style="position: fixed; left: 24px; top: 24px"
  />
  <FileViewerDialog
    :docTitle="docTitle"
    :fileSource="fileSource"
    :model="fileViewerDialogModel"
    :set-model="(v) => (fileViewerDialogModel = v)"
  />
  <UploadDialog
    v-on:doc-uploaded="onDocumentUploaded"
    accept=".pdf, .jpg, .jpeg, .png, .mp4"
    :model="dialogModel"
    :set-model="setDialogModel"
    title=""
  />
  <q-dialog full-width v-model="zoom" persistent="">
    <q-card class="full-">
      <q-toolbar class="bg-transparent">
        <q-toolbar-title> {{ zoomTitle }}</q-toolbar-title>
        <q-btn flat dense icon="close" color="negative" @click="cancelZoom" />
      </q-toolbar>
      <q-card-section ref="zoomContainer"> </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar, Notify, Dialog } from "quasar";
import { onMounted, ref, computed, inject, provide, watch } from "vue";
import { useRoute } from "vue-router";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { getStorage, ref as reference, getDownloadURL } from "firebase/storage";

import MinutesPanel from "src/components/CommentsPanel.vue";
import { useDefaultStore } from "src/stores/store";
import { firestore } from "src/composables/firebase";
import { useDebounce } from "src/composables/use-debounce";
//import { getUser } from "src/composables/functions";
import {
  onAddAttachment,
  onDeleteAttachment,
  getStorageFolder,
  update,
  create,
  onSubmit,
  onAssign,
} from "src/composables/remote";

import FileViewerDialog from "./FileViewerDialog.vue";
import UploadDialog from "./UploadDialog.vue";
import TableView from "./TableView.vue";
import AssignDialog from "./AssignDialog.vue";
import SubmitDialog from "./SubmitDialog.vue";
import CircularProgress from "./CircularProgress.vue";
import LoadingButton from "./LoadingButton.vue";
//useDashboardData();
//import { LineChart } from "chart.js";
//import ApexCharts from "apexcharts";
//import VueApexCharts from "vue3-apexcharts";
const $q = useQuasar();
const store = useDefaultStore();
const tab = ref("edit");
const tabPanelsRef = ref(null);
const searchRef = ref(null);
const searchText = ref("");
const whereFilters = ref([]);
const route = useRoute();
const comment = ref("");
const editForm = ref(false);
const docTitle = ref("");
const fileSource = ref("");
const dialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const zoomEl = ref(null);
const zoom = ref(false);
const zoomContainer = ref(null);
const zoomTitle = ref("");
//const currentCollection = store.fn.currentCollection;
const searchFields = store.fn.searchFields;
const iconName = store.fn.conName;
/*const store.fn = definestore.fn({
  reset: Function,
  validate: Function,
  setCurrentDoc: Function,
  getDocument: Function,
  updateFields: Array,
});*/
const currentCollection = computed({
  get: () => store.fn.currentCollection,
  set: (v) => (store.fn.currentCollection = v),
});
//const currentDataSource = computed(() => store.query);
//store.searchResults = useCollection(currentDataSource);
const document_columns = [
  { name: "Title", field: "Title", label: "Title", align: "left" },
];
const showAssignDialog = computed(() => {
  return (
    store.user?.claims?.role === "Director" ||
    store.user?.claims?.role === "Head"
  );
});
const loading = computed({
  get: () => store.loading,
  set: (v) => (store.loading = v),
});
/*const pendingEdit = computed(
  () => Object.values(currentDocument.value).length > 0
);*/
const currentDocument = computed({
  get: () => store.currentDocument || {},
  set: (v) => {
    store.currentDocument = v;
  },
});
const commentable = computed(() => {
  //console.log(currentDocument.value);
  return (
    //currentDocument.value?.id ||
    currentDocument.value?.id &&
    (store.user?.claims?.admin ||
      store.user?.uid === currentDocument.value?.meta?.To ||
      (currentDocument.value?.meta?.Status === "Created" &&
        store.user?.uid === currentDocument.value?.meta?.CreatedBy))
  );
});
const isDocumentSaved = computed(() => {
  return currentDocument.value?.id;
});
function setDialogModel(val) {
  dialogModel.value = val;
}
function handleComment() {
  tabPanelsRef.value.next();
}
async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  loadDocument(doc.id);
}
async function onSave() {
  const result = await store.fn.validate();
  if (result) {
    try {
      loading.value = true;
      //throw { message: "Please fill form fields correctly" };
      let data = store.fn.getDocument();
      if (store.currentDocument?.id) {
        let dt = await update(
          currentDocument.value.id,
          data,
          //currentDocument.value,
          currentCollection
        );
      } else {
        let response = await create(data, currentCollection, searchFields);
        if (store.currentDocument) store.currentDocument.id = response;
        store.currentDocument = {};
      }
      editForm.value = false;
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document saved",
        icon: "check",
        iconColor: "secondary",
        position: "right",
      });
    } catch (error) {
      console.error(store.user, error);
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: error.message,
        icon: "error",
        iconColor: "warning",
        color: "red",
      });
    } finally {
      loading.value = false;
    }
  }
}
function resetValues() {
  //store.tabModel = "search";
  currentDocument.value = {};
  store.searchResults = [];
  store.minutes = [];
}

function close() {
  loading.value = false;
  tab.value = "edit";
  store.tabModel = "search";
  currentDocument.value = {};
  store.fn.setCurrentDoc({});
  store.fn.reset();
  //editForm.value = false;
  //mainTabPanelsRef.value.previous();
}

const loadDocument = useDebounce(async (docId) => {
  loading.value = true;
  const docSource = computed(() =>
    doc(collection(firestore, currentCollection), docId)
  );
  //currentDocument will always be in sync with the data source
  store.currentDocument = useDocument(docSource);
  //store.currentDocumentId = docId;
  loading.value = false;
  //tabPanelsRef.value="edit";
  store.tabModel = "edit";
}, 500);
function addAttachment() {
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
    onDeleteAttachment(currentCollection, currentDocument.value.id, d)
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
    onAddAttachment(currentCollection, currentDocument.value.id, doc)
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
async function loadHash(hash) {
  const docId = hash.substring(1);
  await loadDocument(docId);
  tab.value = "edit";
  store.tabModel = "editor";
}
function cancelZoom(e) {
  const el = zoomContainer.value;
  const card = zoomEl.value;
  const next = card.firstElementChild.nextElementSibling;
  //const copy = e.target.parentElement.parentElement.parentElement.parentElement;
  zoom.value = false;
  //console.log(el, next);
  //document.replaceChild()
  setTimeout(() => {
    card.replaceChild(el.$el, next);
  }, 10);
}

// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.hash,
  async (hash) => {
    if (!hash || hash.length < 2) {
      searchRef.value?.onSearch();
      return;
    }
    loadHash(hash);
  },
  { immediate: true }
);

watch(
  () => store.currentDocument,
  async (doc) => {
    store.fn.setCurrentDoc(Object.assign({}, store.currentDocument));
    if (doc?.id) {
      /*getUser(store.currentDocument.meta.CreatedBy).then((user) => {
        currentDocument.value.CreatedBy = user.displayName;
      });
      currentDocument.value.CreatedBy = (
        await getUser(store.currentDocument.meta.CreatedBy)
      ).data.displayName;
      */
      const histSource = query(
        collection(firestore, currentCollection, doc.id, "History"),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
      store.minutes = useCollection(
        query(
          collection(firestore, currentCollection, doc.id, "Minutes"),
          orderBy("time", "asc")
        )
      );
    }
  }
);

onMounted(async () => {
  resetValues();
  currentCollection.value = currentCollection;
  //store.searchResults = useCollection(currentDataSource);
  editForm.value = store.fn.getDocument()?.id ? false : true;
  tab.value = "edit";
  setTimeout(() => {
    searchRef.value?.onSearch();
  }, 20);
});
function submit(comment, assigned, unit) {
  onSubmit(comment, assigned, unit, currentDocument.value.id).then(() => {
    //console.log("Submitted");
    close();
  });
}
function assign(comment, assigned, unit) {
  onAssign(comment, assigned, unit, currentDocument.value.id).then(() => {
    //console.log("Assigned");
    close();
  });
}
//this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
//console.log(this.gradient);
provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("comment", comment);
provide("on-load", onLoad);
provide("on-assign", assign);
provide("on-submit", submit);
</script>
<style scoped>
td,
th {
  padding: 6px;
}
.q-card-section {
  padding: 0;
}
.q-toolbar {
  border-bottom: 1px solid none;
}
.bottom-bar {
  border-top: 1px solid none;
  border-bottom: none;
  padding-top: 4px;
  padding-bottom: 8px;
}
.my-card {
  font-size: 16px;
}
</style>
