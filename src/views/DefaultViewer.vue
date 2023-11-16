<template>
  <FormCard :on-save="onSave" :reset="reset" v-if="true">
    <slot></slot>
    <q-circular-progress
      indeterminate
      size="90px"
      :thickness="0.2"
      color="lime"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
      style="position: absolute; right: 24px; bottom: 60px"
      v-if="loading"
    />
  </FormCard>
  <!--<q-card flat="" square="" class="my-card">
    <q-splitter
      v-model="splitterModel"
      :horizontal="$q.screen.lt.md ? true : false"
      :limits="[minSplitterSize, 400]"
      unit="px"
      class="main-splitter"
    >
      <template v-slot:before>
        <SearchPanel :loading="loading" class="q-pb-xl left-panel" />
        <q-separator spaced inset vertical dark />
      </template>
      <template v-slot:separator>
        <div class="bg-transparent" :style="splitterStyle">
          <q-icon
            :color="$q.screen.lt.md ? 'accent' : 'white'"
            text-color="orange"
            size="28px"
            name="drag_indicator"
            class="slitter-icon"
          />
        </div>
      </template>
      <template v-slot:after>
        <FormCard :on-save="onSave" :reset="reset" v-if="true">
          <slot></slot>
          <q-circular-progress
            indeterminate
            size="90px"
            :thickness="0.2"
            color="lime"
            center-color="grey-8"
            track-color="transparent"
            class="q-ma-md"
            style="position: absolute; right: 24px; bottom: 60px"
            v-if="loading"
          />
        </FormCard>
        <q-card v-else class="q-ma-md shadow-22">
          <q-toolbar class="bg-purple text-white">
            <q-btn flat round dense :icon="iconName" />
            <q-toolbar-title>
              {{
                collectionName + " | " + store.currentDocument.Title ||
                store.currentDocument.Name ||
                store.currentDocument.Subject
              }}
            </q-toolbar-title>
            <q-btn flat round dense icon="edit" class="q-mr-xs" />
            <q-btn flat round dense icon="more_vert" />
          </q-toolbar>
          <q-card-section>
            <q-input
              v-for="(entry, i) of docData"
              :key="i"
              v-model="entry[1]"
              :label="entry[0]"
              type="text"
              disable=""
              outlined=""
              class="q-mb-xs q-pa-sm full-width"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat label="Export" icon="check" />
            <q-btn flat label="Print" icon="print" />
            <q-btn flat label="Reset" icon="clear" @click="reset" />
          </q-card-actions>
        </q-card>
      </template>
    </q-splitter>
  </q-card>-->
</template>

<script setup>
import {
  onMounted,
  onUpdated,
  ref,
  computed,
  inject,
  provide,
  watch,
 // watchEffect,
  //reactive,
} from "vue";
import { doc } from "firebase/firestore";
import { useRoute } from "vue-router";
import { useQuasar, Notify, Dialog, BottomSheet } from "quasar";
import { useDefaultStore } from "src/stores/store";
import * as remote from "../composables/remote";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy, where } from "firebase/firestore";
import { firestore } from "../composables/firebase";
import FormCard from "src/components/FormCard.vue";
//import SearchPanel from "src/components/SearchPanel.vue";
import { advancedSearch, loadDocuments } from "src/composables/searchProvider";
import { useDebounce } from "src/composables/use-debounce";
//import { usePaginate } from "src/composables/paginatefirestore";
//import PaginateWidget from "src/components/PaginateWidget.vue";
//import BatchedList from "src/components/BatchedList.vue";

const store = useDefaultStore();
const $q = useQuasar();
const loading = ref(false);
const searchText = ref("");
const whereFilters = ref([]);

const route = useRoute();

const comment = ref("");
const comments = ref([]);

const collectionName = inject("collection");
const searchFields = inject("searchFields");
//const staffList = computed(() => store.staffList);
//const paginate = usePaginate(collectionName, 5, "CreatedAt", "desc");

const pendingEdit = computed(
  () => Object.values(store.currentDocument).length > 0
);
//const q = computed(() => query(commentsDataSource, orderBy("Time", "asc")));
const emit = defineEmits(["search-item", "load-item"]);

const props = defineProps({
  validateForm: Function,
  resetForm: Function,
  updateFields: {
    type: Array,
    default: () => [],
  },
});

const splitterModel = computed(() => {
  return $q.screen.lt.md ? 240 : 340;
});
const minSplitterSize = computed(() => {
  return $q.screen.lt.md ? 160 : 280;
});
const splitterStyle = computed(() => {
  return $q.screen.lt.md ? "height:2px;width:100%" : "width:4px;height:100%";
});
/*const currentStaff = computed(() =>
  staffList.value.find((s) => s.Email === store.user?.email)
);
const isEditor = computed(() => {
  return (
    store.currentDocument.id === undefined ||
    store.currentDocument.meta?.To === store.user.email // ||
    //(store.currentDocument.meta.From === store.user.uid && store.currentDocument.Status === "Created") ||
    //(store.currentDocument.meta.UpdatedBy === store.user.uid && store.currentDocument.Status === "Updated")
  );
});
const docData = computed(() => {
  const entries = Object.entries(store.currentDocument);
  return entries.filter((e) => e[0] !== "meta" && e[0] !== "search");
});*/
async function onSearch(searchText, whereFilters) {
  loading.value = true;
  setTimeout(async () => {
    try {
      await advancedSearch(collectionName, {
        searchText: searchText,
        whereFilters: whereFilters,
      });
      setTimeout(async () => {
        await onLoad(store.searchResults[0] || {});
      }, 1500);
    } catch (error) {
      //loading.value = false;
      store.searchResults = [];
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Error",
        message: error.message,
        icon: "error",
        iconColor: "negative",
        position: "right",
      });
      console.log(error);
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }, 0);
}
async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  loadDocument();
}
async function onSave() {
  loading.value = true;
  const data = {};
  props.updateFields?.forEach((f) => {
    let d = store.currentDocument[f];
    if (d) {
      data[f] = d;
    }
  });
  try {
    const result = await props.validateForm();
    if (!result) {
      throw { message: "Please fill form fields correctly" };
    }
    store.currentDocument?.id
      ? await remote.update(store.currentDocument.id, data, collectionName)
      : await remote.create(
          store.currentDocument,
          collectionName,
          searchFields
        );
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
    /*BottomSheet.create({
      title: "Success",
      message: "Document updated successfully",
      grid: true,
      actions: [
        /* {
          label: "Drive",
          img: "https://cdn.quasar.dev/img/logo_drive_128px.png",
          id: "drive",
        },
        {
          label: "Keep",
          img: "https://cdn.quasar.dev/img/logo_keep_128px.png",
          id: "keep",
        },
        {
          label: "Google Hangouts",
          img: "https://cdn.quasar.dev/img/logo_hangouts_128px.png",
          id: "calendar",
        },
        {
          label: "Calendar",
          img: "https://cdn.quasar.dev/img/logo_calendar_128px.png",
          id: "calendar",
        },
        {},
        {
          label: "Share",
          icon: "share",
          id: "share",
        },
        {
          label: "Upload",
          icon: "cloud_upload",
          color: "primary",
          id: "upload",
        },
        {},
        {
          label: "John",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          id: "john",
        },
      ],
    })
      .onOk((action) => {
        // console.log('Action chosen:', action.id)
      })
      .onCancel(() => {
        // console.log('Dismissed')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });*/
  } catch (error) {
    console.error(error);
    Notify.create({
      timeout: 3000,
      textColor: "white",
      message: error.message,
      icon: "error",
      iconColor: "white",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

function reset() {
  store.currentDocument = {};
  store.history = [];
  pendingEdit.value = false;
  comment.value = "";
  props.resetForm();
}
const loadDocument = useDebounce(async () => {
  reset();
  const hash = window.location.hash;
  if (!hash || hash.length === 1) return;
  loading.value = true;
  const docId = hash.substring(1);
  //const collRef = collection(firestore, collectionName, );
  //const doc = await remote.get(docId, collectionName);
  const docSource = computed(() =>
    doc(collection(firestore, collectionName), docId)
  );
  // contact will always be in sync with the data source
  store.currentDocument = useDocument(docSource);
  loading.value = false;
}, 500);
provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("comment", comment);
provide("comments", comments);
provide("on-search", onSearch);
provide("on-load", onLoad);
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.fullPath,
  async () => {
    //alert("route fullPath updated", route.fullPath);
    await loadDocument();
  }
);
watch(
  () => store.currentDocument,
  async (doc) => {
    if (doc?.id !== undefined) {
      const histSource = query(
        collection(firestore, collectionName, doc.id, "History"),
        //where("doc", "==", doc.id),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
      store.minutes = useCollection(
        query(
          //collection(firestore, collectionName, doc.id, "Minutes"),
          collection(firestore, collectionName, doc.id, "Minutes"),
          //where("doc", "==", doc.id),
          orderBy("time", "asc")
        )
      );
    }
  }
);
onUpdated(async () => {
  //store.history = [];
  //await loadDocument();
});
onMounted(async () => {
  store.currentCollection = collectionName;
  store.currentDocument = {};
  store.searchResults = [];
  store.history = [];
  store.minutes = [];
  await loadDocument();
  //paginate.value = usePaginate(collectionName, 5, "CreatedAt", "desc");
  //await loadDocuments(collectionName, store.currentStaff);
  /*setTimeout(async () => {
    if (store.searchResults.length > 0)
      //store.currentDocument =store.searchResults.length > 0 ? store.searchResults[0] : {};
      onLoad(store.searchResults[0]?.id || 0);
  }, 1400);*/
});
</script>

<style>
.my-card {
  font-size: 1rem;
  border-radius: 0px;
}
.left-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.slitter-icon {
  margin-top: 3px;
  transform: translateX(-13px);
}
.menu-card {
  overflow: auto;
  border-radius: 1px 1px;
  font-size: 20px;
}
.q-input,
.q-select {
  font-size: 1em;
}
.main-splitter {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: calc(100vh - 74px);
  /*background-image: url(../assets/patterns.jpg);*/
}
@media only screen and (max-width: 900px) {
  .slitter-icon {
    margin-top: -8px;
    transform: rotate(90deg) translateX(-24px);
  }
}
</style>
