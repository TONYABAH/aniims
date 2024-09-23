<template>
  <div class="text-bold">
    <div v-if="store.minutes?.length > 0" class="full-width">
      <q-expansion-item
        v-model="expanded"
        expand-separator
        icon="comment"
        label="Minutes"
        caption=""
        dense=""
        dense-toggle=""
        style="border-radius: 2px 2px"
        class="q-pb-xl"
      >
        <template v-slot:header>
          <q-toolbar class="full-width">
            <q-icon name="comment" />
            <q-toolbar-title>Minutes</q-toolbar-title>
            <q-toggle v-model="store.chatMode" color="primary" label="Chat" />
          </q-toolbar>
        </template>
        <CommentsWidget :comments="store.minutes" />
      </q-expansion-item>
    </div>
    <div v-else class="full-width">
      <i>No minutes</i>
    </div>
  </div>
</template>
<script setup>
import CommentsWidget from "./CommentsWidget.vue";
import { ref, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useCollection, useDocument } from "vuefire";
import { collection, query, where, orderBy, doc } from "firebase/firestore";
import { firestore } from "src/composables/firebase";

const store = useDefaultStore();
const expanded = ref(true);
/*const props = defineProps({
  //handleComment: Function,
  minutes: {
    type: Array,
    default: () => [],
  },
});*/
watch(
  () => store.currentDocument,
  async (doc) => {
    if (doc?.id) {
      store.minutes = useCollection(
        query(
          collection(
            firestore,
            //store.currentCollection,
            //store.currentDocument.id,
            "Minutes"
          ),
          where("DocId", "==", store.currentDocument.id),
          orderBy("Date", "asc")
        )
      );
    }
  },
  { immediate: true }
);
</script>
