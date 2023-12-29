<template>
  <q-card flat class="my-card bg-transparent">
    <!--<q-bar class="transparent">
      <q-icon name="history" size="sm" class="q-mr-md" />
      <span class="text-bold"> {{ store.currentCollection }} / History</span>
    </q-bar>-->
    <q-card-section>
      <q-timeline
        color="secondary"
        :layout="$q.screen.gt.xs ? 'loose' : 'dense'"
      >
        <q-timeline-entry heading class="text-teal">History</q-timeline-entry>
        <q-timeline-entry
          v-for="(h, i) of store.history"
          :key="i"
          :title="h.op"
          :subtitle="new Date(h.date).toLocaleDateString('en-GB')"
        >
          <div>By: {{ h.user }}</div>
          <div v-if="h.op === 'Minuted'">To: {{ h.to }}</div>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { onMounted, watch } from "vue";
import { useCollection, useDocument } from "vuefire";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
const store = useDefaultStore();

watch(
  () => store.currentDocument,
  async (doc) => {
    if (doc?.id) {
      const histSource = query(
        collection(firestore, store.currentCollection, doc.id, "History"),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
    }
  },
  { immediate: true }
);
onMounted(async () => {

});
</script>
