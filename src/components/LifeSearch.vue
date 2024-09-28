<template>
  <q-select
    v-model="_model"
    use-input
    hint=""
    clearable=""
    clear-icon="close"
    input-debounce="400"
    style="max-width: 450px"
    :rounded="rounded"
    :label="label"
    :options="options"
    @filter="filterFunction"
    @filter-abort="abortFilterFunction"
    @update:model-value="updateFunction"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { lifeSearch } from "src/composables/searchProvider";

const props = defineProps({
  model: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Search...",
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  abortFilterFunction: {
    type: Function,
    default: () => console.log("aborted"),
  },
  updateFunction: {
    type: Function,
    required: true,
  },
  idField: {
    type: String,
    required: false,
  },
});

const options = ref([]);

const _model = computed({
  get: () => props.model,
  set: (v) => props.updateFunction(v),
});
async function loadSearch(val) {
  return await lifeSearch("Units", { searchText: val });
}
function filterFunction(val, update, abort) {
  setTimeout(() => {
    update(async () => {
      if (val === "") {
        options.value = await loadSearch(val);
      } else {
        let data = await loadSearch(val);

        if (data.length == 0) {
          options.value = [];
          return;
        }
        options.value = data.reduce((acc, opt) => {
          acc.push(opt);
          return acc;
        }, []);
      }
    });
  }, 0);
}

</script>
