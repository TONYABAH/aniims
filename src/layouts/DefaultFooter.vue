<template>
  <q-footer class="bg-deep-purple-10 text-grey-1">
    <q-bar dark="" class="text-white">
      <q-toolbar-title style="font-size: 12px; font-variant: small-caps">
        {{ pkg.productName }} v{{ pkg.version }} -
        {{ pkg.description }}</q-toolbar-title
      >
      <!--<FloatingEditorButtons direction="up" />-->
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
    </q-bar>
  </q-footer>
</template>
<script setup>
//import { useQuasar } from "quasar";
import pkg from "../../package.json";
//const $q = useQuasar();
</script>
