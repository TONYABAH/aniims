<template>
  <q-page
    padding=""
    class="main text-white"
    :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-9'"
  >
    <q-toolbar class="q-mb-md">
      <q-toolbar-title>
        <div class="text-h6 text-white text-bold q-ml-md q-my-md">
          Welcome {{ store.user?.displayName || store.user.email }}
        </div>
      </q-toolbar-title>
    </q-toolbar>
    <div class="row q-col-gutter-sm">
      <div
        class="col col-xs-6 col-sm-4 col-md-3 col-lg-3"
        v-for="(item, i) of actions"
        :key="i"
      >
        <q-btn
          flat
          rounded=""
          class="menu-card full-width text-white q-px-xl"
          :color="$q.dark.isActive ? 'lime' : 'grey-1'"
          :to="'/admin/' + item.path"
          :icon="item.icon"
          :label="item.name"
          size="md"
          align="left"
        >
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup>
//import CaseDetails from "src/components/CaseDetails.vue";
//import ComplaintForm from "src/components/ComplaintForm.vue";
//import StaffForm from "src/components/__StaffForm.vue";
//import SuspectForm from "src/components/SuspectForm.vue";
import { useDefaultStore } from "src/stores/store";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const selectedCase = ref();
const store = useDefaultStore();
const actions = [
  {
    path: "staff",
    name: "Staff",
    title: "View and edit staff",
    icon: "people",
  },
  { path: "unit", name: "Units", title: "View and edit unit", icon: "cases" },
  {
    path: "user",
    name: "Users",
    title: "View and edit user",
    icon: "perm_identity",
  },
  { path: "ipo", name: "IPO", title: "View and edit IPO", icon: "balance" },
];
onMounted(() => {
  // options.value.push(...(locations.map(l => l.label)))
});
</script>
<style scoped>
.main {
  background-size: cover;
  background-attachment: fixed;
  overflow: hidden;
}
</style>
