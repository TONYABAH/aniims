<template>
  <ChartCard :title="dataSource" :onZoom="drawChart">
    <canvas ref="canvassRef" class="bg-" :id="id"></canvas>
    <!--<Bar :data="data" :options="options" />-->
  </ChartCard>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import ChartCard from "../dashboard/ChartCard.vue";
import { Chart as ChartJS } from "chart.js";
import { COLORS, hexToRGBA } from "./colors";

const canvassRef = ref(null);
const id = "_" + Math.random().toString(16).substring(3);
var mixedChart = null;

const props = defineProps({
  dataSource: String,
});

function getData() {
  return {
    labels: ["January", "February", "March"],
    data: [
      { category: "Total", type: "line", data: [125, 160, 98] },
      { category: "Abuja", type: "bar", data: [25, 60, 45] },
      { category: "Asaba", type: "bar", data: [20, 50, 35] },
      { category: "Kaduna", type: "bar", data: [15, 70, 40] },
      { category: "Lagos", type: "bar", data: [35, 80, 65] },
    ],
  };
}

function getGradient(hex) {
  const gradient = canvassRef.value
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, hexToRGBA(hex, 1));
  gradient.addColorStop(0.5, hexToRGBA(hex, 0.25));
  gradient.addColorStop(1, hexToRGBA(hex, 1));
  return gradient;
}
function drawChart() {
  let chartData = getData();
  const ctx = document.getElementById(id);
  let _dataSet = [];
  let index = 0;
  for (let d of chartData.data) {
    let _d = {
      type: d.type,
      label: d.category,
      data: d.data,
      fill: false,
      borderColor: COLORS[index],
      pointBackgroundColor: "white",
      borderWidth: 1,
      pointBorderColor: "#FC2525",
      backgroundColor: getGradient(COLORS[index]),
      tension: 0.3,
      hoverOffset: 4,
      /*fill: {
          target: "origin",
          above: "rgba(255, 0, 0, .4)", // Area will be red above the origin
          below: "rgba(0, 0, 255,.4)", // And blue below the origin
        },*/
    };
    index++;
    _dataSet.push(_d);
  }
  const data = {
    labels: chartData.labels,
    datasets: _dataSet,
  };
  if (mixedChart) mixedChart.destroy();
  mixedChart = new ChartJS(ctx, {
    type: "bar",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    //plugins: [plugin],
  });
  mixedChart.resize(500, 300);
}

onMounted(() => {
  setTimeout(() => {
    //if (mixedChart) mixedChart.destroy();
    drawChart();
  }, 1);
});
onBeforeMount(() => {
  if (mixedChart) mixedChart.destroy();
});
</script>
