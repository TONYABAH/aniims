<template>
  <ChartCard :title="dataSource" :onZoom="drawChart">
    <canvas ref="canvassRef" class="bg-" :id="id"></canvas>
  </ChartCard>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { Chart as ChartJS } from "chart.js";
import ChartCard from "../dashboard/ChartCard.vue";
import { COLORS } from "./colors";

const canvassRef = ref(null);
const id = "_" + Math.random().toString(16).substring(3);
var pieChart = null;

const props = defineProps({
  dataSource: String,
  chartType: {
    default: "doughnut",
    type: String,
  },
});

function getData() {
  return {
    categories: ["Food", "Drugs", "Cosmetics", "Beverages", "Devices"],
    label: "Products",
    data: [300, 50, 100, 75, 20],
  };
}
function drawChart() {
  const ctx = document.getElementById(id);
  const _data = getData();
  const data = {
    labels: _data.categories,
    datasets: [
      {
        label: _data.label,
        data: _data.data,
        backgroundColor: _data.categories.map((d, i) => COLORS[i]),
        /*["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)","rgb(255, 205, 186)","rgb(155, 205, 186)",],*/
        hoverOffset: 4,
      },
    ],
  };
  if (pieChart) pieChart.destroy();
  pieChart = new ChartJS(ctx, {
    type: props.chartType,
    data,
  });
  pieChart.resize(500, 300);
}

onMounted(() => {
  setTimeout(() => {
    drawChart();
  }, 1);
});
onBeforeMount(() => {
  if (pieChart) pieChart.destroy();
});
</script>
