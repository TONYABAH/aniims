<template>
  <div class="q-pa-md">
    <q-list dense v-if="documents">
      <q-item clickable v-ripple v-for="(item, i) of documents" :key="i">
        <q-item-section thumbnail="" class="q-pl-sm">
          <i>{{ startAt + i }}</i>
        </q-item-section>
        <q-item-section>{{ item?.subject }}</q-item-section>
      </q-item>
    </q-list>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>{{ currentLabel }} of {{ pageCount }}</q-toolbar-title>
      <q-btn
        flat
        dark
        color=""
        icon="arrow_back"
        label="Previous"
        :disable="disableBackButton"
        @click.stop="getPreviousPage()"
      />
      <q-separator spaced inset vertical dark />
      <q-btn
      dark
        flat
        color=""
        icon-right="arrow_forward"
        label="Next"
        :disable="disableNextButton"
        @click.stop="getNextPage()"
      />
    </q-toolbar>
    <q-toolbar class="bg-transparent">
      <q-pagination
        v-model="current"
        :min="minPage"
        :max="max"
        :max-pages="maxPages"
        direction-links=""
        boundary-links=""
        boundary-numbers=""
        :input="input"
        :ellipses="false"
      />
    </q-toolbar>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUpdated,
  inject,
  provide,
  watch,
  watchEffect,
  reactive,
} from "vue";
import { usePaginate } from "src/composables/paginatefirestore";
const props = defineProps({
  collectionName: String,
  maxPages: {
    type: Number,
    default: 5,
  },
  input: {
    type: Boolean,
    default: false,
  },
  ellipses: {
    type: Boolean,
    default: true,
  },
  minPage: {
    type: Number,
    default: 1,
  },
});

const current = ref(1);
const pageSize = 2;
const startAt = ref(1);
const paginate = usePaginate(
  props.collectionName,
  pageSize,
  "CreatedAt",
  "desc"
);
const pageCount = computed(() => paginate.documentCount.value);
const documents = computed(() => paginate.documents.value);
const disableBackButton = computed(() => startAt.value - pageSize < 1);
const disableNextButton = computed(() => documents.value.length < pageSize);

const max = computed(() => {
  let size = pageCount.value / pageSize;
  if (pageCount.value % pageSize > 0) {
    size += 1;
  }
  return size;
});
const currentLabel = computed(() => {
  if (pageSize + startAt.value - 1 >= pageCount.value) {
    return `${startAt.value}-${pageCount.value}`;
  } else {
    return `${startAt.value}-${pageSize + startAt.value - 1}`;
  }
});
function getNextPage() {
  startAt.value += pageSize;
  paginate.useNextPage();
}
function getPreviousPage() {
  startAt.value -= pageSize;
  paginate.usePreviousPage();
}
watch(current, (newValue, old) => {
  if (newValue > old) {
    getNextPage(newValue);
  } else if (newValue < old) {
    getPreviousPage(newValue);
  }
});
</script>
