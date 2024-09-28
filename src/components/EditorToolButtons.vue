<template>
  <q-toolbar class="bg-orange" style="padding: 0" v-if="comment">
    <q-space />

    <q-btn
      color=""
      icon="check"
      class="q-mx-xs"
      size="md"
      label="Submit"
      unelevated=""
    >
      <q-menu persistent="">
        <SubmitDialog />
      </q-menu>
    </q-btn>

    <q-btn
      v-if="showAssignDialog"
      color=""
      icon="person"
      class="q-mx-xs"
      size="md"
      label="Assign"
      unelevated=""
    >
      <q-menu persistent="">
        <AssignDialog />
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script setup>
import { ref, computed, inject } from "vue";

import AssignDialog from "./AssignDialog.vue";
import { useDefaultStore } from "src/stores/store";
import SubmitDialog from "./SubmitDialog.vue";
//import { Notify, Dialog } from "quasar";
const store = useDefaultStore();
const comment = inject("comment");

const showAssignDialog = computed(() => {
  return (
    store.user?.claims?.role === "Director" ||
    store.user?.claims?.role === "Head"
  );
});
</script>
