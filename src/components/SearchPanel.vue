<template>
  <q-card
    flat
    dark
    class="search-card"
    :class="$q.dark.isActive ? '' : 'bg-grey-1'"
    style="
      opacity: 0.8;
      border: 0px solid;
      border-radius: 0px 0px;
      max-width: 400px;
      border-radius: 25px;
    "
  >
    <q-toolbar
      style="padding: 0px"
      :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'"
    >
      <q-toolbar-title style="padding: 4px">
        <q-input
          v-if="!expandModel"
          dense
          rounded
          outlined
          type="search"
          placeholder="Enter search term"
          clear-icon="close"
          clearable=""
          input-class="text-bold"
          :bg-color="
            $q.dark.isActive
              ? store.settings.themeColor
              : store.settings.themeColor + '-2'
          "
          color="cyan"
          style="font-size: 16px; padding: 0"
          v-model="searchText"
        >
          <template v-slot:prepend> </template>
          <template v-slot:append>
            <q-btn
              glossy
              push=""
              unelevated=""
              no-caps=""
              :color="store.settings.themeColor"
              label=""
              icon="search"
              :loading="loading"
              v-close-popup
              class="right"
              @click.stop="onSearch"
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
        glossy=""
        flat
        color="teal"
        icon="chevron_right"
        class="q-mr-xs"
        :style="expandIconRotation"
        @click="expandModel = !expandModel"
      />
    </q-toolbar>
    <q-slide-transition>
      <q-form class="q-px-sm q-py-sm q-gutter-xs" v-if="expandModel">
        <q-input dense outlined="" v-model="search.date1" type="date" />
        <q-input dense outlined="" v-model="search.date2" type="date" />
        <div v-if="store.user.role === 'Director' || store.user.claims.admin">
          <q-select
            v-model="search.location"
            :options="store.locations"
            options-dense=""
            label="Location"
            dense
            outlined=""
            clearable=""
            clear-icon="close"
          />
        </div>
        <q-select
          v-model="search.unit"
          :options="units"
          label="Unit in charge"
          dense
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
        />
        <q-select
          v-model="search.staff"
          :options="staffList"
          label="Minuted to Staff"
          dense
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
          option-value="StaffId"
          option-label="Name"
        />
        <q-select
          v-model="search.from"
          :options="staffList"
          label="Created by Staff"
          dense
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
          option-value="StaffId"
          option-label="Name"
        />
        <!--<q-input
          v-model="search.FileNumber"
          type="text"
          label="File number"
          dense
        />-->
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
                : store.settings.themeColor + '-2'
            "
            color="cyan"
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
                push
                glossy=""
                :color="store.settings.themeColor"
                label="Search"
                :loading="loading"
                v-close-popup
                class="right"
                style="border-radius: 0 4px 4px 0"
                @click.stop="onSearch"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-slide-transition>
  </q-card>
  <search-list
    v-if="!loading"
    :searchResults="store.searchResults"
    :activeClass="$q.dark.isActive ? 'text-orange' : 'text-orange'"
    class="q-ma-xs"
    style="border-radius: 4px 4px 4px 4px"
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

const route = useRoute();
const db = firestore;
const store = useDefaultStore();
const collectionName = computed(() => store.currentCollection);
const expandModel = ref(false);
const searchText = ref("");
const search = reactive({});
const loading = ref(false);

const SearchList = defineAsyncComponent(() =>
  import("src/components/SearchList.vue")
);
const units = computed(() => {
  if (store.user.role !== "Director" && !store.user.claims?.admin) {
    return store.user.claims.units;
  }
  return search.location
    ? store.units
        .filter((u) => u.Location === search.location)
        .map((u) => u.Abbrev)
    : store.units.map((u) => u.Abbrev);
});

const staffList = computed(() => {
  if (
    store.user.claims.role !== "Head" &&
    store.user.claims.role !== "Director" &&
    !store.user.claims.admin
  ) {
    return store.staffList.filter((s) => s.uid === store.user.uid);
  }
  return search.unit
    ? store.staffList.filter((s) => s.Units?.includes(search.unit))
    : store.staffList;
});

const expandIconRotation = computed(
  () =>
    `transform: rotate(${
      expandModel.value ? "-90deg" : "90deg"
    });cursor:pointer;`
);

function computeQuery() {
  const searchFilters = [];
  if (search.location) {
    searchFilters.push(where("Location", "==", search.location));
  }
  if (search.unit && !search.staff) {
    searchFilters.push(where("Unit", "==", search.unit));
  }
  if (
    store.user.claims?.role !== "Director" &&
    store.user.claims?.admin !== true
  ) {
    searchFilters.push(
      or(
        where("meta.To", "==", store.user.uid),
        and(
          where("meta.CreatedBy", "==", store.user.uid),
          where("meta.Status", "==", "Created")
        )
      )
    );
  } else if (search.staff?.uid) {
    //(store.user.claims?.role !== "Director" && !store.user.claims?.admin)
    searchFilters.push(where("meta.To", "==", search.staff?.uid));
  }
  if (search.from) {
    //(store.user.claims?.role !== "Director" && !store.user.claims?.admin)
    searchFilters.push(where("meta.From", "==", search.staff?.uid));
    //searchFilters.push(["Status", "==", "Created"]);
  }
  if (search.date1) {
    //console.log(Date.parse(search.date1));
    searchFilters.push(
      where(
        "meta.CreatedAt",
        ">=",
        Date.parse(new Date(search.date1).toDateString())
      )
    );
  }
  if (search.date2) {
    searchFilters.push(where("meta.CreatedAt", "<=", Date.parse(search.date2)));
  }
  return searchFilters;
}

function onSearch() {
  loading.value = true;
  setTimeout(() => {
    expandModel.value = false;
    const searchConstraints = [];
    const dbRef = collection(db, collectionName.value);
    const data = dataGram(searchText.value || "");
    if (data && data.length > 0)
      searchConstraints.push(where(`meta.search`, "array-contains-any", data));
    const filters = computeQuery();
    const dataSource = query(
      dbRef,
      and(...filters, ...searchConstraints),
      limit(1000)
    );
    store.searchResults = useCollection(dataSource);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (store.searchResults.length > 0) {
        clearInterval(interval);
        loading.value = false;
      }
      if (count > 5) {
        clearInterval(interval);
        loading.value = false;
      }
    }, 1000);
  }, 0);
}
function initialSearch() {
  loading.value = true;
  setTimeout(() => {
    expandModel.value = false;
    const searchConstraints = [];
    const dbRef = collection(db, collectionName.value);
    searchConstraints.push(
      or(
        where("meta.To", "==", store.user.uid),
        and(
          where("meta.CreatedBy", "==", store.user.uid),
          where("meta.Status", "==", "Created")
        )
      )
    );
    //searchConstraints.push(where(`meta.To`, "==", store.user.uid));
    //const filters = computeQuery();
    const dataSource = query(dbRef, ...searchConstraints, limit(1000));
    store.searchResults = useCollection(dataSource);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (store.searchResults.length > 0) {
        clearInterval(interval);
        loading.value = false;
      }
      if (count > 5) {
        clearInterval(interval);
        loading.value = false;
      }
    }, 1000);
  }, 0);
}
watch(
  () => route.path,
  async (path, old) => {
    if (path !== old) {
      initialSearch();
      //store.currentDocument = {};
      return;
    }
  },
  { immediate: true }
);
//onMounted(() => setTimeout(() => initialSearch(), 0));
defineExpose({
  onSearch,
});
</script>
