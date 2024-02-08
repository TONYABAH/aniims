<template>
  <q-card
    flat
    square
    class="my-card shadow-22"
    style="opacity: 0.85"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
  >
    <div>
      <!--<q-toolbar
        class="q-pb-sm"
        :class="
          $q.dark.isActive
            ? 'bg-grey-8'
            : 'bg-' + store.settings.themeColor + '-2'
        "
      >
        <q-tabs
          v-model="tab"
          narrow-indicator=""
          indicator-color=""
          inline-label=""
          align="left"
          no-caps=""
          mobile-arrows=""
          outside-arrows=""
          class="q-pb-xs text-"
        >
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
            v-if="isDocumentSaved && !hideTabs"
          />
        </q-tabs>
      </q-toolbar>-->
      <q-tab-panels
        :keep-alive="true"
        ref="tabPanelsRef"
        v-model="tab"
        animated
        vertical
        transition-next="scale"
        transition-prev="scale"
        style="padding: 0; border-top: 1px inset"
        :class="
          $q.dark.isActive
            ? 'bg-grey-9'
            : 'bg-' + store.settings.themeColor + '-1'
        "
      >
        <q-tab-panel
          name="edit"
          style="overflow: auto; padding-bottom: 120px"
          :class="$q.screen.lt.sm ? '' : 'q-px-xl'"
        >
          <q-card class="my-card q-py-md">
            <q-card-section>
              <slot></slot>
            </q-card-section>
            <q-toolbar class="q-mt-xl">
              <q-btn
                unelevated
                rounded
                padding="md"
                color="secondary"
                icon="arrow_back"
                label="Previous"
                class="float-right"
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
                size="lg"
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
                unelevated
                no-caps
                icon="close"
                label="Cancel"
                class="q-ml-xs"
                size="lg"
                :color="$q.dark.isActive ? 'grey-8' : 'blue-grey'"
                style="letter-spacing: 1.2px"
                @click="close"
              />
            </q-toolbar>
          </q-card>
        </q-tab-panel>

        <!--<q-tab-panel
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

        <q-tab-panel
          name="minutes"
          style="overflow: auto; padding-bottom: 120px"
        >
          <MinutesTabCard :onMinuted="onMinuted" />
        </q-tab-panel>-->
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useQuasar, Notify, Dialog, debounce } from "quasar";
import {
  onMounted,
  onBeforeMount,
  ref,
  computed,
  inject,
  provide,
  watch,
  defineAsyncComponent,
} from "vue";
import { useDocument } from "vuefire";
import { collection, doc } from "firebase/firestore";
import { useDefaultStore } from "src/stores/store";
import { firestore } from "src/composables/firebase";
import {
  create,
  update,
  addChildDocument,
  updateChildDocument,
} from "src/composables/remote";

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const store = useDefaultStore();
const tab = ref("edit");
const tabPanelsRef = ref(null);
const searchText = ref("");
const whereFilters = ref([]);
const readOnly = ref(false);
//var collectionName = inject("collection");
//currentCollection.value = collectionName;

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

let caseId = ref(route.params.id);
let caseCollection = ref("Investigations");
let childCollection = ref("");
let docId = ref(route.hash?.substring(1));

const loading = computed({
  get: () => store.loading,
  set: (v) => (store.loading = v),
});

const currentDocument = computed({
  get: () => store.currentDocument || {},
  set: (v) => {
    store.currentDocument = v;
  },
});
const editable = computed(() => {
  return (
    currentDocument.value?.id === undefined
    //(currentDocument.value?.id && store.user?.claims?.admin) ||
    //(currentDocument.value?.meta?.Status === "Created" &&store.user?.uid === currentDocument.value?.meta?.CreatedBy)
  );
});
const isDocumentSaved = computed(() => {
  return store.currentDocument?.id;
});

async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  loadDocument(doc.id);
}

function resetValues() {
  currentDocument.value = {};
  store.searchResults = [];
  store.minutes = [];
}
async function onSave() {
  const result = await props.validate();
  if (result) {
    //const caseId = route.params.id;
    try {
      loading.value = true;

      let data = props.getDocument();
      data.CaseId = caseId;

      if (docId.value) {
        await updateChildDocument(
          caseCollection.value,
          caseId.value,
          childCollection.value,
          docId.value,
          data
        );
      } else {
        let response = await addChildDocument(
          caseCollection.value,
          caseId.value,
          childCollection.value,
          data
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
  }
}
function close() {
  loading.value = false;
  tab.value = "edit";
  store.tabModel = "search";
  currentDocument.value = {};
  props.setCurrentDoc({});
  props.reset();
}

const loadDocument = debounce(async (docId) => {
  loading.value = true;
  const docSource = computed(() =>
    doc(
      collection(
        firestore,
        caseCollection.value,
        caseId.value,
        childCollection.value
        //docId.value
      ),
      docId
    )
  );
  //currentDocument will always be in sync with the data source
  store.currentDocument = useDocument(docSource);
  loading.value = false;
  store.tabModel = "edit";
}, 500);

async function loadHash(hash) {
  const docId = hash.substring(1);
  await loadDocument(docId);
}
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.hash,
  async (hash) => {
    //console.log(hash);
    //let [cid, cn] = route.hash.split(/cid\=|\&cn\=/);
    if (hash && hash.length > 1) loadHash(hash);
  },
  { immediate: true }
);

watch(
  () => store.currentDocument,
  async (doc) => {
    props.setCurrentDoc(doc || {});
    readOnly.value = true;
  }
);
watch(
  () => store.tabModel,
  (val) => {
    if (val === "search") {
      tab.value = "edit";
    }
  }
);
//this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
//console.log(this.gradient);
//provide("comment", comment);
//provide("on-assign", assign);
//provide("on-submit", submit);
provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("on-load", onLoad);

onMounted(async () => {
  resetValues();
  store.currentDocument = {};
  tab.value = "edit";
  store.tabModel = "search";
  let params = route.path.split(/\/|\#/);
  childCollection.value = params[3];
  //let caseId = route.params.id;
  //let caseCollection = "Investigations";
  //let childId = route.hash?.substring(1) || 0;
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
