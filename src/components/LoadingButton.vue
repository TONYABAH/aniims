<template>
  <q-btn :loading="loading" @click="submit">
    <template v-slot:loading>
      <q-spinner-hourglass class="on-left" />
      Wait...
    </template>
  </q-btn>
</template>
<script setup>
const props = defineProps({
  loading: Boolean,
  submit: {
    type: Function,
    required: true,
  },
});
</script>
