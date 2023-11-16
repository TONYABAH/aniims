<template>
  <q-dialog v-model="model" persistent>
    <q-card flat>
      <q-card-section class="row items-center bg-teal text-white">
        <q-icon name="perm_identity" />
        <span class="q-ml-sm">Suspect</span>
      </q-card-section>
      <q-card-section>
        <SuspectForm />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-if="suspect?.id && !readOnly"
          no-caps=""
          label="Delete"
          color="red"
          v-close-popup
          unelevated=""
          glossy=""
          @click="onDelete(suspect)"
        />
        <q-space />
        <q-btn
          v-if="!readOnly"
          no-caps=""
          label="Save"
          color="primary"
          v-close-popup
          unelevated=""
          glossy=""
          @click="onSubmit(suspect)"
        />
        <q-btn
          no-caps=""
          label="Cancel"
          color="red"
          v-close-popup
          @click="onCancel"
          glossy=""
          unelevated=""
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
//import { useQuasar } from "quasar";
//import { useBackend } from "src/composables/backend";
import { useDefaultStore } from "src/stores/store";
import { computed, inject } from "vue";
import SuspectForm from "./SuspectForm.vue";

//const backend = useBackend()
const store = useDefaultStore();

const props = defineProps({
  popupModel: { type: Boolean, default: false },
  onChangeModel: Function,
  readOnly: Boolean,
  onSubmit: Function,
  onDelete: Function,
});
const suspect = inject("suspect")

const model = computed({
  get: () => props.popupModel,
  set: (v) => props.onChangeModel(v),
});

function onCancel() {
  suspect.value = {};
}
</script>
