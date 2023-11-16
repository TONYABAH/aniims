<template>
  <q-select
    v-model="_model"
    clearable
    clear-icon="close"
    use-input
    options-dense=""
    input-debounce="500"
    :fill-input="false"
    :label="label"
    :options="_options"
    :placeholder="placeholder"
    :use-chips="false"
    autocomplete=""
    @filter="(val, update, abort) => filterFn(val, update, abort)"
    @filter-abort="abortFilterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section> No results </q-item-section>
      </q-item>
    </template>
    <template v-slot:prepend v-if="icon">
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from "vue";
const emits = defineEmits(["serach-model"]);
const _options = ref([]);

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  autoSelect: {
    type: Boolean,
    default: true,
  },
  minChars: {
    type: Number,
    efault: 1,
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Search",
  },
  model: {
    required: true,
  },
  setModel: {
    type: Function,
    default: (v) => {
      //console.log(v);
    },
  },
  filter: {
    type: Function,
    default: (v) => {
      //console.log(v);
    },
  },
  icon: {
    type: String,
    default: undefined,
  },
});
const _model = computed({
  get: () => props.model || "",
  set: (v) => {
    props.setModel(v);
  },
});
const filterFn = (val, update, abort) => {
  // call abort() at any time if you can't retrieve data somehow
  if (!val || val.length < props.minChars) {
    abort();
    return;
  }
  setTimeout(() => {
    update(
      () => {
        _options.value = props.filter(val);
        /*if (!val || val === "") {
          _options.value = props.options;
        } else {
          //const needle = val.toLowerCase();
          _options.value = props.filter(val);
        }*/
      },

      // "ref" is the Vue reference to the QSelect
      (ref) => {
        if (val !== "" && ref.options.length > 0) {
          ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
          ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
        }
      }
    );
  }, 300);
};

const abortFilterFn = () => {
  // console.log('delayed filter aborted')
};
</script>
