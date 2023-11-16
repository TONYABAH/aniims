import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
//import { getFirestore, getDocs } from "firebase/firestore";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const store = useDefaultStore();
const staffList = ref([]);
const db = getFirestore();
const dbRef = collection(db, "Staff");
//var unsubscribe = null;
export const useStaffList = async (unit) => {
  const filter = unit
    ? [where("Units", "array-contains", unit), orderBy("Last", "asc")]
    : [orderBy("Last", "asc")];
  const dbRef = collection(db, "Staff");
  const q = query(dbRef, ...filter, limit(500));

  const unsubscribe = onSnapshot(q, (docsSnap) => {
    console.log(docsSnap);
    staffList.value = [];
    docsSnap.forEach((doc) => {
      const document = doc.data();
      document.id = doc.id;
      staffList.value.push(document);
    });
  });
  return { staffList: staffList.value, unsubscribe };
};
