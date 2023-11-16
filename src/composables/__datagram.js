import { firestore } from "./firebase";

const GENERATION_OFFSET = new Date("5000-01-01").getTime();
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

// Generates a trigram
export const dataGram = (txt) => {
  const map = {};
  const s1 = (txt || "").toLowerCase();
  const words = s1.split(" ");
  for (let word of words) {
    if (word.trim().length > 0) {
      map[word] = true;
    }
  }
  return map;
};
export const triGram = (txt) => {
  const map = {};
  const s1 = (txt || "").toLowerCase();
  const n = 3;
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true;
  return map;
};

export const addSearch = (offset, ...fields) => {
  const mergedField = [];
  for (let field of fields) {
    mergedField.push(field || "");
  }
  return dataGram(mergedField.join(" ").slice(0, offset));
};
export const addFullTextSearch = (offset, ...fields) => {
  const mergedField = [];
  for (let field of fields) {
    mergedField.push(field || "");
  }
  return triGram(mergedField.join(" ").slice(0, offset));
};
/**
 * Add document to cloud firestore.
 * @param {Map} doc Document to save to firestore.
 * @param {Number} offset Maximum length of search strings.
 * @param  {...String} fields Array of strings to search.
 */
export const addDocument = async (doc, offset, ...fields) => {
  const db = firestore;
  const id = generateId();
  let payload = {
    ...doc,
    _smeta: {
      ...addSearch(offset, ...fields),
    },
  };
  // We set the id manually here to ensure ordering
  const postRef = doc(db, "posts", id);
  await setDoc(postRef, payload);
};

// Example:
// This will add a new firestore record enhanced with search data.
// It assumes your record has "title" and/or "desc" present. It will then
// combine the two fields (so you can search on both) and store it as _smeta.
// Note the slice, which caps the length of the string

/*export const addPost = async (doc) => {
  const db = getFirestore();
  const id = generateId();
  const payload = {
    ...doc,
    ...triGram([doc.title || '', doc.desc || ''].join(' ').slice(0, 500))
  };
  
  // We set the id manually here to ensure ordering
  const postRef = doc(db, 'posts', id);
  await setDoc(postRef, payload);  
}*/
