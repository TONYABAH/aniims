<template>
  <q-header class="bg-teal-7">
    <q-toolbar class="bg-transparent">
      <q-btn
        flat
        dense
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
      <q-btn flat dense to="/" :label="pkg.productName" />
      <q-toolbar-title></q-toolbar-title>
      <q-btn
        flat
        no-caps=""
        color="white"
        icon-right="person"
        :label="
          $q.screen.lt.sm ? '' : store.user?.displayName || store.user?.email
        "
      >
        <q-menu dark square="" class="q-pa-sm bg-blue-grey-9 shadow-0">
          <q-list dense style="min-width: 220px">
            <!--<q-item clickable v-close-popup to="/profile">
              <q-item-section avatar top
                ><q-icon name="person"
              /></q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/user">
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
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { logOut } from "src/composables/auth";
import { resetPassword } from "src/composables/functions";
import pkg from "../../package.json";

const $q = useQuasar();
const router = useRouter();
const store = useDefaultStore();
const seconds = ref(5);
const darkIcon = computed(() =>
  $q.dark.isActive ? "brightness_5" : "nightlight"
);
function toggleDark() {
  $q.dark.toggle();
  // darkIcon.value = $q.dark.isActive ? "brightness_5" : "nightlight"
}
const toggleLeftDrawer = () => {
  store.leftDrawerOpen = !store.leftDrawerOpen;
};

async function logout() {
  setInterval(() => {
    seconds.value = Number(seconds.value) + 1;
  }, 1000);
  let dl = $q.dialog({
    title: "Sign out?",
    //message: "You will be signed out in " + seconds.value + " seconds...",
    color: "negative",
    ok: true,
    cancel: true,
    html: "You will be signed out in " + seconds.value + " seconds...",
  });
  dl.onOk(async () => {
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
</script>
