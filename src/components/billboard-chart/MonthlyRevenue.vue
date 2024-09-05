<template>
  <div id="monthly_revenue"></div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  bb,
  area,
  areaLineRange,
  areaSpline,
  areaSplineRange,
  areaStep,
  bar,
  bubble,
  donut,
  gauge,
  line,
  pie,
  radar,
  scatter,
  spline,
  step,
  // interaction modules
  selection,
  subchart,
  zoom,
} from "billboard.js";

import { getMonthlyData } from "../dashboard/accounts";
//import * as dashboard from "../dashboard/dashboard.js";
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
//import { firestore } from "src/composables/firebase";
//import { useDefaultStore } from "src/stores/store";
//const db = firestore;
//const store = useDefaultStore();

const props = defineProps({
  collection: String,
});
onMounted(async () => {
  let _data = [];

  var chart = bb.generate({
    data: {
      x: "Date",
      columns: [],
      type: spline(), // for ESM specify as: line()
      types: {
        data2: bar(),
        data3: area(),
      },
    },
    axis: {
      x: {
        type: "timeseries",
        tick: {
          format: "%m",
        },
      },
    },
    bindto: "#monthly_revenue",
  });
  await getMonthlyData(2024, props.collection, _data);
  //console.log(_data);
  chart.load({
    columns: [
      ["Date", ..._data.map((d) => `2024-${d[0]}`)],
      [props.collection, ..._data.map((d) => d[1])],
      //["data2", ..._data.map((d) => d[1] * 10)],
      //["data3", ..._data.map((d) => d[1])],
    ],
  });
});
</script>
