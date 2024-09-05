<template>
  <q-btn
    :loading="loading"
    flat
    color="secondary"
    label="Update"
    @click.stop="(e) => updateField(e)"
  />
  <q-icon name="person" />
</template>

<script setup>
import { Notify, Dialog, debounce } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { update } from "src/composables/remote";
const loading = ref(false);

const props = defineProps({
  field: String,
  value: Object,
  collection: String,
  id: String,
});
//const fieldValue = computed(() => props.value);
//const documentId = computed(() => props.id);
async function updateField(e) {
  loading.value = true;
  let obj = {};
  obj[props.field] = props.value;
  update(props.id, obj, props.collection)
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Updated " + props.collection,
        caption: "Update " + props.collection,
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e);
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
