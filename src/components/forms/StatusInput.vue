<template>
  <q-select
    v-model="_status"
    label="Status *"
    options-dense=""
    :options="options"
    :rules="[(val) => !!val || 'Status is required']"
    lazy-rules="ondemand"
    hide-bottom-space=""
  >
    <template v-slot:append>
      <q-btn
        flat
        push
        color="secondary"
        label="Update"
        :loading="loading"
        @click.stop="updateStatus"
      />
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from "vue";
import { update } from "src/composables/remote";
import { Notify } from "quasar";

const props = defineProps({
  collectionName: String,
  documentId: String,
  status: String,
  setStatus: Function,
  options: {
    type: Array,
    default: () => ["Open", "Treated", "KIV", "Closed"],
  },
});
const _status = computed({
  get: () => props.status || "Open",
  set: (v) => props.setStatus(v),
});
//const status = ref(_status);
const loading = ref(false);

async function updateStatus() {
  loading.value = true;
  let data = { status: _status.value };
  update(props.documentId, data, props.collectionName)
    .then(() => {
      Notify.create({
        message: "Updated",
        timeout: 1000,
        color: "secondary",
        textColor: "grey-1",
        position: "right",
      });
    })
    .catch((e) => {
      Notify.create({
        message: e.message,
        timeout: 1000,
        color: "negative",
        textColor: "grey-1",
        position: "right",
      });
    })
    .finally(() => (loading.value = false));
}
</script>
