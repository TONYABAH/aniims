<template>
  <q-drawer
    v-if="route.name !== 'Home'"
    v-model="leftDrawerOpen"
    show-if-above=""
    :mini="miniMode"
    :mini-width="80"
    :elevated="false"
    :behavior="$q.screen.gt.sm ? 'desktop' : 'mobile'"
    :width="$q.screen.width > 600 ? 280 : $q.screen.width"
    style="letter-spacing: 1.2px; overflow: hidden"
    class="text-grey-1 exortic-bg"
  >
    <q-item style="" :class="store.theme.bg.normal">
      <q-item-section class="text-grey-1 q-pl-md">
        <q-item-label>
          {{ store.user?.displayName || store.user?.email }}
        </q-item-label>
      </q-item-section>

      <q-item-section side="" :class="miniMode ? 'q-mr-md' : 'q-ml-xl'">
        <q-btn
          flat
          dense
          align="left"
          :color="store.settings.themeColor + '-1'"
          :icon="miniMode && $q.screen.gt.xs ? 'apps' : 'close'"
          class="full-width"
          @click="$q.screen.gt.xs ? toggleLeftMini() : toggleLeftDrawer()"
        />
      </q-item-section>
    </q-item>
    <q-scroll-area
      :class="$q.dark.isActive ? 'bg-blue-grey-9' : store.theme.bg.dark"
      style="width: 100%; height: calc(100vh - 80px); opacity: 0.96"
    >
      <q-list>
        <q-item
          v-for="link in links"
          clickable
          v-ripple
          :key="link.title"
          :active-class="
            $q.dark.isActive
              ? store.theme.bg.dark + ' border-right'
              : store.theme.bg.normal + ' border-right'
          "
          :active="store.currentCollection === link.name"
          class="text-white"
          @click="navigateTo(link)"
        >
          <q-item-section
            v-if="link.icon"
            thumbnail=""
            class="q-pl-md text-grey-1"
          >
            <DashboardChip
              :collectionName="link.name"
              :icon="link.icon"
              bg-color="red"
              ref="dashboardRef"
            />
          </q-item-section>

          <q-item-section
            style="
              font-size: 16px;
              font-weight: 100;
              text-shadow: none;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
          <q-item-section side top> </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { links } from "src/composables/links";
//import { logOut } from "src/composables/authentication";
//import pkg from "../../package.json";
//import { useTheme } from "src/composables/use-fn";
import DashboardChip from "src/components/dashboard/DashboardChip.vue";

const store = useDefaultStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const miniMode = ref(false);
const loading = ref(false);
const dashboardRef = ref(null);

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
function navigateTo(link) {
  if (router.currentRoute.value.path !== link.path) {
    setTimeout(() => {
      loading.value = false;
    }, 15000);
    loading.value = true;

    //store.currentCollection = link.name; //to.replace(/\//g, "");
    //console.log(to.replace(/\//g, ""));
    store.tabModel = "search";
    router
      .push(link.path)
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
          position: "left",
          icon: "error",
        });
      })
      .finally(() => (loading.value = false));
  }
}
</script>
<style scoped>
.fits {
  height: calc(100vh - 60px);
}
.active {
  border: 2px solid black;
}
.border-right {
  border-right: 2px solid yellow;
}
</style>
