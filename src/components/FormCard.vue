<template>
  <q-card
    flat
    square
    class="my-card q-pb-xl bg"
    :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-'"
  >
    <q-bar
      class="q-pb-sm bg-transparent"
      :class="$q.dark.isActive ? 'bg-blue-grey-8' : 'bg-teal-7'"
    >
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
        :class="$q.dark.isActive ? 'text-teal-1' : 'text-white'"
      >
        <q-tab
          name="search"
          icon="search"
          title="Search"
          :label="$q.screen.lt.sm ? '' : 'Search'"
          style="border-radius: 4px 4px 0 0"
        />
        <q-tab
          name="details"
          icon="edit"
          title="Edit"
          :label="$q.screen.lt.sm ? '' : 'Details'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved"
        />
        <!--<q-tab
          name="form"
          icon="edit"
          title="Edit"
          :label="$q.screen.lt.sm ? '' : 'Form'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved"
        />-->

        <q-tab
          name="attachments"
          icon="attachment"
          title="attachments"
          :label="$q.screen.lt.sm ? '' : 'Attach'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved"
        />
        <q-tab
          name="analytics"
          icon="analytics"
          title="Analytics"
          :label="$q.screen.lt.sm ? '' : 'Timeline'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved"
        />
        <q-tab
          name="comments"
          icon="comment"
          title="Comment"
          :label="$q.screen.lt.sm ? '' : 'Minutes'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved"
        />
        <q-tab
          name="dashboard"
          icon="dashboard"
          title="dashboard"
          :label="$q.screen.lt.sm ? '' : 'dashboard'"
          style="border-radius: 4px 4px 0 0"
        />
      </q-tabs>
    </q-bar>
    <q-tab-panels
      style="height: calc(100vh - 128px)"
      :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-'"
      :keep-alive="true"
      ref="tabPanelsRef"
      v-model="tab"
      animated
    >
      <q-tab-panel name="search" style="overflow: auto">
        <q-card flat :class="$q.dark.isActive ? 'bg-blue-grey-10' : ''">
          <q-toolbar>
            <q-icon :name="iconName" size="sm" class="q-mr-md" />
            <q-toolbar-title>
              {{ store.currentCollection }}
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <search-panel ref="searchRef"></search-panel>
            <search-list
              :activeClass="
                $q.dark.isActive
                  ? 'text-yellow bg-grey-8'
                  : 'text-teal bg-grey-2'
              "
            />
            <q-btn
              color="teal"
              icon="add"
              no-caps
              unelevated=""
              @click="showDialog(null, true)"
            >
              Add New Item
            </q-btn>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="details" style="overflow: auto">
        <q-card
          flat
          class="my-card"
          :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-'"
        >
          <q-toolbar>
            <q-icon :name="iconName" size="sm" class="q-mr-md" />
            <span class="text-h6">
              {{ store.currentCollection }} /
              {{ currentDocument?.Title || currentDocument?.Name }}
            </span>

            <q-toolbar-title></q-toolbar-title>
            <q-btn flat icon="close" style="float: right" @click="close" />
          </q-toolbar>
          <q-card-section>
            <slot>Form slot</slot>
          </q-card-section>
          <q-toolbar align="center" class="bottom-bar q-pb-md">
            <!--<q-btn
              flat
              icon="edit"
              label="Edit"
              @click="showDialog(true)"
              v-if="!editForm"
            />-->
            <q-toolbar-title></q-toolbar-title>
            <q-btn
              unelevated=""
              icon="check"
              label="Submit"
              color="teal"
              glossy
              @click="onSave"
              class="q-mr-xs"
              v-if="editForm && !store.currentDocument?.id"
            />
            <q-btn
              unelevated
              icon="undo"
              label="Reset"
              color="red"
              glossy
              @click="cancelEdit"
              class="q-mr-xs"
              v-if="editForm"
            />
            <q-btn
              unelevated
              icon-right="close"
              label="Close"
              color="purple"
              glossy
              @click="close"
            />
          </q-toolbar>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="attachments" style="overflow: auto">
        <q-card
          flat
          class="my-card"
          :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-'"
        >
          <q-toolbar>
            <q-icon name="attachment" size="sm" class="q-mr-md" />
            <span class="text-h6">
              {{ store.currentCollection }} / Attachments</span
            >
          </q-toolbar>
          <q-card-section>
            <q-list bordered>
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

      <q-tab-panel name="analytics" style="overflow: auto">
        <q-card
          flat
          class="my-card"
          :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-'"
        >
          <q-toolbar>
            <q-icon name="history" size="sm" class="q-mr-md" />
            <span class="text-h6">
              {{ store.currentCollection }} / History</span
            >
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
                :subtitle="new Date(h.time).toLocaleString()"
              >
                <div>By: {{ h.user }}</div>
                <div v-if="h.op === 'Minuted'">To: {{ h.to }}</div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="comments" style="overflow: auto" v-if="commentable">
        <q-card
          flat
          class="my-card"
          :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-'"
        >
          <q-toolbar>
            <q-icon name="comment" size="sm" class="q-mr-md" />
            <span class="text-h6">
              {{ store.currentCollection }} / Comments</span
            >
          </q-toolbar>
          <q-card-section>
            <CommentsPanel
              :comments="store.comments"
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
                :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'"
              ></textarea>
              <q-bar class="bg-transparent">
                <q-toolbar-title> </q-toolbar-title>
                <q-btn
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
                </q-btn>
                <q-btn
                  :disable="!comment"
                  icon="person"
                  class="q-mx-xs"
                  size="md"
                  label="Assign"
                  unelevated=""
                  icon-right="arrow_right"
                  color="purple"
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

      <q-tab-panel name="dashboard" style="overflow: auto" class="">
        <div class="row q-col-gutter-md" ref="chartref">
          <div
            class="col col-xs-12 col-sm-6 col-md-4 col-lg-3"
            v-for="x of DASHBOARD_CARDS"
            :key="x"
          >
            <q-card
              class="my-card"
              :class="$q.dark.isActive ? 'bg-grey-10' : 'shadow-22'"
            >
              <q-bar class="bg-transparent">
                <q-toolbar-title> </q-toolbar-title>
                <q-btn flat dense icon="fullscreen" @click="zoomChart" />
              </q-bar>
              <q-card-section class="chart" v-if="tab === 'dashboard'">
                <line-chart
                  :download="true"
                  :data="[
                    {
                      name: 'Food',
                      data: {
                        '2017-01-01': 3,
                        '2017-01-02': 4,
                        '2017-01-03': 7,
                        '2017-01-04': 10,
                        '2017-01-05': 3,
                        '2017-01-06': 4,
                      },
                    },
                    {
                      name: 'Water',
                      data: {
                        '2017-01-01': 13,
                        '2017-01-02': 9,
                        '2017-01-03': 4,
                        '2017-01-04': 10,
                        '2017-01-05': 5,
                        '2017-01-06': 4,
                      },
                    },
                  ]"
                ></line-chart>
              </q-card-section>
            </q-card>
          </div>
          <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
            <q-card
              class="my-card full-width"
              :class="$q.dark.isActive ? 'bg-grey-10' : 'shadow-22'"
            >
              <q-bar class="bg-transparent">
                <q-toolbar-title> </q-toolbar-title>
                <q-btn flat dense icon="fullscreen" @click="zoomChart" />
              </q-bar>
              <q-card-section>
                <area-chart
                  :data="[
                    {
                      name: 'Food',
                      data: {
                        '2017-01-01': 2,
                        '2017-01-02': 5,
                        '2017-01-03': 7,
                        '2017-01-04': 15,
                        '2017-01-05': 12,
                        '2017-01-06': 5,
                        '2017-01-07': 2,
                        '2017-01-08': 0,
                      },
                    },
                    {
                      name: 'Water',
                      data: {
                        '2017-01-01': 8,
                        '2017-01-02': 7,
                        '2017-01-03': 7,
                        '2017-01-04': 5,
                        '2017-01-05': 12,
                        '2017-01-06': 15,
                        '2017-01-07': 12,
                        '2017-01-08': 10,
                      },
                    },
                  ]"
                ></area-chart>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!--<div class="row q-col-gutter-md">
          <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
            <q-card
              class="my-card full-width full-height"
              :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'shadow-22'"
            >
              <q-card-section class="text-h6 text-teal">
                Analytics
              </q-card-section>
              <q-card-section> Lorem ipsum dolor sit amet </q-card-section>
              <q-card-actions align="center">
                <q-btn flat label="Action 1" />
                <q-btn flat label="Action 2" />
              </q-card-actions>
            </q-card>
          </div>
        </div>-->
      </q-tab-panel>
    </q-tab-panels>
    <CircularProgress />
  </q-card>
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
    <q-card class="full-width">
      <q-toolbar class="bg-transparent">
        <q-toolbar-title> </q-toolbar-title>
        <q-btn flat dense icon="close" color="negative" @click="cancelZoom" />
      </q-toolbar>
      <q-card-section ref="zoomContainer"> </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import CommentsPanel from "src/components/CommentsPanel.vue";
import { useDefaultStore } from "src/stores/store";
import SearchPanel from "src/components/SearchPanel.vue";
import { doc } from "firebase/firestore";
import { useRoute } from "vue-router";
import { useQuasar, Notify, Dialog } from "quasar";
import * as remote from "../composables/remote";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy } from "firebase/firestore";
import { firestore } from "../composables/firebase";
//import { advancedSearch, loadDocuments } from "src/composables/searchProvider";
import { useDebounce } from "src/composables/use-debounce";
import { getUser } from "src/composables/functions";
import SearchList from "./SearchList.vue";
import FileViewerDialog from "./FileViewerDialog.vue";
import UploadDialog from "./UploadDialog.vue";
import { getStorage, ref as reference, getDownloadURL } from "firebase/storage";
import {
  onAddAttachment,
  onDeleteAttachment,
  getStorageFolder,
} from "../composables/remote";
import TableView from "./TableView.vue";

import {
  onMounted,
  onUpdated,
  ref,
  computed,
  inject,
  provide,
  watch,
  watchEffect,
} from "vue";
import AssignDialog from "./AssignDialog.vue";
import SubmitDialog from "./SubmitDialog.vue";
import CircularProgress from "./CircularProgress.vue";
//import { LineChart } from "chart.js";
//import ApexCharts from "apexcharts";
//import VueApexCharts from "vue3-apexcharts";
const $q = useQuasar();
const store = useDefaultStore();
const tab = ref("search");
const tabPanelsRef = ref(null);
const searchRef = ref(null);
const searchText = ref("");
const whereFilters = ref([]);
const route = useRoute();
const comment = ref("");
const collectionName = inject("collection");
const searchFields = inject("searchFields");
const iconName = inject("iconName");
const editForm = ref(false);
const docTitle = ref("");
const fileSource = ref("");
const dialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const chartref = ref(null);
const zoomEl = ref(null);
const zoom = ref(false);
const zoomContainer = ref(null);
const props = defineProps({
  reset: Function,
  validate: Function,
  setCurrentDoc: Function,
  getDocument: Function,
  updateFields: Array,
});
const currentDataSource = computed(() => store.query);
// store.searchResults = useCollection(currentDataSource);
const document_columns = [
  { name: "Title", field: "Title", label: "Title", align: "left" },
];
const DASHBOARD_CARDS = [
  {
    name: "Created",
    options: {
      chart: {
        id: "created",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "sales",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    type: "area",
  },
  {
    name: "Assigned",
    options: {
      chart: {
        id: "assigned",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 91],
      },
    ],
    type: "line",
  },
  {
    name: "Assigned",
    options: {},
    series: [44, 55, 41, 17, 15],
    type: "pie",
  },
  {
    name: "Treated",
    options: {},
    series: [44, 55, 41, 17, 15],
    type: "donut",
  },
];
const donut = {
  name: "Treated",
  options: {},
  series: [44, 55, 41, 17, 15],
  type: "donut",
};
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
  return (
    //currentDocument.value?.id ||
    currentDocument.value?.id &&
    (store.user?.claims?.admin ||
      store.user?.uid === currentDocument.value?.To ||
      (currentDocument.value?.Status === "Created" &&
        store.user?.uid === currentDocument.value?.CreatedBy))
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
  const result = await props.validate();
  if (result) {
    try {
      loading.value = true;
      //throw { message: "Please fill form fields correctly" };
      let data = props.getDocument();
      if (store.currentDocument?.id) {
        let dt = await remote.update(
          currentDocument.value.id,
          data,
          //currentDocument.value,
          collectionName
        );
      } else {
        let response = await remote.create(data, collectionName, searchFields);
        if (store.currentDocument) store.currentDocument.id = response.data;
        store.currentDocument = {};
      }
      //pendingEdit.value = false;
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document saved",
        icon: "check",
        iconColor: "secondary",
        position: "right",
      });
      editForm.value = false;
      tabPanelsRef.value.previous();
    } catch (error) {
      //console.error(error);
      Dialog.create({
        timeout: 2000,
        textColor: "white",
        message: error.message,
        icon: "error",
        iconColor: "white",
        color: "red",
      });
      /*Notify.create({
      timeout: 3000,
      textColor: "white",
      message: error.message,
      icon: "error",
      iconColor: "white",
      color: "red",
    });*/
    } finally {
      loading.value = false;
    }
  }
}
function resetValues() {
  currentDocument.value = {};
  store.searchResults = [];
  store.comments = [];
}
function cancelEdit() {
  props.setCurrentDoc(Object.assign({}, store.currentDocument));
  props.reset();
  loading.value = false;
  currentDocument.value = {};
}

function close() {
  cancelEdit();
  tabPanelsRef.value.previous();
  editForm.value = false;
  loading.value = false;
  currentDocument.value = {};
}

function showDialog(edit, move) {
  editForm.value = true;
  store.currentDocument = {};
  if (edit) {
    //props.setCurrentDoc(Object.assign({}, store.currentDocument));
  } else {
    props.setCurrentDoc({});
  }
  if (move) {
    //tabPanelsRef.value.next();
    tab.value = "details";
  }
}
const loadDocument = useDebounce(async (docId) => {
  loading.value = true;
  const docSource = computed(() =>
    doc(collection(firestore, collectionName), docId)
  );
  //currentDocument will always be in sync with the data source
  store.currentDocument = useDocument(docSource);
  //store.currentDocumentId = docId;
  loading.value = false;
  //tabPanelsRef.value?.next();
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
    onDeleteAttachment(collectionName, currentDocument.value.id, d)
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
    onAddAttachment(collectionName, currentDocument.value.id, doc)
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
  tab.value = "details";
}
function cancelZoom(e) {
  const el = zoomContainer.value;
  const card = zoomEl.value;
  const next = card.firstElementChild.nextElementSibling;
  //const copy = e.target.parentElement.parentElement.parentElement.parentElement;
  zoom.value = false;
  //console.log(el, next);
  setTimeout(() => {
    card.insertBefore(el.$el, next);
  }, 10);
}
function zoomChart(e) {
  zoom.value = true;
  const card = e.target.parentElement.parentElement.parentElement.parentElement;
  zoomEl.value = card;
  setTimeout(() => {
    const el = zoomContainer.value.$el;
    const copy = card.firstElementChild.nextSibling;
    el.appendChild(copy.firstElementChild);
  }, 100);
}
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.hash,
  async (hash) => {
    //const hash = window.location.hash;
    if (!hash || hash.length < 2) {
      //await loadDocument(0);
      searchRef.value?.searchNow();
      return;
    }
    loadHash(hash);
  },
  { immediate: true }
);
watch(
  () => store.currentDocument,
  async (doc) => {
    props.setCurrentDoc(Object.assign({}, store.currentDocument));
    if (doc?.id) {
      currentDocument.value.CreatedBy = (
        await getUser(store.currentDocument.meta.CreatedBy)
      ).data.displayName;

      const histSource = query(
        collection(firestore, collectionName, doc.id, "History"),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
      store.comments = useCollection(
        query(
          collection(firestore, collectionName, doc.id, "Minutes"),
          orderBy("time", "asc")
        )
      );
    }
  }
);

onMounted(async () => {
  resetValues();
  store.currentCollection = collectionName;
  store.searchResults = useCollection(currentDataSource);
  searchRef.value?.searchNow();
  editForm.value = props.getDocument()?.id ? false : true;
});
//this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
//console.log(this.gradient);
provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("comment", comment);
provide("on-load", onLoad);
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
</style>
