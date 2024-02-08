import {
  limit,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  or,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { useDefaultStore } from "src/stores/store";
//import { array } from "i/lib/util";
const db = firestore;

const GENERATION_OFFSET = new Date("5000-01-01").getTime();
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//const offset = 500;
const EXCLUSION = [
  "a",
  "i",
  "am",
  "is",
  "are",
  "in",
  "at",
  "of",
  "and",
  "his",
  "him",
  "her",
  "for",
  "so",
  "the",
  "then",
  "this",
  "my",
  "me",
];
// This will generate an id in chronological reverse order.
// This means the default sort of objects added using this ID will return newest first.
// If this code survives past year 5000, you will experience Y5K.
export const generateId = () => {
  let autoId = "";
  // Add some randomness to avoid data clashes.
  // If records come in that close, I don't care which one shows first, otherwise I
  // will have to make sure the randomness is ordered correctly.
  for (let i = 0; i < 10; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return (GENERATION_OFFSET - Date.now()).toString(32) + autoId;
};

export const dataGram = (txt) => {
  if (txt) txt = txt.trim();
  if (!txt || txt.length === 0) return {};
  const map1 = [];
  if (txt.match(/^\"[^\"]+\"$/g)) {
    //map[txt.replace(/\"/g, "").toLowerCase()] = true;
    return [txt.replace(/\"/g, "").toLowerCase()];
  }
  const s1 = (txt || "").toLowerCase();
  const words = s1.split(/[\s\,\;\:\?!\-_\/]/g);
  for (let i = 0; i < words.length; i++) {
    const wrds = [];
    for (let j = i; j < words.length; j++) {
      wrds.push(words[j]);
      const wd = wrds.join(" ").trim();
      if (EXCLUSION.find((w) => w === wd) === undefined) {
        if (wd.length > 0) {
          if (!map1.includes(wd)) map1.push(wd);
        }
      }
    }
  }
  return map1;
};
// Generates a trigram
const dataGramBasic = (txt) => {
  //return (nGram(txt));
  if (!txt || txt.trim().length === 0) return {};
  const map = {};
  const regEx = new RegExp(EXCLUSION.join("|"), "ig");
  const s1 = (txt || "").toLowerCase().replace(regEx, "");
  const words = s1.split(/[\s\,\;\:\?!\-_\/]/g);
  for (let word of words) {
    if (EXCLUSION.find((w) => w === word) === undefined) {
      map[word] = true;
    }
  }
  return map;
};
export const addSearch = (fields) => {
  //const mergedField = [];
  const map = [];
  for (let field of fields) {
    // mergedField.push(field || "");
    const d = dataGram(field);
    if (d.length > 0)
      d.map((v) => {
        if (!map.includes(v)) map.push(v);
      });
    //Object.assign(map, d);
  }
  //return dataGram(mergedField.join(" ").slice(0, offset));
  return map;
};
function filterQuery(field, op, value) {
  return where(field, op, value);
}
export const advancedSearch = async (
  collectionName,
  { searchText, whereFilters, orderByFilters, start, limits }
) => {
  const store = useDefaultStore();
  const dbRef = collection(db, collectionName);
  const _whereFilters = [];
  const _startAtFilters = [];
  const _orderByFilters = [];
  // First we build out all our search constraints
  const searchConstraints = [];
  const data = dataGram(searchText || "");
  if (data && data.length > 0)
    searchConstraints.push(where(`search`, "array-contains-any", data));
  if (start) {
    _startAtFilters.push(startAt(...start));
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
export const lifeSearch = async (
  collectionName,
  { searchText, whereFilters, orderByFilters, start, limits }
) => {
  //const store = useDefaultStore();
  const dbRef = collection(db, collectionName);
  const _whereFilters = [];
  const _startAtFilters = [];
  const _orderByFilters = [];
  // First we build out all our search constraints
  const searchConstraints = [];
  const data = dataGram(searchText || "");

  if (data && data.length > 0)
    searchConstraints.push(where(`meta.search`, "array-contains-any", data));
  if (start) {
    _startAtFilters.push(startAt(...start));
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
  const q = query(
    dbRef,
    ..._whereFilters,
    ...searchConstraints,
    ..._orderByFilters,
    ..._startAtFilters,
    limit(limits || 25)
  );
  const querySnapshot = await getDocs(q);

  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });
  return list;
};
export const simpleSearch = async (
  collectionName,
  { whereFilters, orderByFilters, start, limits }
) => {
  //const store = useDefaultStore();
  const dbRef = collection(db, collectionName);
  const _whereFilters = [];
  const _startAtFilters = [];
  const _orderByFilters = [];
  // First we build out all our search constraints
  const searchConstraints = [];
  if (start) {
    _startAtFilters.push(startAt(...start));
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
  const q = query(
    dbRef,
    ..._whereFilters,
    ..._startAtFilters,
    limit(limits || 25)
  );
  const querySnapshot = await getDocs(q);

  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });
  return list;
};
export const loadDocuments = async (collectionName, staff, limits) => {
  if (!staff) return;
  const store = useDefaultStore();
  const dbRef = collection(db, collectionName);
  const _whereFilters = [where("To", "==", staff.uid)];
  if (staff.Heads) {
    _whereFilters.push(where("Unit", "in", staff.Heads || []));
  } else {
    _whereFilters.push(
      ...[
        where("From", "==", staff.uid || ""),
        //where("meta.To", "==", staff?.uid || ""),
      ]
    );
  }
  // First we build out all our search constraints
  const q = query(dbRef, or(..._whereFilters), limit(limits || 25));
  store.query = q;
  return store.searchResults;
};

/*function filterQueries(where_clauses = []) {
  const query = [];
  where_clauses.forEach((w) => {
    query.push(filterQuery(w[0], w[1], w[2]));
  });
  return query;
}
const __fullTextSearch = async function (
  collectionName,
  searchTxt,
  limits = 10
) {
  // First we build out all our search constraints
  const searchConstraints = [];
  dataGram(searchTxt).forEach((name) =>
    searchConstraints.push(where(`search.${name}`, "==", true))
  );

  // Combine that with any other search constraint
  let constraints = [
    collection(firestore, collectionName),
    ...searchConstraints,
    limit(limits),
  ];

  // Build the query and get the documents
  const q = query.apply(this, constraints);
  const querySnapshot = await getDocs(q);

  const results = [];
  querySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  return results;
};

const __simpleSearch = async (
  collectionName,
  { searchText, whereFilters, start, limits }
) => {
  const dbRef = collection(db, collectionName);
  const _whereFilters = [];
  const _startAtFilters = [];
  const searchConstraints = [];
  const data = dataGram(searchText || "");
  Object.keys(data).forEach((name) =>
    searchConstraints.push(where(`search.${name}`, "==", true))
  );
  if (start) {
    _startAtFilters.push(startAt(...start));
  }
  if (whereFilters) {
    whereFilters.forEach((w) => {
      _whereFilters.push(where(...w));
    });
  }
  const q = query(
    dbRef,
    ..._whereFilters,
    ...searchConstraints,
    ..._startAtFilters,
    limit(limits || 25)
  );
  const querySnapshot = await getDocs(q);
  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });
  return list;
};
// GMAIL App Password: qnsgnzeyoyevcaac
*/
