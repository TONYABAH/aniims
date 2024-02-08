<template>
  <q-layout view="LHh Lpr Fff" style="overflow: hidden">
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
        :keep-alive="true"
        class="modern-bg fits"
        style="padding: 0"
      >
        <q-tab-panel name="search" class="fits" style="opacity: 1">
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
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useDefaultStore } from "../stores/store.js";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultDrawer from "./DefaultDrawer.vue";
import DefaultFooter from "./DefaultFooter.vue";
import DashboardForm from "src/components/forms/DashboardForm.vue";
import SearchPanel from "src/components/SearchPanel.vue";

const store = useDefaultStore();
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
const drawerLeft = ref(true);
</script>

<style scoped>
.fits {
  height: calc(100vh - 88px);
}
</style>
<style>
.modern-bg {
  background: url(../assets/modernbg.jpg);
}
.design-bg {
  background: url(../assets/designbg.jpg);
}
.exortic-bg {
  background: url(../assets/exorticbg.jpg);
}
.patterns-bg {
  background: url(../assets/patterns.jpg);
}
.modern-bg,
.exortic-bg,
.design-bg,
.patterns-bg {
  background-repeat: no-repeat;
  background-position-y: top;
  background-size: cover;
  background-attachment: scroll;
}
</style>
