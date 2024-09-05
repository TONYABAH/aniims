<template>
  <canvas class="bg-" :id="id"></canvas>
  <!--<Bar :data="data" :options="options" />-->
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const id = "_" + Math.random().toString(16).substring(3);
function drawChart() {
  const ctx = document.getElementById(id);
  const data = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        type: "bar",
        label: "Complaints",
        data: [10, 20, 30, 40],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        type: "line",
        label: "Raids",
        data: [10, 20, 40, 30],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.3,
      },
    ],
  };
  const mixedChart = new ChartJS(ctx, {
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
  });
}

//const options = chartConfig.options
/*options = {
  responsive: true,
  maintainAspectRatio: false
}*/
/**
 * randomdata = {
  labels: [
    'January' + getRandomInt(),
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [
        getRandomInt(),
      ]
    }
  ]
})
 */
onMounted(() => {
  setInterval(() => {
    drawChart();
  }, 3000);
});
onBeforeMount(() => {});
</script>
