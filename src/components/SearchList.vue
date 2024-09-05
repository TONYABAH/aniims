<template>
  <q-slide-transition>
    <q-card class="my-card" style="opacity: 0.7">
      <q-card-section v-if="searchResults?.length > 0">
        <q-list>
          <q-item
            v-for="(item, i) of searchResults"
            dense=""
            clickable
            v-ripple
            :inset-level="0"
            :key="i"
            :active="link === item?.id"
            :active-class="
              $q.dark.isActive
                ? 'bg-red text-white'
                : store.theme.bg.normal + ' text-white'
            "
            style="
              border-bottom: 0px solid;
              border-radius: 2px 2px;
              font-size: 20px;
            "
            class="q-my-xs q-mx-x"
            @click="selectItem(item, i)"
          >
            <q-item-section
              top
              thumbnail=""
              class="q-pl-sm"
              style="color: inherit"
            >
              {{ i + 1 }}.
            </q-item-section>
            <q-item-section style="font-weight: bold">
              <div>
                {{
                  item["Title"] ||
                  item["Subject"] ||
                  item["Name"] ||
                  item["Address"]
                }}
              </div>
              <q-item-label lines="2" style="font-size: 12px">{{
                item["Address"]
              }}</q-item-label>
              <q-item-label lines="2" style="font-size: 12px">{{
                createdAt(item)
              }}</q-item-label>
            </q-item-section>
            <q-item-section side="" top v-if="isItemCurrent(item)">
              <q-icon name="star" color="amber" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label class="text-orange"
                >Search returned {{ searchResults?.length }} rows</q-item-label
              >
              <q-item-label caption lines="2"
                >{{ new Date().toLocaleString() }}.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-else>
        <label class="q-ml-md text-italic">{{ noResultsText }}</label>
      </q-card-section>
    </q-card>
  </q-slide-transition>
</template>

<script setup>
import { ref } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useDocument } from "vuefire";
import { firestore } from "src/composables/firebase";
import { collection, doc } from "firebase/firestore";
import { debounce } from "quasar";
//import { useDebounce } from "src/composables/use-debounce";

const store = useDefaultStore();
const link = ref(0);
const noResultsText = ref("No data to show yet...");

const props = defineProps({
  activeClass: {
    type: String,
    default: "bg-teal text-bold",
  },
  searchResults: {
    type: Array,
    default: () => [],
  },
});

const createdAt = function (item) {
  const time = item.meta?.CreatedAt;
  return new Date(time).toDateString();
};
function isItemCurrent(item) {
  return (
    item.meta?.To === store.user.uid ||
    (item.meta?.CreatedBy === store.user.uid && item.meta.Status === "Created")
  );
}
function selectItem(item, i) {
  link.value = item.id;
  //window.location.hash = "#" + item.id;
  store.tabModel = "edit";
  loadDocument(item.id);
}

const loadDocument = debounce(async (docId) => {
  store.loading = true;
  const docSource = doc(collection(firestore, store.currentCollection), docId);
  //currentDocument will always be in sync with the data source
  store.currentDocument = useDocument(docSource);
  //store.currentDocumentId = docId;
  store.loading = false;
  //tabPanelsRef.value="edit";
  store.tabModel = "edit";
}, 500);

/*async function onLoad(doc, i) {
  window.location.hash = "#" + doc.id;
  //loadDocument(doc.id);
}*/
//onMounted(() => {});
</script>
