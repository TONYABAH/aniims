<template>
  <q-layout view="lHh Lpr fFf">
    <default-header />
    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="true"
      :class="store.theme.bg.normal"
      :mini-width="68"
      :mini="miniMode"
      :bordered="$q.dark.isActive"
      :breakpoint="800"
      :width="$q.screen.width > 800 ? 380 : $q.screen.width"
      class="text-white elevation-1"
      style="opacity: 0.99"
      elevated=""
    >
      <q-item :class="store.theme.bg.dark" :clickable="false">
        <q-item-section>
          {{ pkg.productName }} v {{ pkg.version }}
        </q-item-section>

        <q-item-section avatar="" top>
          <q-btn
            flat
            dense
            color="white"
            :icon="miniMode && $q.screen.gt.xs ? 'arrow_right' : 'close'"
            @click="$q.screen.gt.sm ? toggleMiniMode() : toggleLeftDrawer()"
          />
        </q-item-section>
      </q-item>
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
                ? store.theme.bg.dark
                : store.theme.bg.light
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
      <q-scroll-area style="width: 100%; height: calc(100vh - 48px)">
        <q-banner
          v-if="banner"
          class="bg-deep-purple text-white"
          style="opacity: 0.8"
        >
          <div class="text-h5">
            Welcome {{ store.user?.displayName || store.user?.email }}
          </div>
          <template v-slot:action>
            <q-btn
              unelevated=""
              color="grey-10"
              label="Dismiss"
              @click="() => (banner = false)"
            />
          </template>
        </q-banner>
        <router-view />
      </q-scroll-area>
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, ref } from "vue";
import pkg from "../../package.json";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultFooter from "./DefaultFooter.vue";
//import { data } from "autoprefixer";

const $q = useQuasar();
const store = useDefaultStore();
const miniMode = ref(false);
const banner = ref(true);
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
    link: "/admin/user",
  },
  {
    title: "Staff",
    caption: "Staff entry",
    icon: "people",
    link: "/admin/staff",
  },

  {
    title: "Ipos",
    caption: "IPO entry",
    icon: "balance",
    link: "/admin/ipo",
  },
  {
    title: "Units",
    caption: "Unit entry",
    icon: "work",
    link: "/admin/unit",
  },
  {
    title: "Home",
    icon: "house",
    link: "/",
  },
  /* {
    title: "Admin home",
    caption: "Admin home",
    icon: "key",
    link: "/admin",
  },*/
];
</script>
<style scoped>
.maron-bg {
  /*background-image: url(../assets/patterns.jpg);*/
  /*background: linear-gradient(#827, #827);*/
  background: linear-gradient(#827, #827);
}
.q-list .q-item {
  /*border-radius: 15px;*/
}
.q-drawer .q-list .q-item {
  /*border-radius: 25px 0 0 25px;*/
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
