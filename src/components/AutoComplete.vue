<template>
  <q-select
    v-model="_model"
    use-input
    autocomplete=""
    options-dense=""
    :label="label"
    :options="_options"
    @filter="filterFn"
    @filter-abort="abortFilterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section> No results </q-item-section>
      </q-item>
    </template>
    <template v-slot:append v-if="icon">
      <q-icon :name="icon" />
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item dense v-bind="itemProps">
        <q-item-section thumbnail="">
          <q-checkbox
            left-label
            :model-value="selected"
            @update:model-value="toggleOption(opt)"
            size="xs"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label
            >{{ opt.name || opt }} {{ opt.rank || "" }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from "vue";
//const emits = defineEmits(["serach-model"]);

const props = defineProps({
  minChars: {
    type: Number,
    efault: 1,
  },
  icon: {
    type: String,
    default: "search",
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
  options: {
    type: Array,
    default: (v) => [],
  },
  icon: {
    type: String,
    default: "search",
  },
});
const _options = ref(props.options || []);
const _model = computed({
  get: () => props.model || null,
  set: (v) => {
    props.setModel(v);
  },
});
const filterFn = (val, update, abort) => {
  // call abort() at any time if you can't retrieve data somehow
  if (!val || val.length < props.minChars) {
    if (props.minChars > 0) {
      abort();
    } else {
      _options.value = props.options;
    }
    return;
  }
  setTimeout(() => {
    update(
      () => {
        //_options.value = props.filter(val);
        if (!val || val === "") {
          _options.value = props.options;
        } else {
          const needle = val.toLowerCase().trim();
          _options.value = props.filter(needle);
        }
      },

      // "ref" is the Vue reference to the QSelect
      (ref) => {
        if (val !== "" && ref.options.length > 0) {
          ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
          ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
        }
      }
    );
  }, 100);
};

const abortFilterFn = () => {
  // console.log('delayed filter aborted')
};
</script>
