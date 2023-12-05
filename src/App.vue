<template>
  <router-view />
</template>

<script setup>
import { watch } from "vue";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "./composables/firebase";
import { useDefaultStore } from "./stores/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./composables/firebase";
import { useRouter } from "vue-router";
//import { Dark } from "quasar";
//import { getUserToken } from "./composables/auth";
//import { api } from "./boot/axios";
const store = useDefaultStore();
const router = useRouter();
const db = firestore;
const unitDataSource = collection(db, "Units");
const userCollection = collection(db, "Users");
const staffDataSource = query(
  userCollection,
  where("Level", "==", 3)
  //where("Active", "==", true)
);
const policeDataSource = query(
  userCollection,
  where("Level", "==", 2)
  //where("Active", "==", true)
);
//const router = useRouter();
//const currentDataSource = computed(() => store.query);
//store.searchResults = useCollection(currentDataSource);
function getParameterByName(param, level) {
  if (level && level < 2) {
    return "/applications";
  }
  if (!param) return "/";
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  let path = searchParams.get(param);
  //console.log(path);
  if (!path) {
    return "/";
  }
  return path;
}
onAuthStateChanged(auth, async (user) => {
  //Check for user status
  if (user) {
    let d = Object.assign({}, user);
    const idTokenResult = await user.getIdTokenResult();
    d.claims = idTokenResult.claims;
    store.user = d;
    //const { get } = await import("./composables/remote");
    //store.currentStaff = await get(d.uid, "Users");
    //Confirm the user is an Admin.
    const fullpath = getParameterByName("redirect", d.claims?.level || 0);
    router.push(fullpath);
    if (!!idTokenResult.claims.admin) {
      // Show admin UI. // console.log(user, idTokenResult.claims);
    } else {
      // Show regular user UI.
    }
  }
});

watch(
  () => store.user,
  async (u) => {
    if (u) {
      store.units = useCollection(unitDataSource);
      store.ipos = useCollection(policeDataSource);
      store.staffList = useCollection(staffDataSource);
    }
  }
);
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
<style></style>
