const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const get = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  const documentSnapshot = await getDoc(docRef);
  const document = { id: documentSnapshot.id, ...documentSnapshot.data() };
  return document;
};

const list = async (collectionName, limits, order = []) => {
  const dbRef = getFirestore().collection(collectionName);
  let q =
    order.length > 0
      ? query(dbRef, orderBy(...order), limit(limits || 25))
      : query(dbRef, limit(limits || 25));
  const querySnapshot = await getDocs(q);
  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });
  return list;
};

const advancedSearch = async (
  collectionName,
  { data, whereFilters, orderByFilters, start, limits }
) => {

  const dbRef = getFirestore().collection(collectionName);
  const _whereFilters = [];
  const _startAtFilters = [];
  const _orderByFilters = [];
  // First we build out all our search constraints
  const searchConstraints = [];
  //const data = dataGram(searchText || "");
  let query = null
  if (data && data.length > 0)
    query = dbRef.where(`search`, "array-contains-any", data);
  if (start) {
    query = dbRef.startAt(...start);
  }
  if (whereFilters) {
    whereFilters.forEach((w) => {
      _whereFilters.push(where(...w));
    });
  }
  if (orderByFilters) {
    orderByFilters.forEach((o) => {
      _orderByFilters.push(orderBy(...o));
    });
  }
  //console.log(searchConstraints, _whereFilters);
  const q = query(
    dbRef,
    ..._whereFilters,
    ...searchConstraints,
    //..._orderByFilters,
    ..._startAtFilters,
    limit(limits || 25)
  );
  /*const querySnapshot = await getDocs(q);
  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });
  return list;*/
  store.query = q;
  return store.searchResults;
};

const loadDocuments = async (collectionName, fields, limits = 1000) => {
  const db = getFirestore().collection(collectionName);
  const _whereFilters = [db.where("To", "==", staff.uid)];
  if (staff.Heads) {
    _whereFilters.push(db.where("Unit", "in", staff.Heads || []));
  } else {
    _whereFilters.push(
      ...[
        where("From", "==", staff.uid || ""),
      ]
    );
  }
  // First we build out all our search constraints
  //console.log(user);
  
  const q = query(dbRef, or(..._whereFilters), limit(limits || 25));

  return db.select(fields)
};

exports.listDocuments = onCall(async (request) => {});
