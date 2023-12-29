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
        keep-alive=""
        class="modern-bg fits"
        style="padding: 0"
      >
        <q-tab-panel name="search">
          <SearchPanel />
          <q-btn
            unelevated=""
            :color="store.theme.color.light"
            icon="add"
            icon-right="arrow_right"
            label="Add new"
            class="q-ma-xs"
            @click="addNewItem"
          />
        </q-tab-panel>
        <q-tab-panel
          name="edit"
          class="items-left justify-left"
          style="padding: 0; margin-bottom: 80px"
        >
          <router-view></router-view>
        </q-tab-panel>
        <q-tab-panel name="dashboard" style="padding: 0">
          <DashboardForm />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { watch, defineAsyncComponent } from "vue";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultDrawer from "./DefaultDrawer.vue";
import DefaultFooter from "./DefaultFooter.vue";
import { useDefaultStore } from "../stores/store.js";
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

function addNewItem() {
  store.tabModel = "edit";
}
watch(
  () => store.tabModel,
  (newTab) => {
    if (newTab === "search") {
      store.currentDocument = {};
    }
  }
);
</script>
<script type="application/javascript"></script>
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
