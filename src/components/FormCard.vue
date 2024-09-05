<template>
  <q-card
    flat
    square
    class="my-card bg-transparent"
    style="opacity: 0.85"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
  >
    <q-toolbar flat class="bg-red text-white">
      <q-tabs
        v-model="tab"
        narrow-indicator=""
        :indicator-color="$q.dark.isActive ? 'grey-4' : 'red'"
        inline-label=""
        no-caps=""
        mobile-arrows=""
        outside-arrows=""
        align="left"
        :shrink="false"
        stretch=""
        class="q-pt-xs"
        :active-bg-color="$q.dark.isActive ? 'grey-8' : 'white'"
        :active-color="$q.dark.isActive ? 'grey-1' : 'red'"
      >
        <q-tab
          name="editor"
          icon="edit"
          title="Edit"
          :label="$q.screen.lt.sm ? '' : 'Edit'"
          style="border-radius: 4px 4px 0 0"
        />
        <q-tab
          name="minutes"
          icon="comment"
          title="Minute"
          :label="$q.screen.lt.sm ? '' : 'Minute'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved && !hideTabs && commentable"
        />

        <q-tab
          name="attachments"
          icon="attachment"
          title="attachments"
          :label="$q.screen.lt.sm ? '' : 'Attach'"
          style="border-radius: 4px 4px 0 0"
          v-if="isDocumentSaved && !hideTabs"
        />
        <q-tab
          name="timeline"
          icon="timer"
          title="Timeline"
          :label="$q.screen.lt.sm ? '' : 'Timeline'"
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
      vertical
      transition-next="scale"
      transition-prev="scale"
      style="padding: 0"
      class="bg-transparent"
    >
      <q-tab-panel
        v-if="isDocumentSaved && !hideTabs && commentable"
        name="minutes"
        style="overflow: auto; padding-bottom: 120px"
        :class="$q.screen.lt.sm ? 'padding:0' : 'q-px-md q-pb-xl'"
      >
        <MinutesTabCard :onMinuted="onMinuted" />
      </q-tab-panel>

      <q-tab-panel
        name="editor"
        style="overflow: auto"
        :class="$q.screen.lt.sm ? 'padding:0' : 'q-px-md q-pb-xl'"
      >
        <q-card class="my-card shadow-22" :flat="$q.screen.lt.sm">
          <q-card-section :style="$q.screen.lt.sm ? 'padding:0px;' : ''">
            <slot></slot>
          </q-card-section>
          <q-toolbar class="my-card q-py-md">
            <q-btn
              dense
              unelevated
              :color="store.theme.color.light"
              icon="arrow_back"
              label="Previous"
              class="float-right q-pr-md"
              @click="onPrevious"
              v-if="showPrevious"
            />
            <q-space />
            <slot name="action"></slot>
            <LoadingButton
              unelevated
              no-caps
              class="q-ml-xs"
              icon-right="arrow_right"
              :label="saveButtonLabel"
              :submit="onSave"
              :loading="loading"
              :color="
                $q.dark.isActive
                  ? store.theme.color.light
                  : store.theme.color.light
              "
              style="letter-spacing: 1.2px"
              v-show="editable && !hideSaveButton"
            />
            <q-badge
              class="q-pa-md"
              color="orange-4"
              text-color="black"
              label="Read only"
              style="font-size: large"
              v-if="!editable"
            />
            <q-btn
              flat
              no-caps
              icon="close"
              label="Cancel"
              class="q-ml-xs"
              :color="$q.dark.isActive ? 'grey-8' : 'blue-grey'"
              style="letter-spacing: 1.2px"
              @click="close"
            />
          </q-toolbar>
        </q-card>
      </q-tab-panel>

      <q-tab-panel
        v-if="isDocumentSaved && !hideTabs && commentable"
        name="attachments"
        style="overflow: auto; padding-bottom: 120px"
      >
        <AttachmentTabCard />
      </q-tab-panel>

      <q-tab-panel
        name="timeline"
        style="overflow: auto; padding-bottom: 120px"
      >
        <HistoryTabCard />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useQuasar, Notify, Dialog, debounce } from "quasar";
import { useDocument } from "vuefire";
import { collection, doc } from "firebase/firestore";
import { useDefaultStore } from "src/stores/store";
import { firestore } from "src/composables/firebase";
import MinutesTabCard from "src/components/MinutesTabCard.vue";
import HistoryTabCard from "src/components/HistoryTabCard.vue";
import AttachmentTabCard from "src/components/AttachmentTabCard.vue";
import {
  onMounted,
  ref,
  computed,
  provide,
  watch,
  defineAsyncComponent,
} from "vue";
import { update, create } from "src/composables/remote";
/*const MinutesTabCard = defineAsyncComponent(() =>
  import("src/components/MinutesTabCard.vue")
);
const HistoryTabCard = defineAsyncComponent(() =>
  import("src/components/HistoryTabCard.vue")
);
const AttachmentTabCard = defineAsyncComponent(() =>
  import("src/components/AttachmentTabCard.vue")
);*/

const $q = useQuasar();
const store = useDefaultStore();
const tab = ref("editor");
const tabPanelsRef = ref(null);
const searchText = ref("");
const whereFilters = ref([]);
const route = useRoute();
const comment = ref("");

const LoadingButton = defineAsyncComponent(() =>
  import("src/components/LoadingButton.vue")
);

const props = defineProps({
  collectionName: String,
  reset: Function,
  validate: Function,
  setCurrentDoc: Function,
  getDocument: Function,
  updateFields: Array,
  searchFields: Array,
  hideTabs: Boolean,
  commentable: {
    type: Boolean,
    default: true,
  },
  hideSaveButton: {
    type: Boolean,
    default: false,
  },
  showPrevious: {
    type: Boolean,
    default: false,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
  onSaved: {
    type: Function,
    default: () => {
      console.log("Saved");
    },
  },
  onPrevious: {
    type: Function,
    default: () => {},
  },
});

const loading = computed({
  get: () => store.loading,
  set: (v) => (store.loading = v),
});

const currentCollection = computed({
  get: () => props.collectionName,
  //set: (v) => (currentCollection.value = collectionName = v),
});
const currentDocument = computed({
  get: () => store.currentDocument,
  set: (v) => {
    store.currentDocument = v || {};
    props.setCurrentDoc(v || {});
  },
});

const editable = computed(() => {
  //console.log(currentDocument.value);
  return (
    currentDocument.value?.id === undefined ||
    (currentDocument.value?.id && store.user?.claims?.admin) ||
    (currentDocument.value?.meta?.Status === "Created" &&
      store.user?.uid === currentDocument.value?.meta?.CreatedBy)
  );
});
const isDocumentSaved = computed(() => {
  return store.currentDocument?.id;
});
function onMinuted() {
  resetValues();
  store.tabModel = "search";
}
const loadDocumentById = debounce(async (docId) => {
  loading.value = true;
  //currentDocument will always be in sync with the data source
  let dRef = computed(() =>
    doc(collection(firestore, currentCollection.value), docId)
  );
  store.currentDocument = useDocument(dRef);
  setTimeout(() => {
    props.setCurrentDoc(store.currentDocument);
    loading.value = false;
  }, 400);
}, 500);

async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  loadDocumentById(doc.id);
}

function resetValues() {
  currentDocument.value = {};
  store.searchResults = [];
  store.minutes = [];
}
async function onSave() {
  const result = await props.validate();

  if (result) {
    //if (caseId.value) return onSaveCaseDocument();
    try {
      loading.value = true;
      //throw { message: "Please fill form fields correctly" };
      let data = props.getDocument();
      if (store.currentDocument?.id) {
        await update(
          store.currentDocument.id,
          data,
          //currentDocument.value,
          currentCollection.value
        );
      } else {
        let response = await create(
          data,
          currentCollection.value,
          props.searchFields
        );
        if (store.currentDocument) store.currentDocument.id = response;
        //store.currentDocument = {};
      }

      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document saved",
        icon: "check",
        iconColor: "secondary",
        position: "right",
      });
      props.onSaved();
    } catch (error) {
      console.error(store.user, error);
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: error.message,
        icon: "error",
        iconColor: "warning",
        color: "red",
        position: "right",
      });
    } finally {
      loading.value = false;
    }
  } else {
    Notify.create({
      message: "Fill all fields correctly",
      position: "right",
    });
  }
}
function close() {
  loading.value = false;
  tab.value = "editor";
  store.tabModel = "search";
  currentDocument.value = {};
  props.setCurrentDoc({});
  props.reset();
}

async function loadHash(hash) {
  const docId = hash.substring(1);
  loadDocumentById(docId);
}
watch(
  () => route.path,
  async (p, q) => {
    if (window.location.hash) {
      store.tabModel = "edit";
      //let [cid, cn] = route.hash.split(/cid\=|\&cn\=/);
      loadHash(window.location.hash);
    }
  },
  { immediate: true }
);

provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("comment", comment);
provide("on-load", onLoad);

onMounted(async () => {
  resetValues();
  store.currentCollection = currentCollection.value;
});
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
