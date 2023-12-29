<template>
  <q-card
    flat
    class="bg-grey-2 q-pb-xl"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    style="opacity: 1"
  >
    <q-toolbar>
      <q-icon name="dashboard" size="sm" class="q-mr-md" />
      <q-toolbar-title>
        {{ store.currentCollection }} / dashboard
      </q-toolbar-title>
    </q-toolbar>
    <DViewer />
  </q-card>
</template>
<script setup>
import { ref } from "vue";
import { useDefaultStore } from "src/stores/store.js";
import DViewer from "../dashboard/DashboardViewer.vue";
const store = useDefaultStore();
</script>
