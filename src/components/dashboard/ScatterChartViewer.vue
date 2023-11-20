<template>
  <ChartCard>
    <bubble-chart
      v-if="bubble"
      :name="name"
      :data="data"
      :title="title"
      adapter="chartjs"
    ></bubble-chart>
    <scatter-chart
      v-else
      :name="name"
      :data="data"
      :title="title"
      adapter="chartjs"
    ></scatter-chart>
  </ChartCard>
</template>

<script setup>
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import ChartCard from "./ChartCard.vue";
const props = defineProps({
  name: String,
  title: String,
  data: Array,
  bubble: Boolean,
});
</script>
