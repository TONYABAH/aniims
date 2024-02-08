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
  getCountFromServer,
  serverTimestamp,
  Timestamp,
  /*
  setDoc,
  addDoc,
  deleteDoc,
  startAt,

  deleteField,
  updateDoc,
  getFirestore,
  onSnapshot,*/
} from "firebase/firestore";
import { updateDocument, createDocument } from "./functions";
import { addSearch, generateId } from "./searchProvider";
import { useDefaultStore } from "src/stores/store";
import { child, set, get, ref as databseRef } from "firebase/database";

const db = firestore;
const storage = getStorage(app);
const store = useDefaultStore();

const reoveStorageReference = async (collectionName, documentId, data) => {
  //const attachRef = doc(db, collectionName, documentId);
  const _ref = doc(db, collectionName, documentId, "Attachments", data.id);
 
  await runTransaction(db, async (t) => {
    //t.update(attachRef, { Attachments: arrayRemove(data) });
    t.delete(_ref)
    addHistory("Removed an attachment", collectionName, documentId, {}, t);
  });
};

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

export async function addHistory(
  operation,
  collectionName,
  docId,
  data,
  transaction
) {
  //const user = store.user;
  const historyData = {
    //coll: collectionName,
    //doc: docId,
    op: operation,
    date: Date.now(),
    uid: store.user.uid,
    user: store.user.displayName,
    ...data,
  };
  //const { op, date, coll, uid, user } = historyData;
  const historyRef = doc(db, collectionName, docId, "History", generateId());
  //const logRef = doc(db, "logging", generateId());

  return transaction.set(historyRef, historyData);
  //.set(logRef, { op, date, coll, docId, uid, user });
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
      "Added child document",
      collectionName,
      docId,
      { subColl: subCollection, subDocId: childDocumentId },
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
      "Updated child document",
      collectionName,
      docId,
      {
        subColl: subCollection,
        subDocId: childDocumentId,
        childId: childDocumentId,
      },
      t
    );
  });
  return childDocumentId;
}
export const create = async (data, collectionName, searchFields = []) => {
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
  data.Status = "Open";
  // We set the id manually here to ensure ordering
  let id = generateId();
  data.id = id;

  const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.set(docRef, data);
    addHistory("Created", collectionName, id, {}, t);
  });
  return id;
};

export const save = async (id, data, collectionName) => {
  const docRef = doc(db, collectionName, id);
  delete data.meta;
  await runTransaction(db, async (t) => {
    t.set(docRef, data); //.update(docRef, metadata);
    addHistory("Saved", collectionName, id, {}, t);
  });
};

export const update = async (id, data, collectionName, skipHistory) => {
  delete data.meta;
  await runTransaction(db, async (t) => {
    const docRef = doc(db, collectionName, id);
    t.update(docRef, data); //.update(docRef, metadata);
    if (!skipHistory) addHistory("Updated", collectionName, id, {}, t);
  });
};

export const createOnServer = async (
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
};

export const remove = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  const logRef = doc(db, "logging", generateId());
  await runTransaction(db, async (t) => {
    t.delete(docRef, data).set(logRef, {
      op: "Deleted",
      date: new Date(),
      coll: collectionName,
      doc: id,
      user: {
        uid: store.user.uid,
        name: store.user.displayName,
        email: store.user.email,
      },
    });
    //addHistory("Deleted", collectionName, id, {}, t);
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
  const _ref = doc(db, collectionName, documentId, "Attachments", generateId());
  await runTransaction(db, async (t) => {
    t.set(_ref, data);
    addHistory("Added an attachment", collectionName, documentId, {}, t);
  });
}

export const onAddDocument = async (collectionName, documentId, name, data) => {
  const attachRef = doc(db, collectionName, documentId);
  const field = {};
  data.id = generateId();
  field[name] = arrayUnion(data);
  await runTransaction(db, async (t) => {
    t.update(attachRef, field);
    addHistory("Added a row of " + name, collectionName, documentId, {}, t);
  });
};

export const onDeleteDocument = async (
  collectionName,
  documentId,
  name,
  data
) => {
  const attachRef = doc(db, collectionName, documentId);
  const field = {};
  field[name] = arrayRemove(data);
  await runTransaction(db, async (t) => {
    t.update(attachRef, field);
    addHistory("Removed a row of " + name, collectionName, documentId, {}, t);
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

export async function onAssign(comment, to, unit, docId, action = "Assign") {
  return __onSubmitMinutes(comment, to, unit, docId, action);
}

export async function onSubmit(
  comment,
  to,
  unit,
  documentId,
  action = "Submit"
) {
  if (store.currentDocument) {
    if (!to) {
      throw {
        message:
          "No user with the given identifier. Please provide the user ID",
      };
    }
    const metaData = {
      "meta.To": to.uid,
      "meta.From": store.user.uid,
      "meta.Unit": unit || "",
      "meta.Time": Date.now(),
      "meta.Location": to.Location,
    };
    let status = "Submitted";
    if (action === "Return") {
      status = "Returned";
    } else if (action === "Assign") {
      status = "Assigned";
      metaData["meta.Assigned"] = true;
    } else {
      metaData["meta.Submitted"] = true;
      9;
    }
    metaData["meta.Status"] = status;
    store.currentDocument.Status = status;
    const commentsData = {
      from: store.user.displayName,
      to: to.Name,
      unit,
      uid: store.user.uid,
      toid: to.uid,
      time: Date.now(),
      comment: comment,
    };
    //await update(docId, metaData, store.currentCollection, true);
    //await addComment(store.currentCollection, docId, comment, to, unit);
    await runTransaction(db, async (t) => {
      const metaRef = doc(db, store.currentCollection, documentId);
      let commentRef = doc(
        db,
        store.currentCollection,
        documentId,
        "Minutes",
        generateId()
      );
      t.update(metaRef, metaData).set(commentRef, commentsData);

      await addHistory(
        "Minuted",
        store.currentCollection,
        documentId,
        {
          from: store.user.displayName,
          to: to.Name,
          unit: unit,
        },
        t
      );
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

export const listStaff = async (unit) => {
  const dbRef = collection(db, "Staff");
  const q = query(
    dbRef,
    where("Units", "array-contains", unit),
    orderBy("Last", "asc"),
    limit(50)
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

export async function __getStaffList(unit) {
  const dbRef = collection(db, "Users");
  let q = query(
    dbRef,
    where("Level", "==", 3),
    where("Active", "==", true),
    limit(10000)
  );
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs;
  return list;
}
export async function __getSuperiors() {
  let staffList = await getStaffList();
  return staffList.filter(
    (s) => s.heads !== undefined || s.Role === "Director"
  );
}
export async function __getSuperior(unit) {
  let user = store.user;
  let superior = null;
  if (user.claims.role === "Director") return null;
  let staffList = await getStaffList();
  for (let doc of staffList) {
    let document = doc.data();
    if (user.claims.heads) {
      if (document.Role === "Director") return document;
    } else if (document.Heads?.includes(unit)) {
      //superior = staffList.find((s) => s.Heads?.includes(unit));
      return document;
    }
    //console.log(document);
  }
  //console.log(superior);
  return superior;
}
export const _onAddAttachment = async (collectionName, documentId, data) => {
  const attachRef = doc(db, collectionName, documentId);
  await runTransaction(db, async (t) => {
    t.update(attachRef, { Attachments: arrayUnion(data) });
    addHistory("Added an attachment", collectionName, documentId, {}, t);
  });
};
export async function __onSubmit(comment, to, unit, docId, action = "Submit") {
  if (store.currentDocument) {
    if (!to) {
      throw {
        message:
          "No user with the given identifier. Please provide the user ID",
      };
    }
    const metaData = {
      To: to.uid,
      From: store.user.uid,
      Unit: unit || "",
      Time: Date.now(),
      Location: to.Location,
    };
    let status = "Submitted";
    if (action === "Return") {
      status = "Returned";
    } else if (action === "Assign") {
      status = "Assigned";
      metaData["Assigned"] = true;
    } else {
      metaData["Submitted"] = true;
      9;
    }
    metaData["Status"] = status;

    store.currentDocument.Status = status;

    const commentsData = {
      ...metaData,
      Comment: comment,
    };
    await runTransaction(db, async (t) => {
      const metaRef = doc(db, "Meta", docId);
      let commentRef = doc(
        db,
        collectionName,
        documentId,
        "Minutes",
        generateId()
      );
      t.update(metaRef, metaData).set(commentRef, commentsData);

      addHistory(
        "Minuted",
        collectionName,
        documentId,
        {
          from: store.user.displayName,
          to: to.Name,
          toid: to.uid,
          unit: unit,
        },
        t
      );
    });
    //await save(docId, "Meta", metaData);
    //await addComment(store.currentCollection, docId, comment, to, unit);
  } else {
    throw { message: "No document loaded" };
  }
}
const __addComment = async (collectionName, documentId, comment, to, unit) => {
  const user = store.user;
  const commentsData = {
    from: user.displayName,
    to: to.Name,
    comment: comment,
    time: Date.now(),
    unit,
    uid: user.uid,
    toid: to.uid,
  };

  const docRef = doc(db, collectionName, documentId);
  let commentRef = doc(db, collectionName, documentId, "Minutes", generateId());

  await runTransaction(db, async (t) => {
    t.update(docRef, {
      "meta.To": to.uid,
      "meta.From": user.uid,
      "meta.Unit": unit,
    }).set(commentRef, commentsData);

    addHistory(
      "Minuted",
      collectionName,
      documentId,
      {
        from: user.displayName || user.email,
        to: to.Name,
        toid: to.uid,
        unit: unit,
      },
      t
    );
    // logSMS(to, collectionName, documentId, t);
    // Atomically remove a region from the "regions" array field.
    //.update({regions: FieldValue.arrayRemove("east_coast"),});
    // Atomically add a new region to the "regions" array field.
    // setDoc(historyRef, {History: arrayUnion(historyData),});
  });
  return commentsData;
};
/**
 * Add document to cloud firestore.
 * @param {Map} data Document to save to firestore.
 * @param {Number} collectionName Name of collection to save document to.
 * @param  {...String} searchFields Array of strings to search.
 * @returns Promise reolved to id.
 */
export const __create = async (data, collectionName, searchFields = []) => {
  const _fields = [];
  searchFields.forEach((f) => {
    _fields.push(data[f]);
  });

  const metaData = {
    CreatedBy: store.user.uid, //{ uid: user.uid, name: user.displayName };
    CreatedAt: Date.now(),
    Status: "Created",
    search: addSearch(_fields),
  };
  // We set the id manually here to ensure ordering
  let docId = generateId();
  data.id = docId;

  const metaRef = doc(db, "Meta", docId);
  const docRef = doc(db, collectionName, docId);

  await runTransaction(db, async (t) => {
    t.set(docRef, data).set(metaRef, metaData);
    addHistory("Created", collectionName, docId, {}, t);
  });
  return docId;
};
