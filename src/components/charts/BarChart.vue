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
const id = "_" + Math.random().toString(16).substring(3);
var mixedChart = null
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

function drawChart() {

  const ctx = document.getElementById(id);
  const data = {
    labels: ["January", "February", "March", "April"],

    datasets: [
      {
        type: "line",
        label: "Raids",
        data: [10, 20, 40, 30],
        fill: false,
       // borderColor: "rgb(54, 162, 235)",
        borderColor: 'rgb(54, 162, 25)',
        backgroundColor:'rgb(54, 162, 25)',
        tension: 0.3,
        hoverOffset: 4
      },
      {
        type: "bar",
        label: "Complaints",
        data: [10, 20, 30, 40],
        borderColor: "rgb(255, 99, 132)",
        //backgroundColor: "rgba(255, 99, 132, 0.2)",
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      },

    ],
  };
  const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };
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
      plugins: {
        customCanvasBackgroundColor: {
          color: '',
        }
      }
    },
    //plugins: [plugin],
  });
}

onMounted(() => {
  setTimeout(() => {
    if(mixedChart)mixedChart.destroy()
    drawChart();
    mixedChart.resize(0, 300);
  }, 1);
});
onBeforeMount(() => {
  if(mixedChart)mixedChart.destroy()
});
</script>
