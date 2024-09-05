<template>
  <q-form autofocus="" class="text-teal">
    <!--<label for="" class="text-white q-py-md">Write minutes</label>-->
    <textarea
      v-model="comment"
      autofocus
      rows="3"
      class="full-width q-px-sm"
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'"
    ></textarea>
    <slot></slot>
  </q-form>
</template>
<script setup>
import { computed } from "vue";
//import { useDefaultStore } from "src/stores/store";
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  setText: {
    type: Function,
    required: true,
  },
});
const comment = computed({
  get: () => props.text,
  set: (v) => props.setText(v),
});
//const comment = inject("comment");
</script>
