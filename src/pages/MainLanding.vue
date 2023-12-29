<template>
  <q-page padding="" class="exortic-bg" style="padding: 0">
    <div
      class="overlay"
      style="
        width: 100%;
        height: 100vh;
        opacity: 0.9;
        margin-top: -16px;
        opacity: 0.82;
      "
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
              class="bg-transparent full-width full-height text-white"
            >
              <q-item
                dense
                clickable
                v-ripple
                @click.stop="navigateTo(item.path)"
                :class="$q.screen.gt.xs ? 'q-py-md' : 'q-py-xs'"
              >
                <q-item-section avatar>
                  <q-avatar
                    size="36px"
                    font-size="24px"
                    color=""
                    :icon="item.icon"
                    style="text-shadow: 1px 1px 7px 3px"
                  />
                </q-item-section>
                <q-item-section class="text-h6">{{ item.name }}</q-item-section>
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
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { links } from "src/composables/links";
import { useQuasar } from "quasar";
//import { useTheme } from "src/composables/use-fn";
//import CaseDetails from "src/components/CaseDetails.vue";
//import ComplaintForm from "src/components/ComplaintForm.vue";
//import StaffForm from "src/components/__StaffForm.vue";
//import SuspectForm from "src/components/SuspectForm.vue";
//const leftDrawerOpen = ref(false);
const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const store = useDefaultStore();
const theme = store.theme;

function navigateTo(to) {
  if (router.currentRoute.value.path !== to) {
    setTimeout(() => {
      loading.value = false;
    }, 15000);
    loading.value = true;
    router
      .push(to)
      .catch((e) => {
        console.log(e.message);
        $q.notify({
          timeout: 3000,
          message: "Admin right required",
          color: "red",
          textColor: "white",
          position: "left",
        });
      })
      .finally(() => (loading.value = false));
  }
}

onMounted(() => {
  // options.value.push(...(locations.map(l => l.label)))
});
</script>
<style scoped>
.main {
  background-attachment: scroll;
}
</style>
