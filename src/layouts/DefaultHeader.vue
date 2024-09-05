<template>
  <q-header reveal :reveal-offset="40" class="text-white">
    <q-toolbar :class="store.theme.bg.light">
      <q-btn
        flat
        dense
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        v-if="$route.name !== 'Home' && $route.name !== 'Dashboard'"
      />
      <q-btn flat dense to="/" :label="pkg.productName" />
      <q-toolbar-title></q-toolbar-title>
      <q-btn
        flat
        dense
        no-caps=""
        icon-right="person"
        :label="online ? 'Online' : 'Offline'"
        :color="online ? 'amber' : 'white'"
      >
        <q-menu dark square="" class="q-pa-sm bg-blue-grey-9 shadow-0">
          <q-list dense style="min-width: 220px">
            <q-item v-close-popup>
              <q-item-section avatar top
                ><q-icon name="person"
              /></q-item-section>
              <q-item-section>{{
                store.user?.displayName || store.user?.email
              }}</q-item-section>
            </q-item>
            <!--<q-item clickable v-close-popup to="/user">
              <q-item-section avatar top
                ><q-icon name="person"
              /></q-item-section>
              <q-item-section>User account</q-item-section>
            </q-item>-->
            <q-separator />
            <q-item clickable v-close-popup @click="sendPasswordReset">
              <q-item-section avatar top><q-icon name="key" /></q-item-section>
              <q-item-section>Change password</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar top><q-icon name="lock" /></q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        flat
        dense
        size="sm"
        :icon="darkIcon"
        @click="toggleDark"
        class="cursor-pointer"
      />
      <q-btn
        flat
        dense
        color=""
        @click="$q.fullscreen.toggle()"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      ></q-btn>
      <SettingDialog />
    </q-toolbar>
  </q-header>
  <!--<q-page-sticky position="top" :offset="[18, 18]" expand>
    <q-toolbar :class="store.theme.bg.light" v-if="isDefaultRoute">
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
        <q-tab
          name="edit"
          icon="edit"
          :label="$q.screen.gt.xs ? 'Editor' : ''"
        />
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
      <q-btn
        flat
        round
        dense
        icon="engineering"
        @click="navigateTo('/admin')"
      />
    </q-toolbar>
  </q-page-sticky>-->
</template>

<script setup>
import pkg from "../../package.json";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useDefaultStore } from "src/stores/store";
import { computed, ref, watch } from "vue";
import { logOut } from "src/composables/authentication";
import { resetPassword } from "src/composables/functions";
import SettingDialog from "src/components/SettingDialog.vue";
//import { useTheme } from "src/composables/use-fn";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const store = useDefaultStore();
const seconds = ref(5);
const online = ref(window?.navigator?.onLine);
const loading = ref(false);
const darkIcon = computed(() =>
  $q.dark.isActive ? "brightness_5" : "nightlight"
);
function removeHash(p) {
  window.location.hash = "";
  //store.currentDocument = {}
}
function toggleDark() {
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
});
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
async function sendPasswordReset() {
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
}
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
