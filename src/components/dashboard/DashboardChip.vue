<template>
  <!--<q-chip
    v-show="snapshots?.length > 0"
    class="bg-transparent"
    style="font-size: large"
  >
    <q-avatar :color="bgColor" text-color="white">{{
      snapshots.length
    }}</q-avatar>
  </q-chip>-->
  <q-btn flat dense>
    <q-badge
      :color="bgColor"
      floating
      transparent
      v-show="snapshots?.length > 0"
    >
      {{ snapshots?.length }}
    </q-badge>
  </q-btn>
</template>

<script setup>
import {
  collection,
  query,
  where,
  and,
  or,
  limit,
  //getCountFromServer,
} from "firebase/firestore";
import { useCollection } from "vuefire";
import { firestore } from "src/composables/firebase";
import { useDefaultStore } from "src/stores/store";
import { useDefaultSerachQuery } from "src/composables/use-fn";

const db = firestore;
const store = useDefaultStore();
const props = defineProps({
  collectionName: String,
  bgColor: {
    type: String,
    default: "red",
  },
});

var snapshots = null;
if (props.collectionName !== "Admin") {
  const filters = useDefaultSerachQuery(props.collectionName);
  const dbRef = collection(db, props.collectionName);
  const dataSource = query(dbRef, and(...filters), limit(50));
  //const snapshot = await getCountFromServer(q);
  snapshots = useCollection(dataSource);
}

defineExpose({
  docs: () => snapshots.value,
});
//})
</script>
