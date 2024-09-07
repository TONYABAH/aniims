<template>
  <ChartCard :title="dataSource" :onZoom="drawChart">
    <canvas ref="canvassRef" class="bg-" :id="id"></canvas>
    <!--<Bar :data="data" :options="options" />-->
  </ChartCard>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { Chart as ChartJS } from "chart.js";
import ChartCard from "../dashboard/ChartCard.vue";
import { hexToRGBA } from "./colors";

const canvassRef = ref(null);
const id = "_" + Math.random().toString(16).substring(3);
var mixedChart = null;

const props = defineProps({
  dataSource: {
    type: String,
    default: "Meta",
  },
  fill: {
    type: Boolean,
    default: false,
  },
  rightYAxis: {
    type: Boolean,
    default: false,
  },
  getData: {
    type: Function,
    default: () => {
      return {
        labels: [
          "Food",
          "Drugs",
          "Cosmetics",
          "Devices",
          "Chemicals",
          "Drinks",
        ],
        data: [
          {
            category: "Market Value",
            type: "line",
            data: [75, 67, 90, 60, 55, 78].map((d) => d * 15000),
            fill: false,
          },
          {
            category: "Products",
            type: "bar",
            data: [75, 67, 90, 40, 75, 67].map((d) => d * 10000),
            fill: false,
          },
        ],
      };
    },
  },
});

function getGradient(hex) {
  const gradient = canvassRef.value
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, hexToRGBA(hex, 1));
  gradient.addColorStop(0.5, hexToRGBA(hex, 0.5));
  gradient.addColorStop(1, hexToRGBA(hex, 1));
  return gradient;
}

function drawChart() {
  const ctx = document.getElementById(id);
  let chartData = props.getData();
  /*let _dataSet = [];
  let index = 0; //|| Math.floor(Math.random() * 5);
  for (let d of chartData.data) {
    let _d = {
      type: d.type,
      label: d.category,
      data: d.data,
      borderColor: d.borderColor || COLORS[index + 1],
      pointBackgroundColor: "white",
      borderWidth: 1,
      pointBorderColor: "#FC2525",
      backgroundColor:
        d.type === "line"
          ? d.bg || COLORS[index + 1]
          : d.bg || getGradient(COLORS[index + 1]),
      //fill: d.fill,
      tension: 0.3,
      hoverOffset: 4,
      fill: d.fill
        ? {
            target: "origin",
            above: getGradient(COLORS[index + 1]), // Area will be red above the origin
            below: COLORS[index + 1], // And blue below the origin
          }
        : false,
    };
    index++;
    _dataSet.push(_d);
  }*/
  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets,
  };
  if (mixedChart) mixedChart.destroy();
  const scales = chartData.rightYAxis
    ? {
        /*y: {
        beginAtZero: true,
      },*/
        "left-y-axis": {
          type: "linear",
          position: "left",
          beginAtZero: true,
        },
        "right-y-axis": {
          type: "linear",
          position: "right",
          beginAtZero: true,
        },
      }
    : {
        y: {
          beginAtZero: true,
          stacked: chartData.stacked || true,
        },
        x: {
          stacked: chartData.stacked || true,
        },
      };
  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales,
    },
    //plugins: [plugin],
  };
  //console.log(config.data.datasets instanceof Array, config.data.datasets);
  mixedChart = new ChartJS(ctx, config);
  mixedChart.resize(500, 300);
}

onMounted(() => {
  setTimeout(() => {
    drawChart(props.dataSource);
  }, 1);
});
onBeforeMount(() => {
  if (mixedChart) mixedChart.destroy();
});
</script>
