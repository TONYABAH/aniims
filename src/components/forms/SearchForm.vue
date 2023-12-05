<template>
  <q-card flat :class="$q.dark.isActive ? 'bg-blue-grey-10' : ''">
    <q-toolbar>
      <q-icon name="search" size="sm" class="q-mr-md" />
      <q-toolbar-title>
        {{ store.currentCollection }}
      </q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <search-panel ref="searchRef"></search-panel>
      <search-list
        :activeClass="
          $q.dark.isActive ? 'text-yellow bg-grey-8' : 'text-teal bg-grey-2'
        "
      />
      <q-btn color="teal" icon="add" no-caps unelevated="" to="/">
        Add New Item
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
//import { useQuasar, Notify, Dialog } from "quasar";
import { ref, computed } from "vue";
//import { useRoute } from "vue-router";
import { useDefaultStore } from "src/stores/store.js";

const store = useDefaultStore();
</script>
