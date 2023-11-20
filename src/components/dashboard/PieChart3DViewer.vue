<template>
  <ChartCard>
    <pie-chart
      :name="name"
      :data="data"
      :title="title"
      :download="true"
      :library="{
        is3D,
        slices,
      }"
      adapter="google"
    ></pie-chart>
  </ChartCard>
</template>

<script setup>
/*(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = false;
  s1.src = "https://www.gstatic.com/charts/loader.js";
  s1.charset = "UTF-8";
  s1.setAttribute("cross-origin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();*/
import { ref, onMounted, computed, inject, provide, watch } from "vue";
import ChartCard from "./ChartCard.vue";
const props = defineProps({
  name: String,
  title: String,
  data: Array,
  is3D: {
    default: true,
  },
  slice: {
    type: Object,
    default: () => ({
      1: { offset: 0.1 },
    }),
  },
});
const slices = computed(() => {
  let sl = {};
  for (let i = 1; i < props.data.length; i++) {
    sl[i] = { offset: 0.1 };
  }
  return sl;
});
</script>
