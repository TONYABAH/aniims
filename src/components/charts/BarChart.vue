<template>
  <Bar :data="data" :options="options" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
} from "chart.js";
import { Bar } from "vue-chartjs";
import * as chartConfig from "./chartConfig.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

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
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt()
      ]
    }
  ]
})
 */
//const data = ref<ChartData<'bar'>>({datasets: []})
props = defineProps({
  options,
  data,
});
onMounted(() => {
  setInterval(() => {
    //data.value = chartConfig.randomData();
  }, 3000);
});
</script>
