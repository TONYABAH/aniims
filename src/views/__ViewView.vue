<template>
  <q-card flat="" square="" class="my-card">
    <q-splitter
      v-model="splitterModel"
      :horizontal="$q.screen.lt.md ? true : false"
      :limits="[minSplitterSize, 400]"
      unit="px"
      class="main-splitter"
    >
      <template v-slot:before>
        <q-card flat>
          <advanced-search></advanced-search>
          <q-circular-progress
            indeterminate
            size="42px"
            :thickness="0.2"
            color="lime"
            center-color="pink"
            track-color="transparent"
            class="q-ma-md"
            v-if="loadingSearch"
          />
          <search-list
            :loadItem="onLoad"
            :activeClass="
              $q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-negative text-white'
            "
          />
        </q-card>
      </template>
      <template v-slot:separator>
        <div class="bg-deep-purple" :style="splitterStyle">
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
        <q-card flat class="my-card q-pb-xl q-mb-xl">
          <q-bar class="bg-purple-10 text-white q-pb-xs">
            <q-tabs
              v-model="tab"
              narrow-indicator=""
              indicator-color=""
              inline-label=""
            >
              <q-tab name="form" icon="edit" label="Form" />
              <q-tab name="comments" icon="comment" label="Comments" />
            </q-tabs>
          </q-bar>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="form">
              <slot name="form">Form slot</slot>
            </q-tab-panel>
            <q-tab-panel name="comments">
              <CommentsPanel />
            </q-tab-panel>
          </q-tab-panels>
          <MainButtonPanel :on-save="onSave" :reset="reset" />
        </q-card>
      </template>
    </q-splitter>
  </q-card>
  <FloatingEditorButtons />
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
  reactive,
} from "vue";
import { useQuasar, Notify, Dialog } from "quasar";
//import { useRoute } from "vue-router";

import { useDefaultStore } from "src/stores/store";
//import AssignDialog from "src/components/AssignDialog.vue";
import SearchList from "src/components/SearchList.vue";
//import CommentsForm from "src/components/CommentsForm.vue";
import AdvancedSearch from "src/components/AdvancedSearch.vue";
//import SpreadSheet from "src/components/SpreadSheet.vue";
import { advancedSearch } from "../composables/searchProvider";
import * as remote from "../composables/remote";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy } from "firebase/firestore";
import { firestore } from "../composables/firebase";
import MainButtonPanel from "src/components/MainButtonPanel.vue";
//import EditorToolButtons from "src/components/EditorToolButtons.vue";
import FloatingEditorButtons from "src/components/FloatingEditorButtons.vue";
//import CommentsWidget from "src/components/CommentsWidget.vue";
import CommentsPanel from "src/components/CommentsPanel.vue";

const store = useDefaultStore();
const $q = useQuasar();
const loadingSearch = ref(false);
const searchText = ref("");
const whereFilters = ref([]);
const link = ref(0);
const comment = ref("");
const comments = ref([]);
const collectionName = inject("collection");
const searchFields = inject("searchFields");
//const chatMode = ref(true);
//const expanded = ref(true);
const tab = ref("form");
const staffList = computed(() => store.staffList);
const pendingEdit = computed(
  () => Object.values(store.currentDocument).length > 0
);
//const q = computed(() => query(commentsDataSource, orderBy("Time", "asc")));
//store.history = useCollection(commentsDataSource);
const emit = defineEmits(["search-item", "load-item"]);

const props = defineProps({
  validateForm: Function,
  resetForm: Function,
  updateFields: {
    type: Array,
    default: () => ["Name", "Title"],
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
const currentStaff = computed(() =>
  staffList.value.find((s) => s.Email === store.user?.email)
);
/*const showSave = computed(() => store.currentDocument?.id !== undefined);

const isDocumentSubmitted = computed(
  () => store.currentDocument?.To !== undefined
);

const isAuthor = computed(() =>
  staffList.value.find((s) => s.CreatedBy === store.user?.uid)
);
const role = computed(() => currentStaff.value?.Role);

const ROLES = {
  DIRECTOR: "Director",
  HOD: "HOD",
  HOU: "HOU",
  RO: "Officer",
  ADMIN: "Admin",
  SEC: "Secretary",
};*/

async function onSearch(searchText, whereFilters) {
  loadingSearch.value = true;
  //console.log(searchText, whereFilters);
  try {
    await advancedSearch(collectionName, {
      searchText: searchText,
      whereFilters: whereFilters,
    });
    setTimeout(() => {
      onLoad(store.searchResults[0] || {}, 0);
    }, 500);
  } catch (error) {
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
    loadingSearch.value = false;
  }
}
async function onLoad(item, i) {
  link.value = i;
  store.currentDocument = item;
  store.history = item.id
    ? useCollection(
        query(
          collection(firestore, collectionName, item.id, "History"),
          orderBy("Time", "asc")
        )
      )
    : [];
}
async function onSubmitComment() {
  try {
    await remote.addComment(
      collectionName,
      store.currentDocument.id,
      comment.value
    );
    //history.value.push(resp);
    comment.value = "";
    Notify.create({
      timeout: 1000,
      closeBtn: true,
      caption: "Success",
      message: "Comment submitted",
      icon: "check",
      iconColor: "white",
      position: "right",
      color: "teal",
      badgeTextColor: "white",
    });
  } catch (error) {
    console.log(error);
    Notify.create({
      timeout: 3000,
      closeBtn: true,
      caption: "Error",
      message: "There were errors",
      icon: "error",
      iconColor: "white",
      position: "right",
      color: "negative",
      badgeTextColor: "white",
    });
  }
}
async function onSubmit() {
  try {
    //if (store.currentDocument.Assign) return onSubmitComment();
    if (store.currentDocument.id) {
      const staff = store.staffList.find((s) => s.Email === store.user.email);
      let superior = null;
      if (staff.Role === "HOU" || staff.Role === "HOD") {
        superior = store.staffList.find((s) => s.Role === "Director");
      } else {
        superior = store.staffList.find(
          (s) =>
            (s.Role === "HOU" || s.Role === "HOD") &&
            typeof s.Heads === "object" &&
            s.Heads.includes(staff.Units["0"])
        );
      }
      if (!superior)
        throw {
          message: "No superior to submit document to. Please add a superior.",
        };
      await remote.update(
        store.currentDocument.id,
        { To: superior.Email },
        collectionName
      );
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document submitted",
        icon: "check",
        iconColor: "white",
        position: "top-right",
        color: "teal",
        badgeTextColor: "white",
      });
    } else {
      throw { message: "No document loaded" };
    }
  } catch (e) {
    Notify.create({
      timeout: 3000,
      closeBtn: true,
      caption: "Superior not found",
      message: e.message,
      icon: "error",
      iconColor: "white",
      position: "top-right",
      color: "red",
      badgeTextColor: "white",
      textColor: "white",
    });
  }
}
async function onDelete() {
  Dialog.create({
    title: "Delete item",
    color: "red",
    message: "The item will be permanently deleted",
    cancel: "Cancel",
    ok: "Yes delete",
  }).onOk(async () => {
    try {
      await remote.remove(store.currentDocument.id, collectionName);
      store.currentDocument = {};
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document deleted",
        icon: "check",
        iconColor: "secondary",
        position: "right",
      });
    } catch (e) {
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Error",
        message: e.message,
        icon: "error",
        iconColor: "negative",
      });
    }
  });
}
async function onSave() {
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
  } catch (error) {
    Notify.create({
      timeout: 3000,
      textColor: "white",
      message: error.message,
      icon: "error",
      iconColor: "white",
      color: "red",
    });
  }
}

function reset() {
  store.currentDocument = {};
  store.history = [];
  pendingEdit.value = false;
  comment.value = "";
  props.resetForm();
}

provide("searchText", searchText);
provide("whereFilters", whereFilters);
provide("comment", comment);
provide("comments", comments);
provide("searchDocument", onSearch);
provide("loadItem", onLoad);
//provide("submit-comment", onSubmitComment);
//provide("submit", onSubmit);

onUpdated(() => {
  store.history = [];
});
onMounted(async () => {
  store.currentCollection = collectionName;
  store.currentDocument = {};
  store.searchResults = [];
  store.currentStaff = currentStaff.value;
});
</script>

<style scoped>
.my-card {
  font-size: 1rem;
  border-radius: 0px;
}
.left-panel {
  position: absolute;
  display: block;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.slitter-icon {
  margin-top: 3px;
  transform: translateX(-13px);
}
.main-splitter {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: calc(100vh - 64px);
  /*background-image: url(../assets/patterns.jpg);*/
}
@media only screen and (max-width: 900px) {
  .slitter-icon {
    margin-top: -8px;
    transform: rotate(90deg) translateX(-24px);
  }
}
</style>
