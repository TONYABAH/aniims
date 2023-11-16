<template>
  <q-fab
    color=""
    icon="apps"
    direction="down"
    padding="sm"
    unelevated=""
    v-if="showSave"
  >
    <q-fab-action glossy="" color="amber" @click="returnDocument" icon="undo" />
    <q-fab-action glossy="" color="positive" @click="onSubmit" icon="check" />

    <q-fab-action glossy="" color="purple" icon="perm_identity">
      <q-menu persistent="">
        <AssignDialog
          :on-success="onAssignDialogSuccess"
          :on-cancel="onAssignDialogCancel"
        />
      </q-menu>
    </q-fab-action>
    <q-fab-action glossy="" color="negative" @click="onDelete" icon="delete" />
    <!--<q-fab-action glossy="" color="teal" @click="saveDocument" icon="save" />
    <q-fab-action glossy="" color="negative" @click="clearForm" icon="close" />-->
  </q-fab>
</template>
<script setup>
import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import AssignDialog from "./AssignDialog.vue";
const store = useDefaultStore();
const showSave = computed(() => store.currentDocument?.id !== undefined);
function onAssignDialogSuccess() {}
function onAssignDialogCancel() {}
</script>
