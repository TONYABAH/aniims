<template>
  <q-slide-transition>
    <q-list dense v-if="store.searchResults.length > 0">
      <q-item
        v-for="(item, i) of store.searchResults"
        dense=""
        clickable
        v-ripple
        :inset-level="0"
        :active-class="activeClass"
        :key="i"
        :active="link === i"
        @click="selectItem(item, i)"
        style="border-bottom: 0px solid; border-radius: 2px 2px"
        class="q-my-xs q-mx-x"
      >
        <q-item-section top thumbnail="" class="q-pl-sm" style="color: inherit">
          {{ i + 1 }}
        </q-item-section>
        <q-item-section class="" style="font-weight: bold; color: inherit">
          <div>
            {{
              item["Title"] ||
              item["Subject"] ||
              item["Name"] ||
              item["Address"]
            }}
          </div>
          <q-item-label lines="2" caption="" style="font-size: 12px">{{
            item["Address"]
          }}</q-item-label>
          <q-item-label lines="2" caption="" style="font-size: 12px">{{
            createdAt(item)
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="text-orange"
            >Search returned {{ store.searchResults.length }} rows</q-item-label
          >
          <q-item-label caption lines="2"
            >{{ new Date().toLocaleString() }}.</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </q-slide-transition>
  <label
    v-if="store.searchResults.length === 0"
    class="q-ml-md text-teal text-italic"
    >{{ noResultsText }}</label
  >
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
//import { useRoute } from "vue-router";

//const route = useRoute();
const store = useDefaultStore();
const $q = useQuasar();
const link = ref(0);
const onLoad = inject("on-load");
const noResultsText = ref("No data to show yet...");

const props = defineProps({
  activeClass: {
    type: String,
    default: "bg-teal text-bold",
  },
});

const createdAt = function (item) {
  const time = item.meta.CreatedAt;
  return new Date(time).toDateString();
};
function selectItem(item, i) {
  link.value = i;
  //console.log(item);
  //window.location.hash = "#" + item.id;
  onLoad(item, i);
}

onMounted(() => {});
</script>
