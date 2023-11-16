<template>
  <q-page
    padding=""
    class="main"
    :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-pink-10'"
  >
    <q-bar class="q-my-md bg-transparent">
      <span class="text-teal-1 text-bold" style="padding-left: 5%"
        >Welcome {{ store.user?.displayName || store.user.email }}</span
      >
    </q-bar>
    <q-scroll-area style="width: 100%; height: calc(100vh - 200px)">
      <div
        class="row q-pa-xs q-px-xl"
        style="padding-left: 1%; padding-right: 1%"
      >
        <div
          class="col col-xs-12 col-sm-6 col-md-4 col-lg-3 q-pa-xs"
          v-for="(item, i) of links"
          :key="i"
        >
          <q-card flat class="menu-card full-width bg-transparent">
            <q-item
              dense
              clickable
              v-ripple
              @click.stop="navigateTo(item.path)"
            >
              <q-item-section avatar>
                <q-avatar
                  size="36px"
                  font-size="24px"
                  color=""
                  :text-color="$q.dark.isActive ? 'teal-5' : 'teal-2'"
                  :icon="item.icon"
                  style="text-shadow: 1px 1px 7px 3px"
                />
              </q-item-section>
              <q-item-section
                class="text-h6"
                :class="$q.dark.isActive ? 'text-teal-5' : 'text-teal-2'"
                >{{ item.name }}</q-item-section
              >
            </q-item>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
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
//import CaseDetails from "src/components/CaseDetails.vue";
//import ComplaintForm from "src/components/ComplaintForm.vue";
//import StaffForm from "src/components/__StaffForm.vue";
//import SuspectForm from "src/components/SuspectForm.vue";
//const leftDrawerOpen = ref(false);
const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const store = useDefaultStore();

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
  background-size: cover;
  background-attachment: scroll;
}
</style>
