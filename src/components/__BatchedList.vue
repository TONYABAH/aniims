<template>
  <div v-for="document in docs" :key="document.id">
    <p>{{ document.CreatedAt }} {{ document.Title }}</p>
  </div>
  <q-toolbar class="bg-purple text-white">
    <q-btn flat round dense icon="assignment_ind" />
    <q-toolbar-title> Toolbar </q-toolbar-title>
    <q-btn @click="loadPreviousPage">Previous</q-btn>
    <q-separator spaced inset vertical dark />
    <q-btn @click="loadNextPage">Next</q-btn>
  </q-toolbar>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCollection, useFirestore } from "vuefire";
import {
  collection,
  limit,
  orderBy,
  query,
  startAt,
  endBefore,
} from "firebase/firestore";

const firestore = useFirestore();

const collectionRef = collection(firestore, "Files");

const pageSize = ref(1);
const startLimit = ref(0);
const endLimit = ref(pageSize.value);
// Build a computed collection query
const collectionQuery = computed(() => {
  return query(
    collectionRef,
    orderBy("CreatedAt", "desc"),
    startAt(startLimit.value),
    endBefore(endLimit.value),
    limit(endLimit.value)
  );
});

const docs = useCollection(collectionQuery);

const loadNextPage = async () => {
  startLimit.value += pageSize.value;
  endLimit.value += pageSize.value;
};
const loadPreviousPage = async () => {
  startLimit.value -= pageSize.value;
  endLimit.value -= pageSize.value;
};
</script>
