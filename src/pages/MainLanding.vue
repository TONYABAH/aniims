<template>
  <q-page padding="" class="exortic-bg" style="padding: 0">
    <div
      class="overlay"
      style="width: 100%; height: 100vh; margin-top: -16px; opacity: 0.9"
      :class="store.theme.bg.dark"
    >
      <q-toolbar class="q-mt-md">
        <q-toolbar-title>
          <span class="text-teal-1 text-bold q-pl-lg"
            >Welcome {{ store.user?.displayName || store.user.email }}</span
          >
        </q-toolbar-title>
      </q-toolbar>
      <q-scroll-area style="width: 100%; height: calc(100vh - 120px)">
        <div class="row q-pa-xs" style="padding-left: 1%; padding-right: 1%">
          <div
            class="col col-xs-12 col-sm-4 col-md-3 col-lg-3 q-pa-xs"
            v-for="(item, i) of links"
            :key="i"
          >
            <q-card
              flat
              dark
              class="full-width full-height"
              :class="$q.screen.lt.sm ? 'transparent' : store.theme.bg.normal"
            >
              <q-item
                dense
                clickable
                v-ripple
                @click.stop="navigateTo(item)"
                class="q-py-sm"
                :class="$q.screen.lt.sm ? 'q-py-' : 'q-py-md'"
              >
                <q-item-section avatar>
                  <DashboardChip
                    :collectionName="item.name"
                    :icon="item.icon"
                    bg-color="amber-10"
                    dense
                    ref="dashboardRef"
                  />
                </q-item-section>
                <q-item-section class="text-h6" style="font-weight: 300">{{
                  item.name
                }}</q-item-section>
                <q-item-section avatar></q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-page>
  <q-circular-progress
    v-if="loading"
    indeterminate
    size="290px"
    :thickness="0.2"
    color="lime"
    center-color="primary"
    track-color="red"
    class="q-ma-md"
    style="position: absolute; left: 20vw; top: 20vh"
  />
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { links } from "src/composables/links";
import { useQuasar } from "quasar";
import DashboardChip from "src/components/dashboard/DashboardChip.vue";

const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const store = useDefaultStore();
const dashboardRef = ref(null);

function navigateTo(link) {
  if (router.currentRoute.value.path !== link.path) {
    setTimeout(() => {
      loading.value = false;
    }, 15000);
    loading.value = true;
    //store.currentCollection = link.name;
    router
      .push(link.path)
      .then(() => {
        //store.searchResults = dashboardRef.value;
      })
      .catch((e) => {
        console.log(e.message);
        $q.notify({
          timeout: 3000,
          message: "Admin right required",
          color: "red",
          textColor: "white",
          position: "center",
          icon: "error",
        });
      })
      .finally(() => (loading.value = false));
  }
}
</script>
<style scoped>
.main {
  background-attachment: scroll;
}
</style>
