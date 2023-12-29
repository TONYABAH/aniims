<template>
  <q-card
    :flat="false"
    square
    class="my-card shadow-22"
    style="opacity: 0.85"
    :class="+$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
  >
    <div>
      <q-toolbar
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
          shrink=""
          active-bg-color=""
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
        style="padding: 0; border-top: 1px inset"
        :class="
          $q.dark.isActive
            ? 'bg-grey-9'
            : 'bg-' + store.settings.themeColor + '-1'
        "
      >
        <q-tab-panel
          name="edit"
          style="overflow: auto; padding-bottom: 24px; margin-bottom: 120px"
          :class="$q.screen.lt.sm ? '' : 'q-px-xl'"
        >
          <!--<FormTabCard
            :reset="reset"
            :validate="validate"
            :set-current-doc="setCurrentDoc"
            :updateFields="updateFields"
            :getDocument="getDocument"
          >
            <slot></slot>
          </FormTabCard>-->
          <slot></slot>
          <q-toolbar
            class="q-mt-xl q-pb-xl q-pt-sm"
            style="border-top: 1px inset"
          >
            <q-space />
            <LoadingButton
              no-caps
              unelevated
              :color="store.theme.color.light"
              label="Submit"
              class="q-ml-xs"
              icon-right="arrow_right"
              icon=""
              :submit="onSave"
              :loading="loading"
            />
            <q-btn
              unelevated
              icon="close"
              label="Cancel"
              color=""
              flat
              @click="close"
            />
          </q-toolbar>
        </q-tab-panel>

        <q-tab-panel
          name="attachments"
          style="overflow: auto; padding-bottom: 80px"
        >
          <AttachmentTabCard />
        </q-tab-panel>

        <q-tab-panel
          name="timeline"
          style="overflow: auto; padding-bottom: 80px"
        >
          <HistoryTabCard />
        </q-tab-panel>

        <q-tab-panel
          name="minutes"
          style="overflow: auto; padding-bottom: 80px"
          v-if="commentable"
        >
          <MinutesTabCard />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-card>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useQuasar, Notify, Dialog, debounce } from "quasar";
import {
  onMounted,
  ref,
  computed,
  inject,
  provide,
  watch,
  defineAsyncComponent,
} from "vue";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { useDefaultStore } from "src/stores/store";
import { firestore } from "src/composables/firebase";
import { update, create, onSubmit, onAssign } from "src/composables/remote";

const MinutesTabCard = defineAsyncComponent(() =>
  import("src/components/MinutesTabCard.vue")
);
const HistoryTabCard = defineAsyncComponent(() =>
  import("src/components/HistoryTabCard.vue")
);

const AttachmentTabCard = defineAsyncComponent(() =>
  import("src/components/AttachmentTabCard.vue")
);

const $q = useQuasar();
const store = useDefaultStore();
const tab = ref("edit");
const tabPanelsRef = ref(null);
const searchText = ref("");
const whereFilters = ref([]);
const route = useRoute();
const comment = ref("");

var collectionName = inject("collection");

const LoadingButton = defineAsyncComponent(() =>
  import("src/components/LoadingButton.vue")
);
const props = defineProps({
  reset: Function,
  validate: Function,
  setCurrentDoc: Function,
  getDocument: Function,
  updateFields: Array,
  searchFields: Array,
});

store.currentCollection = collectionName;
const currentCollection = computed({
  get: () => store.currentCollection,
  set: (v) => (store.currentCollection = collectionName = v),
});
//const currentDataSource = computed(() => store.query);
//store.searchResults = useCollection(currentDataSource);
const document_columns = [
  { name: "Title", field: "Title", label: "Title", align: "left" },
];
/*const showAssignDialog = computed(() => {
  return (
    store.user?.claims?.role === "Director" ||
    store.user?.claims?.role === "Head"
  );
});*/
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
/*function setDialogModel(val) {
  dialogModel.value = val;
}
function handleComment() {
  tabPanelsRef.value.next();
}*/
async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  loadDocument(doc.id);
}

function resetValues() {
  //store.tabModel = "search";
  currentDocument.value = {};
  store.searchResults = [];
  store.minutes = [];
}
async function onSave() {
  const result = await props.validate();
  if (result) {
    try {
      loading.value = true;
      //throw { message: "Please fill form fields correctly" };
      let data = props.getDocument();
      if (store.currentDocument?.id) {
        let dt = await update(
          store.currentDocument.id,
          data,
          //currentDocument.value,
          store.currentCollection
        );
      } else {
        let response = await create(
          data,
          store.currentCollection,
          props.searchFields
        );
        if (store.currentDocument) store.currentDocument.id = response;
        store.currentDocument = {};
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
    doc(collection(firestore, store.currentCollection), docId)
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
    if (hash) loadHash(hash);
  },
  { immediate: true }
);

watch(
  () => store.currentDocument,
  async (doc) => {
    props.setCurrentDoc(Object.assign({}, doc));
    //if (doc?.id) {
    /*const histSource = query(
        collection(firestore, store.currentCollection, doc.id, "History"),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
      store.minutes = useCollection(
        query(
          collection(firestore, store.currentCollection, doc.id, "Minutes"),
          orderBy("time", "asc")
        )
      );*/
    //}
  }
);

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

onMounted(async () => {
  resetValues();
  currentCollection.value = store.currentCollection;
  store.currentDocument = {};
  //editForm.value = props.getDocument()?.id ? false : true;
  tab.value = "edit";
  store.tabModel = "search";
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
