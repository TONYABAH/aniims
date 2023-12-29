import { ref, computed, watch, watchEffect } from "vue";
import { useCollection, useFirestore } from "vuefire";
import {
  doc,
  collection,
  getDoc,
  limit,
  orderBy,
  query,
  startAfter,
  endBefore,
  startAt,
  endAt,
  getCountFromServer,
  // DocumentData,
} from "firebase/firestore";

export function usePaginate(
  collectionName,
  getQuery
  //docsPerFetch
  //oderByField,
  //orderDirection
) {
  const firestore = useFirestore();
  //const docsPerFetch = size;
  const lastVisibleDocSnap = ref();
  const firstVisibleDocSnap = ref();
  const collectionRef = collection(firestore, collectionName);
  const direction = ref("");
  const documentCount = ref(0);

  /*function __getQuery(cursor, snapshot) {
    if (!snapshot || snapshot?.length === 0) {
      // Default query
      return query(
        collectionRef,
        orderBy(oderByField, orderDirection),
        limit(fetchSize)
      );
    } else {
      // Paginated query
      return query(
        collectionRef,
        orderBy(oderByField, orderDirection),
        cursor(snapshot),
        limit(fetchSize)
      );
    }
  }*/

  //Build a computed collection query
  const collectionQuery = computed(() => {
    return direction.value === "+"
      ? getQuery(startAfter, lastVisibleDocSnap.value)
      : getQuery(endBefore, firstVisibleDocSnap.value);
  });

  let vueFireDocs = useCollection(collectionQuery);

  watch(vueFireDocs, async (d) => {
    const snapshot = await getCountFromServer(query(collectionRef));
    console.log("count: ", snapshot.data().count);
    documentCount.value = snapshot.data().count || 0;
  });

  watch(direction, async (d) => {
    if (direction.value === "+") {
      const lastVisibleDoc = vueFireDocs.value[vueFireDocs.value.length - 1];
      if (!lastVisibleDoc) return;
      const lastVisibleDocRef = doc(
        firestore,
        collectionName,
        lastVisibleDoc.id
      );
      lastVisibleDocSnap.value = await getDoc(lastVisibleDocRef);
    }
    //console.log(allDocs.value);
    if (direction.value === "-") {
      const firstVisibleDoc = vueFireDocs.value[0];
      if (!firstVisibleDoc) return;
      const firstVisibleDocRef = doc(
        firestore,
        collectionName,
        firstVisibleDoc.id
      );
      firstVisibleDocSnap.value = await getDoc(firstVisibleDocRef);
      //vueFireDocs.value = useCollection(collectionQuery);
    }
    //vueFireDocs.value = useCollection(collectionQuery);
  });

  return {
    // When "Next" button is clicked change the lastVisibleDocSnap
    // Because lastVisibleDocSnap is tracked in the computed collection query it triggers useCollection to get new docs
    // Those new docs are then pushed into the allDocs array via the watch above
    useNextPage: async (page) => {
      direction.value = "+";
    },
    usePreviousPage: async (page) => {
      direction.value = "-";
    },
    documents: vueFireDocs,
    documentCount,
  };
}
