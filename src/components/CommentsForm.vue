<template>
  <q-form autofocus="" class="text-teal">
    <label for="" class="">Write minutes</label>
    <textarea
      v-model="comment"
      autofocus
      rows="5"
      class="full-width q-px-sm"
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'"
    ></textarea>
    <slot></slot>
  </q-form>
</template>
<script setup>
import { inject} from "vue";
//import { useDefaultStore } from "src/stores/store";

const comment = inject("comment");
</script>
