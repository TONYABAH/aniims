<template>
  <router-view />
</template>

<script setup>
//import { Dark } from "quasar";
import { onBeforeMount } from "vue";
import { watch } from "vue";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "./composables/firebase";
import { useDefaultStore } from "./stores/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./composables/firebase";
import { useRouter, useRoute } from "vue-router";

const store = useDefaultStore();
const router = useRouter();
const route = useRoute();
const db = firestore;

function getParameterByName(param, level) {
  if (level && level < 2) {
    return "/applications";
  }
  if (!param) return "/app";
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  let path = searchParams.get(param);

  if (!path) {
    return "/";
  }
  return path;
}
onAuthStateChanged(auth, async (user) => {
  //Check for user status
  if (user) {
    const unitDataSource = collection(db, "Units");
    const userCollection = collection(db, "Users");
    const staffDataSource = query(userCollection, where("Level", "==", 3));
    const policeDataSource = query(userCollection, where("Level", "==", 2));

    const d = Object.assign({}, user);
    const idTokenResult = await user.getIdTokenResult();
    d.claims = idTokenResult.claims;
    store.user = d;

    let { getSettings } = await import("./composables/remote");
    getSettings(user)
      .then((s) => {
        if (s) store.settings = s;
      })
      .catch((e) => {
        console.log(e);
      });

    store.units = useCollection(unitDataSource);
    store.ipos = useCollection(policeDataSource);
    store.staffList = useCollection(staffDataSource);

    const fullpath = getParameterByName("redirect", d.claims?.level || 0);

    if (fullpath) router.replace(fullpath);
    if (!!idTokenResult.claims.admin) {
      // Show admin UI. // console.log(user, idTokenResult.claims);
    } else {
      // Show regular user UI.
    }
  }
});

watch(
  () => route.path,
  (path) => {
    let segments = path.toString().split(/\//).reverse();
    segments.pop(); // remove trailing empty string
    segments.shift(); // remove begining empty string
    const collectionName = segments[0];
    store.currentCollection = collectionName;
    //console.log(path, segments, collectionName, route);
  },
  { immediate: true }
);
onBeforeMount(async () => {
  //nextTick(())
  //setTimeout(async () => {
  //}, 0);
});
//Dark.set("auto");
/**
Mongo Relm Connection Sample
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tonyarmyabah:ampani.2010@cluster0.uvopvsl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/
</script>
