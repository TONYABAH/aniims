import { app, firestore } from "./firebase";
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
  addDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  arrayRemove,
  arrayUnion,
  /*setDoc,
  deleteDoc,
  getCountFromServer,
  startAt,
  serverTimestamp,
  Timestamp,
  deleteField,
  updateDoc,
  getFirestore,
  onSnapshot,*/
} from "firebase/firestore";
import { updateDocument, createDocument } from "./functions";
import { addSearch, generateId } from "./searchProvider";
import { useDefaultStore } from "src/stores/store";

const db = firestore;
const storage = getStorage(app);
const store = useDefaultStore();

const reoveStorageReference = async (collectionName, documentId, data) => {
  const attachRef = doc(db, collectionName, documentId);
  await runTransaction(db, async (t) => {
    t.update(attachRef, { Attachments: arrayRemove(data) });
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
export async function getStaffList(unit) {
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
export async function getSuperiors() {
  let staffList = await getStaffList();
  return staffList.filter(
    (s) => s.heads !== undefined || s.Role === "Director"
  );
}
export async function getSuperior(unit) {
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
export async function logSMS(to, coll, docId, transaction) {
  const data = {
    phone: to.Phone,
    coll: coll,
    docId: docId,
    CreatedAt: Date.now(),
  };
  const _ref = doc(db, "SMS", generateId());
  return transaction.set(_ref, data);
}
export async function addHistory(
  operation,
  collectionName,
  docId,
  data,
  transaction
) {
  const user = store.user;
  const d = {
    op: operation,
    time: Date.now(),
    coll: collectionName,
    doc: docId,
    user: user.displayName,
    uid: user.uid,
    ...data,
  };
  const _ref = doc(db, collectionName, docId, "History", generateId());

  return transaction.set(_ref, d);
}

export const addComment = async (
  collectionName,
  documentId,
  comment,
  to,
  unit
) => {
  const user = store.user;
  /*const From = {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
  };

  const To = {
    email: to.Email,
    name: to.Name,
    uid: to.uid,
  };*/
  const commentsData = {
    from: user.displayName,
    to: user.displayName,
    comment: comment,
    time: Date.now(),
    unit,
    uid: user.uid,
    toid: to.uid,
  };

  const docRef = doc(db, collectionName, documentId);
  //let minRef = doc(db, "Minutes", generateId());
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
      { from: user.displayName + " ", to: to.Name, unit: unit },
      t
    );
    logSMS(to, collectionName, documentId, t);
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
 */
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

  return await createDocument({
    payload: data,
    collection: collectionName,
    documentId: generateId(),
    historyId: generateId(),
    user: store.user.displayName,
  });
};
/*let payload = {
    id: generateId(),
    historyId: generateId(),
    ...data,
  };
  // We set the id manually here to ensure ordering
  //const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.set(docRef, payload);
    addHistory("Created", collectionName, id, {}, t);
  });
export const save = async (id, data, collectionName) => {
  const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.set(docRef, data); //.update(docRef, metadata);
    addHistory("Saved", collectionName, id, {}, t);
  });
};*/

export const update = async (id, data, collectionName) => {
  //This has a bug on the server side
  await updateDocument({
    payload: data,
    collection: collectionName,
    documentId: id,
    historyId: generateId(),
    user: store.user.displayName,
  });
  /*await runTransaction(db, async (t) => {
    const docRef = doc(db, collectionName, id);
    t.update(docRef, data); //.update(docRef, metadata);
    if (history) addHistory("Updated", collectionName, id, {}, t);
  });*/
};

export const remove = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  await runTransaction(db, async (t) => {
    t.delete(docRef, data); //.update(docRef, metadata);
    addHistory("Deleted", collectionName, id, {}, t);
  });
  return res;
};

export function getStorageFolder(type) {
  let folder = "documents/";
  if (type.match(/^video\//)) {
    folder = "videos/";
  } else if (type.match(/^image\//)) {
    folder = "images/";
  }
  /*if (type === "video/mp4") {
    folder = "video/";
  } else if (type === "application/pdf") {
    folder = "documents/";
  }*/
  //console.log(type);
  return folder;
}
export const onAddAttachment = async (collectionName, documentId, data) => {
  const attachRef = doc(db, collectionName, documentId);
  await runTransaction(db, async (t) => {
    t.update(attachRef, { Attachments: arrayUnion(data) });
    addHistory("Added an attachment", collectionName, documentId, {}, t);
  });
};
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
  let folder = getStorageFolder(data.Type);
  const storageRef = reference(storage, folder + data.id);
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
export async function onAssign(comment, staff, unit, docId) {
  await update(
    docId,
    {
      "meta.To": staff.uid,
      "meta.From": store.user.uid,
      "meta.Unit": unit,
      "meta.Time": Date.now(),
      "meta.Status": "Assigned",
      "meta.Location": staff.Location,
    },
    store.currentCollection,
    false
  );

  return await addComment(store.currentCollection, docId, comment, staff, unit);
}
export async function onSubmit(comment, to, unit, docId) {
  store.currentDocument.Status = "Submitted";
  if (docId) {
    if (!to) {
      throw {
        message: "No superior to submit document to. Please add a superior.",
      };
    }
    const meta = {
      "meta.To": to.uid,
      "meta.From": store.user.uid,
      "meta.Unit": unit || "",
      "meta.Time": Date.now(),
      "meta.Status": "Submitted",
      "meta.Location": to.Location,
    };
    await update(docId, meta, store.currentCollection, false);
    await addComment(store.currentCollection, docId, comment, to, unit);
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
        /*const user = getAuth().currentUser;
        const coll = store.currentCollection,
          docId = store.currentDocument.id;
        const data = {
          op: "Uploaded " + f.name,
          time: Date.now(),
          user: {
            name: user.displayName,
            uid: user.uid,
            email: user.email,
          },
          coll,
          docId,
          downloadURL,
        };
        const _ref = collection(db, coll, docId, "History");
        //const _ref = collection(db, "History");
        return addDoc(_ref, data);*/
      });
    }
  );
}

export const get = async (id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  const documentSnapshot = await getDoc(docRef);
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
  const dbRef = collection(db, "Cases");
  let q = query(dbRef, orderBy("CaseID", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  let caseId = 0;
  if (querySnapshot.size > 0) {
    caseId = querySnapshot.docs[0].data().CaseID;
  }
  return caseId ? caseId + 1 : 1;
}
/*export async function onReturnDocument(comment) {
  if (store.currentDocument?.From) {
    const target = store.staffList.find(
      (s) => s.uid === store.currentDocument?.From
    );
    const { Email, uid, Name } = target;

    await update(
      store.currentDocument.id,
      {
        To: uid,
        From: store.user.uid,
        Time: Date.now(),
        Status: "Returned",
      },
      store.currentCollection
    );
    await onSubmitComment(
      comment,
      { email: Email, uid, name: Name },
      "Returned",
      store.currentDocument.Unit
    );
  } else {
    throw { message: "No document loaded" };
  }
}*/
//const dbRef = collection(db, "cities");
