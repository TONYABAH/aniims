<template>
  <q-toolbar :class="store.theme.bg.light" class="text-white">
    <q-tabs
      align="left"
      shrink=""
      outside-arrows=""
      narrow-indicator=""
      indicator-color=""
      v-model="store.tabModel"
      inline-label=""
      active-bg-color=""
    >
      <q-tab
        name="search"
        icon="search"
        :label="$q.screen.gt.xs ? 'Search' : ''"
        @click="removeHash('search')"
      />
      <q-tab name="edit" icon="edit" :label="$q.screen.gt.xs ? 'Editor' : ''" />
      <q-tab
        name="dashboard"
        icon="dashboard"
        :label="$q.screen.gt.xs ? 'Analyse' : ''"
        @click="removeHash('dashboard')"
        v-if="!$route.params.id"
      />
    </q-tabs>
    <q-toolbar-title class="text-right">
      {{ isDefaultRoute ? store.currentCollection : "" }}
    </q-toolbar-title>
    <q-btn flat round dense icon="engineering" @click="navigateTo('/admin')" />
  </q-toolbar>
</template>

<script setup>
//import pkg from "../../package.json";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useDefaultStore } from "src/stores/store";
import { computed, ref, watch } from "vue";
import { logOut } from "src/composables/authentication";
//import { resetPassword } from "src/composables/functions";
//import SettingDialog from "src/components/SettingDialog.vue";
//import { useTheme } from "src/composables/use-fn";

const $q = useQuasar();
const router = useRouter();
//const route = useRoute();
const store = useDefaultStore();
const seconds = ref(5);
const online = ref(window?.navigator?.onLine);
const loading = ref(false);
/*const darkIcon = computed(() =>
  $q.dark.isActive ? "brightness_5" : "nightlight"
);*/
defineProps({
  isDefaultRoute: Boolean,
});
function removeHash(p) {
  window.location.hash = "";
  //store.currentDocument = {}
}

/*function toggleDark() {
  $q.dark.toggle();
  // darkIcon.value = $q.dark.isActive ? "brightness_5" : "nightlight"
}
const toggleLeftDrawer = () => {
  store.leftDrawerOpen = !store.leftDrawerOpen;
};
const isDefaultRoute = computed(() => {
  return (
    route.name !== "Home" &&
    route.name !== "Cases" &&
    route.path.indexOf("/admin") === -1
    //&& route.path.indexOf("/applications") === -1
  );
});*/
function navigateTo(path) {
  if (router.currentRoute.value.path !== path) {
    setTimeout(() => {
      loading.value = false;
    }, 15000);
    loading.value = true;
    router
      .push(path)
      .then(() => {
        //console.log(dashboardRef?.value);
        //store.tabModel = "search";
      })
      .catch((e) => {
        console.log(e.message);
        $q.notify({
          timeout: 1000,
          message: e.message,
          color: "red",
          textColor: "white",
          position: "top",
          icon: "error",
        });
      })
      .finally(() => (loading.value = false));
  }
}
let interval = null;
async function logout() {
  interval = setInterval(() => {
    seconds.value--; // = Number(seconds.value) - 1;
  }, 1000);

  let dl = $q.dialog({
    title: "Sign out?",
    message:
      "<span></span>You will be signed out in <b>" +
      seconds.value +
      "</b> seconds...</span>",
    color: "negative",
    ok: true,
    cancel: true,
    html: true,
  });

  dl.onOk(async () => {
    clearInterval(interval);
    store.loading = true;
    logOut()
      .then(() => {
        store.user = {};
        router.push({ name: "Login" });
      })
      .catch((e) => {
        $q.dialog({
          title: "Error",
          message: e.message,
          color: "red",
        });
      })
      .finally(() => {
        store.loading = false;
      });
  });

  setTimeout(() => {
    clearInterval(interval);
    dl.hide();
    logOut()
      .then(() => {
        store.user = {};
        router.push({ name: "Login" });
      })
      .catch((e) => {
        $q.dialog({
          title: "Error",
          message: e.message,
          color: "red",
        });
      })
      .finally(() => {
        store.loading = false;
      });
  }, 5000);
}
/*async function sendPasswordReset() {
  $q.dialog({
    title: "Send password reset email?",
    message: "Password reset email will be sent to your mailbox",
    color: "primary",
    ok: true,
    cancel: true,
  }).onOk(() => {
    store.loading = true;
    resetPassword({ email: store.user.email })
      .then((info) => {
        //console.log(info);
        $q.dialog({
          title: "Success",
          message:
            "Password reset email has been sent to your mailbox. Follow the instructions to reset your password.",
          color: "teal",
        });
      })
      .catch((e) => {
        $q.dialog({
          title: "Error",
          message: e.message,
          color: "red",
        });
      })
      .finally(() => {
        store.loading = false;
      });
  });
}*/
window.addEventListener("offline", (e) => {
  //console.log("offline");
  online.value = false;
});

window.addEventListener("online", (e) => {
  //console.log("online");
  online.value = true;
});
/*watch(
  () => route.path,
  (path) => {
    let segments = path.toString().split(/\//);
    segments.shift();
    let p = segments.shift();
    let collectionName = p.substring(0, 1).toUpperCase() + p.substring(1);
    store.currentCollection = collectionName;
  },
  { immediate: true }
);*/
</script>
<style>
.q-tab {
  border-radius: 4px 4px 0 0;
}
</style>
