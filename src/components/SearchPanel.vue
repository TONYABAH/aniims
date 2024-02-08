<template>
  <q-card
    dark
    class="search-card shadow-22"
    :class="$q.dark.isActive ? '' : 'bg-grey-1'"
    style="
      opacity: 0.8;
      border: 0px solid;
      border-radius: 0px 0px;
      max-width: 300px;
      border-radius: 5px;
    "
  >
    <q-toolbar
      style="padding: 0px"
      :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'"
    >
      <q-toolbar-title style="padding: 4px">
        <q-input
          v-if="!expandModel"
          v-model="searchText"
          rounded
          outlined
          type="search"
          placeholder="Enter search term"
          clear-icon="close"
          clearable=""
          dense
          :bg-color="
            $q.dark.isActive
              ? store.settings.themeColor
              : store.settings.themeColor + '-1'
          "
          style="font-size: 14px"
        >
          <template v-slot:append>
            <q-btn
              flat
              unelevated=""
              no-caps=""
              label=""
              icon="search"
              :loading="loading"
              v-close-popup
              class="right"
              @click.stop="onSearch()"
              style="border-radius: 0 2px 2px 0"
            />
          </template>
        </q-input>
        <label class="text-teal q-ml-md" v-else>Advanced search</label>
      </q-toolbar-title>
      <q-btn
        dense
        unelevated=""
        rounded=""
        flat
        color="teal"
        icon="arrow_right"
        class="q-mr-xs"
        :style="expandIconRotation"
        @click="expandModel = !expandModel"
      />
    </q-toolbar>
    <q-slide-transition>
      <q-form class="q-px-sm q-py-sm q-gutter-xs" v-if="expandModel">
        <q-input
          dense
          outlined=""
          label="Start date"
          stack-label=""
          v-model="search.date1"
          type="date"
        />
        <q-input
          dense
          outlined=""
          label="End date"
          stack-label=""
          v-model="search.date2"
          type="date"
        />
        <q-select
          v-model="search.location"
          :options="store.locations"
          options-dense=""
          label="Location"
          dense
          outlined=""
          clearable=""
          clear-icon="close"
          :disable="!isDirector"
        />
        <unit-input
          :set-model="(v) => (search.unit = v)"
          :model="search.unit"
          dense
          outlined
          title="Unit"
          label="Unit in charge"
          placeholder=""
          :search-options="{ location: search.location }"
          :disable="!isDirector"
        />
        <staff-input
          :set-model="(v) => (search.staff = v)"
          :model="search.staff"
          dense
          outlined
          title="Minuted to who?"
          label="Staff name"
          placeholder=""
          :search-options="{
            location: search.location,
            unit: search.unit?.Abbrev,
          }"
          :disable="!isDirector"
        />
        <q-select
          v-model="search.status"
          :options="status_options"
          options-dense=""
          label="Status"
          outlined=""
          dense=""
          clearable=""
          clear-icon="clear"
        />
        <div class="q-px-xs q-pt-xs">
          <q-input
            v-model="searchText"
            type="search"
            placeholder="Enter search term"
            dense
            clear-icon="close"
            clearable=""
            :bg-color="
              $q.dark.isActive
                ? store.settings.themeColor
                : store.settings.themeColor + '-1'
            "
            :autofocus="true"
            style="font-size: 14px"
            rounded
            outlined=""
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn
                no-caps=""
                unelevated=""
                flat
                :color="store.settings.themeColor"
                label="Search"
                :loading="loading"
                v-close-popup
                class="right"
                style="border-radius: 0 4px 4px 0"
                @click.stop="onSearch()"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-slide-transition>
  </q-card>
  <search-list
    v-if="!loading"
    :searchResults="searchResults"
    :activeClass="$q.dark.isActive ? 'text-orange' : 'text-orange'"
    class="q-my-xs"
    style="border-radius: 4px 4px 4px 4px"
  />
  <q-btn
    unelevated=""
    :color="store.theme.color.light"
    icon="add"
    icon-right="arrow_right"
    label="Add new"
    class="q-ma-xs"
    @click="addNewItem"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import {
  ref,
  computed,
  reactive,
  watch,
  defineAsyncComponent,
  onMounted,
} from "vue";
import {
  limit,
  collection,
  doc,
  query,
  where,
  or,
  and,
} from "firebase/firestore";

import { useCollection } from "vuefire";
import { useDefaultStore } from "src/stores/store";
import { dataGram } from "src/composables/searchProvider";
import { firestore } from "src/composables/firebase";
import UnitInput from "./forms/UnitInput.vue";
import StaffInput from "./forms/StaffInput.vue";
import {
  useSearchQuery,
  useDefaultSerachQuery,
  useStaffList,
} from "src/composables/use-fn";
import { getById } from "src/composables/remote";
const SearchList = defineAsyncComponent(() =>
  import("src/components/SearchList.vue")
);

const route = useRoute();
const db = firestore;
const store = useDefaultStore();
const expandModel = ref(false);
const searchText = ref("");
const search = ref({});
const loading = ref(false);
var searchResults = [];

const status_options = ["Active", "Assigned", "Submitted", "Open", "Closed"];

if (route.params.id && route.path.indexOf("Reports") > -1) {
  store.currentCollection = "Reports";
}
const isDirector = computed(() => store.user.claims.role === "Director");
const isHead = computed(() => store.user.claims.role.indexOf("Head") === 0);
const isAdmin = computed(() => store.user.claims.admin === true);

const expandIconRotation = computed(
  () =>
    `transform: rotate(${
      expandModel.value ? "-90deg" : "90deg"
    });cursor:pointer;`
);

function onSearch(filter) {
  loading.value = true;

  setTimeout(() => {
    expandModel.value = false;
    const searchConstraints = [];

    const dbRef = collection(
      db,
      route.params.id && route.path.indexOf("Reports") > 0
        ? `Investigations/${route.params.id}/Reports`
        : store.currentCollection
    );
    const data = dataGram(searchText.value || "");
    if (data && data.length > 0)
      searchConstraints.push(where(`meta.search`, "array-contains-any", data));
    const filters = filter || useSearchQuery(search.value);
    const dataSource = query(
      dbRef,
      ...filters,
      ...searchConstraints,
      limit(1000)
    );

    searchResults = useCollection(dataSource);

    let count = 0;
    let interval = setInterval(() => {
      count++;
      if (searchResults.value.length > 0) {
        clearInterval(interval);
        loading.value = false;
      }
      if (count > 15) {
        clearInterval(interval);
        loading.value = false;
      }
      //console.log(searchResults.value);
    }, 100);
  }, 0);
}

function addNewItem() {
  store.tabModel = "edit";
  store.currentDocument = {};
}
watch(
  () => route.path,
  async (path, old) => {
    if (path) {
      onSearch(useDefaultSerachQuery(store.currentCollection));
      return;
    }
  },
  { immediate: true }
);
onMounted(async () => {
  let staff = await getById(store.user.uid, "Users");
  //console.log(staff);
  search.value.unit = {
    Abbrev: staff?.Unit,
    Name: staff?.Unit,
  };
  //const { uid, displayName } = store.user;
  search.value.staff = staff; // || { uid, Name: displayName };
  search.value.location = staff?.Location; // store.user.claims.location;
});
defineExpose({
  //onSearch,
});
</script>
