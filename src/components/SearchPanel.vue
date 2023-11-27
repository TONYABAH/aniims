<template>
  <q-card
    flat
    dark
    class="search-card"
    :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-1'"
    style="border: 0px solid; border-radius: 0px 0px; max-width: 400px"
  >
    <q-toolbar :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-'">
      <q-toolbar-title>
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
          bg-color=""
          color="cyan"
          style="font-size: 16px"
          v-model="searchText"
        >
          <template v-slot:prepend> </template>
          <template v-slot:append>
            <q-btn
              glossy
              unelevated=""
              no-caps=""
              color="secondary"
              label=""
              icon="search"
              v-close-popup
              class="right"
              @click.stop="onSearch"
              style="border-radius: 0 2px 2px 0"
            />
          </template>
        </q-input>
        <label class="text-teal" v-else>Advanced search</label>
      </q-toolbar-title>
      <q-btn
        dense
        flat
        color="teal"
        icon="chevron_right"
        @click="expandModel = !expandModel"
        :style="expandIconRotation"
        rounded=""
      />
    </q-toolbar>
    <q-slide-transition>
      <q-form class="q-px-sm q-py-sm q-gutter-xs" v-if="expandModel">
        <q-input dense filled outlined="" v-model="search.date1" type="date" />
        <q-input dense filled outlined="" v-model="search.date2" type="date" />
        <div v-if="store.user.role === 'Director' || store.user.claims.admin">
          <q-select
            v-model="search.location"
            :options="store.locations"
            options-dense=""
            label="Location"
            dense
            filled
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
          filled
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
          filled
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
          filled
          outlined=""
          options-dense=""
          clearable=""
          clear-icon="close"
          option-value="StaffId"
          option-label="Name"
        />
        <q-input
          v-model="search.FileNumber"
          type="text"
          label="File number"
          dense
          filled
        />
        <div class="q-px-xs q-pt-xs">
          <q-input
            v-model="searchText"
            type="search"
            placeholder="Enter search term"
            dense
            clear-icon="close"
            clearable=""
            color="blue"
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
                glossy=""
                color="teal"
                label="Search"
                v-close-popup
                class="right"
                @click.stop="onSearch"
                style="border-radius: 0 4px 4px 0"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-slide-transition>
  </q-card>
  <q-circular-progress
    :thickness="0.2"
    indeterminate
    size="100px"
    color="lime"
    center-color="lime"
    track-color="secondary"
    class="q-ma-md"
    v-if="store.loading"
    style="position: absolute; top: 84px; z-index: 0"
  />
  <!--<q-item>
    <q-item-section thumbnail="" class="">
      <q-avatar color="" text-color="" :icon="iconName" size="32px" />
    </q-item-section>
    <q-item-section>
      <label class="text-bold text-h6">{{ collectionName }}</label>
    </q-item-section>
  </q-item>-->
  <!--<search-list
    :activeClass="$q.dark.isActive ? 'text-orange' : 'text-orange'"
    class="q-ma-xs"
    style="border-radius: 4px 4px 4px 4px"
  />-->
</template>

<script setup>
import { ref, inject, computed, reactive, defineExpose } from "vue";
import {
  limit,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  or,
  and,
} from "firebase/firestore";
import { useDefaultStore } from "src/stores/store";
import {
  advancedSearch,
  loadDocuments,
  dataGram,
} from "src/composables/searchProvider";
import { firestore } from "src/composables/firebase";
//import { useQuasar, Notify, Dialog, BottomSheet } from "quasar";
const db = firestore;
const collectionName = inject("collection");
//const iconName = inject("iconName");
const expandModel = ref(false);
const searchText = ref("");
const search = reactive({});
//const onSearch = inject("on-search");
const store = useDefaultStore();

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
  store.loading = true;
  expandModel.value = false;
  const searchConstraints = [];
  const dbRef = collection(db, collectionName);
  const data = dataGram(searchText.value || "");
  if (data && data.length > 0)
    searchConstraints.push(where(`meta.search`, "array-contains-any", data));
  const filters = computeQuery();
  const q = query(dbRef, and(...filters, ...searchConstraints), limit(1000));
  store.query = q;
  //props.onSearch(searchText.value, filters);
  store.loading = false;
}
defineExpose({
  onSearch,
});
</script>
