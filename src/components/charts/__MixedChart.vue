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

const canvassRef = ref(null);
const id = "_" + Math.random().toString(16).substring(3);
var mixedChart = null;
const props = defineProps({
  dataSource: {
    type: String,
    default: "Meta",
  },
});

function drawChart(dataSource) {
  const gradient = canvassRef.value
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 450);
  const gradient2 = canvassRef.value
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 450);
  /*gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
  gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");*/

  gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
  gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
  gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

  const ctx = document.getElementById(id);
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        type: "line",
        label: "Admin charges",
        data: [45, 60, 75, 67, 90, 80, 45, 60, 75, 67, 90, 80].map(
          (d) => d * 100000
        ),
        fill: false,
        borderColor: "#FC2525",
        pointBackgroundColor: "white",
        borderWidth: 1,
        pointBorderColor: "FC2525",
        backgroundColor: "orange",
        tension: 0.3,
        hoverOffset: 4,
      },
      {
        type: "line",
        label: "Lab charges",
        data: [75, 67, 90, 80, 75, 67, 90, 80, 45, 60, 45, 60].map(
          (d) => d * 100000
        ),
        fill: false,
        borderColor: "blue",
        pointBackgroundColor: "white",
        borderWidth: 1,
        pointBorderColor: "blue",
        backgroundColor: "blue",
        tension: 0.3,
        hoverOffset: 4,
      },
      {
        type: "bar",
        label: "Revenue",
        data: [45, 60, 75, 67, 90, 80, 45, 60, 75, 67, 90, 80].map(
          (d) => d * 100000 * 1.5
        ),
        fill: false,
        borderColor: "grey",
        pointBackgroundColor: "white",
        borderWidth: 1,
        backgroundColor: gradient2,
        tension: 0.3,
        hoverOffset: 4,
      },
    ],
  };
  if (mixedChart) mixedChart.destroy();
  mixedChart = new ChartJS(ctx, {
    type: "line",
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
    drawChart(props.dataSource);
  }, 1);
});
onBeforeMount(() => {
  if (mixedChart) mixedChart.destroy();
});
</script>
