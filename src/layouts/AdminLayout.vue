<template>
  <q-layout view="HHh Lpr fFf">
    <default-header />
    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="true"
      :mini-width="68"
      :mini="miniMode"
      :width="$q.screen.width > 600 ? 280 : $q.screen.width"
      :bordered="false"
      behavior="mobile"
      flat
      dark
      class="elevation-1"
      :class="store.theme.bg.normal"
      style="opacity: 0.8"
    >
      <q-item :clickable="false">
        <q-item-section>
          {{ pkg.productName }} v {{ pkg.version }}
        </q-item-section>

        <q-item-section avatar="" top>
          <q-btn
            flat
            dense
            color=""
            :icon="miniMode && $q.screen.gt.xs ? 'arrow_right' : 'close'"
            @click="$q.screen.gt.sm ? toggleMiniMode() : toggleLeftDrawer()"
          />
        </q-item-section>
      </q-item>
      <!--<q-btn
        color="primary"
        icon="settings"
        label="Configure"
        class="full-width"
        @click="configure"
      />-->
      <q-list>
        <q-item
          v-for="link in links"
          clickable=""
          v-ripple
          :to="link.link"
          :key="link.title"
          :v-bind="link"
          :active-class="
            link.link !== '/admin'
              ? $q.dark.isActive
                ? store.theme.bg.dark + ' text-white'
                : store.theme.bg.dark + ' text-white'
              : ''
          "
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section style="font-variant: small-caps; font-size: large">
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="modern-bg2">
      <div style="width: 100%; height: calc(100vh - 48px); overflow: auto">
        <router-view />
      </div>
    </q-page-container>
    <default-footer />
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, ref, onMounted, onUnmounted } from "vue";
import pkg from "../../package.json";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultFooter from "./DefaultFooter.vue";
//import { data } from "autoprefixer";
//import { listAllDocuments } from "src/composables/searchProvider.js";
const $q = useQuasar();
const store = useDefaultStore();
const miniMode = ref(false);
//const banner = ref(true);
const leftDrawerOpen = computed({
  get: () => store.leftDrawerOpen,
  set: (v) => (store.leftDrawerOpen = v),
});
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleMiniMode = () => {
  miniMode.value = !miniMode.value;
};
const links = [
  {
    title: "Users",
    caption: "User entry",
    icon: "perm_identity",
    link: "/app/admin/users",
    active: true,
  },
  {
    title: "Staff",
    caption: "Staff entry",
    icon: "people",
    link: "/app/admin/staff",
  },

  {
    title: "Ipos",
    caption: "IPO entry",
    icon: "balance",
    link: "/app/admin/ipos",
  },
  {
    title: "Units",
    caption: "Unit entry",
    icon: "work",
    link: "/app/admin/units",
  },
  {
    title: "App",
    icon: "apps",
    link: "/app/",
  },
  {
    title: "home",
    caption: "Home",
    icon: "house",
    link: "/",
  },
];
/*async function configure() {
  let collections =
    "Mails Files Complaints Investigations Raids Payments Samples Destructions Applications Users Units".split(
      " "
    );
  for (let c of collections) await listAllDocuments("Mails");
}*/
onMounted(() => (document.body.style.overflow = "hidden"));
onUnmounted(() => (document.body.style.overflow = "auto"));
</script>
<style scoped>
.maron-bg {
  /*background-image: url(../assets/patterns.jpg);*/
  /*background: linear-gradient(#827, #827);*/
  background: linear-gradient(#827, #827);
}
</style>
<style>
.modern-bg {
  background: url(../assets/modernbg.jpg);
  background-repeat: no-repeat;
  background-position-y: top;
  background-size: cover;
  background-attachment: scroll;
}
.modern-bg2 {
  background: url(../assets/modernbg.jpg);
  background-repeat: no-repeat;
  background-position-y: top;
  background-size: cover;
  background-attachment: scroll;
}
</style>
