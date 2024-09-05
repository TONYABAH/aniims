<template>
  <q-layout view="LHH Lpr Fff" style="overflow: hidden" class="modern-bg">
    <default-header />
    <DefaultDrawer />
    <q-page-container style="overflow: auto">
      <router-view v-if="$route.path === '/'"></router-view>
      <q-tab-panels
        v-model="store.tabModel"
        animated
        vertical=""
        transition-prev="scale"
        transition-next="scale"
        :keep-alive="false"
        class="bg-transparent"
        style="padding: 0; margin-top: 40px"
      >
        <q-tab-panel name="search" class="" style="opacity: 1">
          <SearchPanel />
        </q-tab-panel>
        <q-tab-panel
          name="edit"
          class="items-left justify-left"
          style="padding: 0; margin-bottom: 120px"
        >
          <router-view></router-view>
        </q-tab-panel>
        <q-tab-panel
          name="dashboard"
          style="padding: 0"
          v-if="!$route.params.id"
        >
          <DashboardForm />
        </q-tab-panel>
      </q-tab-panels>
      <q-page-sticky
        position="top"
        :offset="[0, 0]"
        expand
        v-if="isDefaultRoute"
      >
        <MainTabs :isDefaultRoute="isDefaultRoute" />
      </q-page-sticky>
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { computed } from "vue";
import { useDefaultStore } from "../stores/store.js";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultDrawer from "./DefaultDrawer.vue";
import DefaultFooter from "./DefaultFooter.vue";
import DashboardForm from "src/components/forms/DashboardForm.vue";
import SearchPanel from "src/components/SearchPanel.vue";
import MainTabs from "./MainTabs.vue";
import { useRoute } from "vue-router";
const store = useDefaultStore();
const route = useRoute();
//import FormWrapper from "src/components/FormWrapper.vue";
/*const DashboardViewer = defineAsyncComponent(() =>
  import("src/components/forms/DashboardForm.vue")
);
const SearchPanel = defineAsyncComponent(() =>
  import("src/components/SearchPanel.vue")
);
const SearchList = defineAsyncComponent(() =>
  import("src/components/SearchList.vue")
);*/
//const drawerLeft = ref(true);
const isDefaultRoute = computed(() => {
  return (
    route.name !== "Home" &&
    route.name !== "Cases" &&
    route.path.indexOf("/admin") === -1
    //&& route.path.indexOf("/applications") === -1
  );
});
</script>

<style scoped>
.fits {
  height: calc(100vh - 88px);
}
</style>
<style></style>
