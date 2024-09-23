import { app, firestore, database } from "./firebase";
import {
  getStorage,
  ref as reference,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  getDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  arrayRemove,
  arrayUnion,
  addDoc,
  setDoc,
  /*deleteDoc, getCountFromServer, serverTimestamp,
    Timestamp, setDoc, addDoc, startAt, deleteField,
    updateDoc, getFirestore, onSnapshot,
  */
} from "firebase/firestore";

import { addSearch, generateId } from "./searchProvider";
import { useDefaultStore } from "src/stores/store";
import { set, get, ref as databseRef } from "firebase/database";
//import { timestamp } from "rxjs";
//import { Meta } from "quasar";

import { of, distinct } from "rxjs";

const db = firestore;
const storage = getStorage(app);
const store = useDefaultStore();

const reoveStorageReference = async (collectionName, documentId, data) => {
  const _ref = doc(db, /*collectionName, documentId,*/ "Attachments", data.id);
  await runTransaction(db, async (t) => {
    t.delete(_ref);
    addHistory(
      "Removed an attachment: " + data.Title || data.Name + "|" + data.id,
      collectionName,
      documentId,
      t
    );
  });
};
export const submitForm = async (data) => {
  let docRef = doc(db, "Forms", generateId());
  return setDoc(docRef, data);
};
export function filterResults(docs) {
  let results = [];
  of(
    ...docs /*{ age: 4, name: "Foo" }, { age: 7, name: "Bar" }, { age: 5, name: "Foo" }*/
  )
    .pipe(distinct(({ id }) => id))
    .subscribe((x) => results.push(x));
  return results;
}

export async function addLog(data, t) {
  const logRef = doc(db, "logging", generateId());
  t.set(logRef, {
    date: new Date(),
    ...data,
    user: store.user.uid,
  });
  //addHistory("Deleted", collectionName, id, {}, t);
}
export async function addHistory(operation, collectionId, docId, transaction) {
  const meta = {
    CollId: collectionId,
    DocId: docId,
    Date: Date.now(),
    Op: operation,
    Unit: store.user.claims?.unit || null,
    User: {
      uid: store.user.uid,
      Name: store.user.displayName || store.user.email,
    },
  };
  const historyRef = doc(db, "History", generateId());

  return transaction.set(historyRef, meta);
}

export async function addMinute(collectionId, docId, data, transaction) {
  const meta = {
    CollId: collectionId,
    DocId: docId,
    Date: Date.now(),
    From: {
      uid: store.user.uid,
      Name: store.user.displayName,
      Unit: store.user.claims?.unit || null,
      //Loc: store.user.claims?.location || null,
    },
    To: {
      uid: data.To.uid,
      Name: data.To.Name,
      Unit: data.To.Unit || null,
      //Loc: data.To.Location || null,
    },
    Comment: data.comment,
  };
  const metaRef = doc(db, "Minutes", generateId());
  let result = transaction.set(metaRef, meta);
  return result;
}
export async function addMeta(collectionId, docId, title, search, transaction) {
  const meta = {
    CollId: collectionId,
    DocId: docId,
    Title: title,
    Search: search || [],
    Assigned: false,
    CreatedAt: Date.now(),
    CreatedBy: store.user.uid,
    Location: store.user.claims?.location || null,
    Unit: store.user.claims?.unit || null,
    Status: "Created",
    Time: Date.now(),
    //From: store.user.uid,
    //To: data.To.uid,
    //Unit: data.To.Unit,
  };
  const metaRef = doc(db, "Meta", docId);
  return transaction.set(metaRef, meta);
}
export async function updateMeta(docId, to, status, transaction) {
  const meta = {
    Assigned: true,
    Status: status || "Minuted",
    Time: Date.now(),
    From: {
      uid: store.user.uid,
      Role: store.user.claims?.role || "Staff",
      Unit: store.user.claims?.unit || null,
      Loc: store.user.claims?.location || null,
    },
    To: {
      uid: to.uid,
      Role: to.Role,
      Unit: to.Unit || null,
      Loc: to.Location || null,
    },
  };
  const metaRef = doc(db, "Meta", docId);
  return transaction.update(metaRef, meta);
}
export async function deleteFile(fileName) {
  const storageRef = reference(storage, fileName);
  deleteObject(storageRef)
    .then(async (d) => {
      //const attachRef = doc(db, collectionName, documentId);
      //await reoveStorageReference(collectionName, documentId, data);
      //console.log("File removed from storage");
    })
    .catch(async (error) => {
      if (error.code === "storage/object-not-found") {
        throw "File not found.";
      } else {
        throw "File not removed from storage.";
      }
    });
}

export async function addChildDocument(
  collectionName,
  docId,
  subCollection,
  data
) {
  //const logRef = doc(db, "logging", generateId());
  const childDocumentId = generateId();
  const docRef = doc(db, collectionName, docId, subCollection, childDocumentId);
  data.id = childDocumentId;
  await runTransaction(db, async (t) => {
    t.set(docRef, data);
    //t.set(logRef, { op, time, coll, docId, uid, user, ...data });
    addHistory(
      "Added child document: " +
        collectionName +
        "/" +
        docId +
        "/" +
        subCollection +
        "/" +
        childDocumentId,
      collectionName,
      docId,
      //{ subColl: subCollection, subDocId: childDocumentId },
      t
    );
  });
  return childDocumentId;
}
export async function updateChildDocument(
  collectionName,
  docId,
  subCollection,
  childDocumentId,
  data
) {
  //const logRef = doc(db, "logging", generateId());
  //const childDocumentId = generateId();
  const docRef = doc(db, collectionName, docId, subCollection, childDocumentId);

  await runTransaction(db, async (t) => {
    t.update(docRef, data);
    addHistory(
      "Updated child document: " +
        collectionName +
        "/" +
        docId +
        "/" +
        subCollection +
        "/" +
        childDocumentId,
      collectionName,
      docId,
      /*{
        subColl: subCollection,
        subDocId: childDocumentId,
        childId: childDocumentId,
      },*/
      t
    );
  });
  return childDocumentId;
}
/**
 * Add document to cloud firestore.
 * @param {Map} data Document to save to firestore.
 * @param {Number} collectionName Name of collection to save document to.
 * @param  {...String} searchFields Array of strings to search.
 * @returns Promise reolved to id.
 */
export const create = async (data, collectionName, searchFields = []) => {
  data.CreatedBy = store.user.uid; //{ uid: user.uid, name: user.displayName };
  data.CreatedAt = Date.now();
  data.Status = "Created";
  const _fields = [];
  searchFields.forEach((f) => {
    _fields.push(data[f]);
  });
  const search = addSearch(_fields);
  // We set the id manually here to ensure ordering
  let id = generateId();
  data.id = id;

  const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.set(docRef, data);
    await Promise.all([
      addMeta(collectionName, id, data.Title, search, t),
      addHistory("Created", collectionName, id, t),
    ]);
  });
  return id;
};

export const save = async (id, data, collectionName) => {
  const docRef = doc(db, collectionName, id);
  delete data.meta;
  await runTransaction(db, async (t) => {
    t.set(docRef, data); //.update(docRef, metadata);
    await addHistory("Saved", collectionName, id, t);
  });
};

export const update = async (id, data, collectionName, skipHistory) => {
  delete data.meta;
  await runTransaction(db, async (t) => {
    const docRef = doc(db, collectionName, id);
    t.update(docRef, data); //.update(docRef, metadata);
    if (!skipHistory) addHistory("Updated", collectionName, id, t);
  });
};

export const remove = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.delete(docRef);
    await addLog(
      {
        op: "Deleted",
        coll: collectionName,
        doc: id,
        user: store.user.uid,
        name: store.user.email,
      },
      t
    );
  });
};

export function getStorageFolder(type) {
  let folder = "documents/";
  if (type.match(/^video\//)) {
    folder = "videos/";
  } else if (type.match(/^image\//)) {
    folder = "images/";
  }
  return folder;
}

export async function onAddAttachment(collectionName, documentId, data) {
  const _ref = doc(
    db,
    /*collectionName, documentId,*/
    "Attachments",
    generateId()
  );
  data.CollId = collectionName;
  data.DocId = documentId;
  await runTransaction(db, async (t) => {
    t.set(_ref, data);
    addHistory(
      "Added an attachment: " + data.Title || data.Name,
      collectionName,
      documentId,
      t
    );
  });
}

export const onAddDocument = async (collectionName, documentId, name, data) => {
  const docRef = doc(db, collectionName, documentId);
  const field = {};
  data.id = generateId();
  field[name] = arrayUnion(data);
  await runTransaction(db, async (t) => {
    t.update(docRef, field);
    addHistory("Added a row of " + name, collectionName, documentId, t);
  });
};

export const onDeleteDocument = async (
  collectionName,
  documentId,
  name,
  data
) => {
  const docRef = doc(db, collectionName, documentId);
  const field = {};
  field[name] = arrayRemove(data);
  await runTransaction(db, async (t) => {
    t.update(docRef, field);
    addHistory(
      "Removed: " + collectionName + "/" + documentId + "|" + name,
      collectionName,
      documentId,
      t
    );
  });
};

export const onDeleteAttachment = async (collectionName, documentId, data) => {
  //let folder = getStorageFolder(data.Type);
  const storageRef = reference(storage, data.downloadURL);
  deleteObject(storageRef)
    .then(async () => {
      //const attachRef = doc(db, collectionName, documentId);
      try {
        if (documentId)
          await reoveStorageReference(collectionName, documentId, data);
      } catch (e) {
        console.log(e.message);
      }
    })
    .catch(async (error) => {
      //console.log(error.code);
      if (error.code === "storage/object-not-found") {
        try {
          if (documentId)
            await reoveStorageReference(collectionName, documentId, data);
        } catch (e) {
          console.log(e.message);
        }
      } else {
        throw "File not removed from storage.";
      }
    });
};

/*export async function onAssign(comment, to, unit, docId, action = "Assign") {
  return __onSubmitMinutes(comment, to, unit, docId, action);
}*/

export async function onSubmit(
  title,
  comment,
  target,
  documentId,
  action = "Submit"
) {
  if (store.currentDocument) {
    if (!target?.uid) {
      throw {
        message:
          "No user with the given identifier. Please provide the user ID",
      };
    }

    let status = "Submitted";
    if (action === "Return") {
      status = "Returned";
    } else if (action === "Assign") {
      status = "Assigned";
    }
    //console.log(target);
    await runTransaction(db, async (t) => {
      await Promise.all([
        addMinute(
          store.currentCollection,
          documentId,
          {
            comment: comment,
            To: target,
            Title: title,
          },
          t
        ),
        updateMeta(documentId, target, status, t),
        addHistory(
          "Minuted by " + store.user.displayName + " to " + target.Name,
          store.currentCollection,
          documentId,
          t
        ),
      ]);
    });
  } else {
    throw { message: "No document loaded" };
  }
}
export function uploadFile(f, uploadTask, progress, callback) {
  function getExtension(name) {
    const array = name.split(/\./g);
    return array.length > 0 ? array[array.length - 1] : "";
  }
  let folder = getStorageFolder(f.type);
  // Upload file and metadata to the object 'images/mountains.jpg'
  const ext = getExtension(f.name);
  const id = crypto.randomUUID() + (ext ? "." + ext : "");
  const storageRef = reference(storage, folder + id);

  uploadTask = uploadBytesResumable(storageRef, f);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log("Upload is " + progress.value + "% done");
      switch (snapshot.state) {
        case "paused":
          //console.log("Upload is paused");
          Notify.create({
            timeout: 3000,
            closeBtn: true,
            caption: "Upload",
            message: "Upload is paused",
            icon: "info",
            iconColor: "amber",
          });
          break;
        case "running":
          //console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      //console.log(e.message);
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        // ...
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
      callback(error);
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        callback(null, downloadURL, id);
      });
    }
  );
}

export const getById = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  const documentSnapshot = await getDoc(docRef);
  if (!documentSnapshot || !documentSnapshot.data()) return null;
  const document = { id: documentSnapshot.id, ...documentSnapshot.data() };
  return document;
};

export const getMailComplaints = async (MailId) => {
  const docRef = collection(db, "Complaints");
  const q = query(docRef, where("MailId", "==", MailId));
  const querySnapshot = await getDocs(q);
  const list = [];
  querySnapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    list.push(document);
  });

  return list;
};

export const listStaff = async (filters, $limit = 1000) => {
  const dbRef = collection(db, "Users");
  const q = query(
    dbRef,
    ...filters,
    where("Level", "==", 3),
    orderBy("Name", "asc"),
    limit($limit)
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

export const list = async (collectionName, limits, order = []) => {
  const dbRef = collection(db, collectionName);
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

export async function generateCaseId() {
  const dbRef = collection(db, "Investigations");
  let q = query(dbRef, orderBy("CaseID", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  let caseId = 0;
  if (querySnapshot.size > 0) {
    caseId = querySnapshot.docs[0].data().CaseID;
  }
  return caseId ? caseId + 1 : 1;
}

export async function getSettings(user) {
  let dbRef = databseRef(database, "settings/" + user.uid);
  let result = await get(dbRef);
  return result ? result.val() : null;
}

export async function saveSettings(data) {
  //const { child, set } = await import("firebase/database");
  let dbRef = databseRef(database, "settings/" + store.user.uid);
  await set(dbRef, data);
}

/*export const createOnServer = async (
  data,
  collectionName,
  searchFields = []
) => {
  //const user = getAuth().currentUser;
  data.meta = {
    CreatedBy: store.user.uid, //{ uid: user.uid, name: user.displayName };
    CreatedAt: Date.now(),
    Status: "Created",
  };
  const _fields = [];
  searchFields.forEach((f) => {
    _fields.push(data[f]);
  });

  data.meta.search = addSearch(_fields);
  //Server side creation
  return await createDocument({
    payload: data,
    collection: collectionName,
    documentId: generateId(),
    historyId: generateId(),
    user: store.user.displayName,
  });
};

export const updateOnServer = async (id, data, collectionName) => {
  // Server side creation
  await updateDocument({
    payload: data,
    collection: collectionName,
    documentId: id,
    historyId: generateId(),
    user: store.user.displayName,
  });
};*/
