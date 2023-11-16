<template>
  <q-layout view="hHh Lpr fFf">
    <default-header />
    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="true"
      :breakpoint="900"
      :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-teal-10'"
      :mini-width="68"
      :mini="miniMode"
      :bordered="$q.dark.isActive"
      class="text-white"
    >
      <q-item class="bg-" :clickable="false">
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
                ? 'bg-blue-grey-9'
                : 'bg-blue-grey-8'
              : ''
          "
          class="q-ml-xs"
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container
      :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-9'"
    >
      <q-scroll-area style="width: 100%; height: calc(100vh - 48px)">
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
    title: "Admin Home",
    icon: "house",
    link: "/admin",
  },
  {
    title: "Staff",
    caption: "Staff entry",
    icon: "people",
    link: "/admin/staff",
  },

  {
    title: "Users",
    caption: "User entry",
    icon: "perm_identity",
    link: "/admin/user",
  },
  {
    title: "IPOs",
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
.q-item {
  border-radius: 15px;
}
.q-drawer .q-item {
  border-radius: 25px 0 0 25px;
}
</style>
