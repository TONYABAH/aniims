<template>
  <q-select
    dense
    filled=""
    v-model="model"
    use-input
    color="white"
    input-debounce="400"
    :label="label"
    :options="options"
    @filter="filterFunction"
    @filter-abort="abortFilterFunction"
    style="max-width: 450px"
    hint=""
    :rounded="rounded"
    :readonly="readOnly"
    @update:model-value="updateFunction"
    clearable=""
    clear-icon="close"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { useBackend } from "src/composables/backend.js";
import { Dialog, Notify } from "quasar";
//import { useDefaultStore } from "src/stores/store";
import { onMounted, ref, watch, computed } from "vue";
import { api } from "src/boot/axios";

const backend = useBackend();
// const store = useDefaultStore();
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  initial: {
    type: String,
    default: "",
  },
  abortFilterFn: {
    type: Function,
    //default: abortFilterFunction,
  },
  path: {
    type: String,
  },
  id: {
    type: String,
    default: "id",
  },
  label: {
    type: String,
    default: "Search...",
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  updateFunction: {
    type: Function,
    default: (d) => {
      console.log(d);
    },
  },
});

const options = ref([]);
const model = computed({
  get: () => props.initial,
  set: (v) => props.updateFunction(v),
});

async function loadData(path, query) {
  let resp = await api.get(`${path}/?s=${query}`);
  if (resp.data) {
    return resp.data;
  }
  return [];
}
function filterFunction(val, update, abort) {
  setTimeout(() => {
    update(async () => {
      if (val === "") {
        options.value = [];
      } else {
        let data = await loadData(props.path, val);
        if (data.length == 0) {
          options.value = [];
          return;
        }
        options.value = data.reduce((acc, opt) => {
          acc.push(opt[props.id]);
          return acc;
        }, []);
      }
    });
  }, 0);
}

function abortFilterFunction() {
  if (props.abortFilterFn) return props.abortFilterFn();
  console.log("delayed filter aborted");
}

onMounted(async () => {
  //const res = await api.get('units')
  //units.value = res.data
  //console.log(mail.value);
});

// defineExpose({ onResetForm, onRemoveData, onSave });
</script>
