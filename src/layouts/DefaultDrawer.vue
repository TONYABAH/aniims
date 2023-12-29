<template>
  <q-drawer
    v-if="route.name !== 'Home'"
    v-model="leftDrawerOpen"
    show-if-above=""
    :mini="miniMode"
    :mini-width="80"
    :behavior="$q.screen.gt.xs ? 'desktop' : 'mobile'"
    :elevated="false"
    :breakpoint="500"
    :width="$q.screen.width > 500 ? 240 : $q.screen.width"
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
      :class="$q.dark.isActive ? 'bg-grey-9' : store.theme.bg.dark"
      style="width: 100%; height: calc(100vh - 80px); opacity: 0.9"
    >
      <q-list>
        <q-item
          v-for="link in links"
          clickable
          v-ripple
          :to="link.path"
          :key="link.title"
          :v-bind="link"
          :active-class="
            $q.dark.isActive
              ? store.theme.bg.dark + ' border-right'
              : store.theme.bg.light + ' border-right'
          "
        >
          <q-item-section
            v-if="link.icon"
            thumbnail=""
            class="q-pl-md text-grey-2"
          >
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section style="font-variant: small-caps; font-size: large">
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
          <q-item-section side top class="text-amber">
            <!--<q-icon name="star" />-->
          </q-item-section>
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
//import { logOut } from "src/composables/authentication";
import { links } from "src/composables/links";
//import pkg from "../../package.json";
//import { useTheme } from "src/composables/use-fn";

const store = useDefaultStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const miniMode = ref(false);
//store.tabModel = "search";
//const theme = ref(store.theme);
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
watch(
  () => route.path,
  async (p) => {
    //console.log(p);
    if (p) store.tabModel = "edit";
  },
  { immediate: true }
);
</script>
<style>
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
