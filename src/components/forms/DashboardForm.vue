<template>
  <q-card flat class="my-card" :class="$q.screen.lt.sm ? '' : 'q-px-md'">
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
