<template>
  <ChartCard>
    <pie-chart
      :name="name"
      :data="data"
      :title="title"
      :download="true"
      :donut="donut"
    ></pie-chart>
  </ChartCard>
</template>

<script setup>
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import ChartCard from "./ChartCard.vue";
const props = defineProps({
  name: String,
  title: String,
  data: Array,
  donut: { type: Boolean, default: false },
});
/*(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://www.gstatic.com/charts/loader.js";
  s1.charset = "UTF-8";
  s1.setAttribute("cross-origin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();*/
</script>
