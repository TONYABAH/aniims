<template>
  <q-drawer
    v-if="route.name !== 'Home'"
    v-model="leftDrawerOpen"
    show-if-above=""
    :mini="miniMode"
    :mini-width="$q.screen.lt.md ? 100 : 100"
    :behavior="$q.screen.gt.xs ? 'desktop' : 'mobile'"
    :elevated="false"
    :width="180"
    style="letter-spacing: 1.2px; overflow: hidden"
    class="text-grey-2"
    :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-teal'"
  >
    <q-item>
      <q-item-section class="text-grey-5">
        {{ pkg.productName }}
      </q-item-section>

      <q-item-section avatar="">
        <q-btn
          flat
          color=""
          :icon="miniMode && $q.screen.gt.xs ? 'arrow_right' : 'arrow_left'"
          :class="miniMode ? 'q-mr-md' : 'q-ml-md'"
          class="full-width"
          @click="$q.screen.gt.xs ? toggleLeftMini() : toggleLeftDrawer()"
        />
      </q-item-section>
    </q-item>
    <q-tabs
      v-model="store.tabModel"
      class="text-white"
      vertical=""
      indicator-color="amber"
      shrink=""
      active-bg-color="amber-8"
    >
      <q-tab name="search" icon="search" label="Search" />
      <q-tab name="editor" icon="edit" label="Editor" />
      <q-tab name="dashboard" icon="dashboard" label="Analyse" />
      <q-tab icon="home" label="Home" @click="goHome" />
    </q-tabs>
    <q-scroll-area class="fits">
      <q-list>
        <!--<q-item
          v-for="link in sidelinks"
          clickable
          v-ripple
          :to="link.path"
          :key="link.title"
          :v-bind="link"
          active-class="bg-teal-4"
          class="q-mb-s"
        >
          <q-item-section
            v-if="link.icon"
            thumbnail=""
            class="q-pl-md text-grey-2"
          >
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section class="text-uppercase">
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>-->
        <q-item
          clickable
          v-ripple
          active-class="bg-teal-4"
          class="q-mb-s"
          @click="() => (store.dashboard = true)"
        >
          <q-item-section thumbnail="" class="text-white q-pl-md">
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-">Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          active-class="bg-teal-4"
          class="q-mb-s"
          @click="() => (store.dashboard = false)"
        >
          <q-item-section thumbnail="" class="text-white q-pl-md">
            <q-icon name="edit" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-">Editor</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          active-class="bg-secondary"
          class="q-mb-s"
          @click="logout"
        >
          <q-item-section thumbnail="" class="text-white q-pl-md">
            <q-icon name="lock" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-">Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-item>
      <q-item-section class="text-grey-5">
        {{ pkg.productName }} v {{ pkg.version }}
      </q-item-section>

      <q-item-section avatar="" top>
        <q-btn
          flat
          dense
          round
          color=""
          :icon="miniMode && $q.screen.gt.xs ? 'arrow_right' : 'arrow_left'"
          :class="miniMode ? 'q-mr-md' : 'q-ml-md'"
          @click="$q.screen.gt.xs ? toggleLeftMini() : toggleLeftDrawer()"
        />
      </q-item-section>
    </q-item>
  </q-drawer>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { logOut } from "src/composables/auth";
import { sidelinks, links } from "src/composables/links";
import pkg from "../../package.json";

const store = useDefaultStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const miniMode = ref(true);

const leftDrawerOpen = computed({
  get: () => store.leftDrawerOpen,
  set: (v) => (store.leftDrawerOpen = v),
});
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleLeftMini = () => {
  miniMode.value = !miniMode.value;
};
async function logout() {
  $q.dialog({
    title: "Sign out?",
    message: "You will be signed out",
    color: "negative",
    ok: true,
    cancel: true,
  }).onOk(async () => {
    await logOut();
    store.user = {};
    router.push({ name: "Login" });
  });
}
function goHome() {
  router.push("/");
}
</script>
<style>
.fits {
  height: calc(100vh - 132px);
}
</style>
