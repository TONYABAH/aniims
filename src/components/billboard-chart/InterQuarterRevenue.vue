<template>
  <div id="interquarter_revenue"></div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import bb, {
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

import {
  getMonthlyData,
  getQuarterData,
  getQuarterlyData,
} from "../dashboard/accounts";
//import * as dashboard from "../dashboard/dashboard.js";
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
//import {collection,query,getDocsFromServer,where,getCountFromServer,} from "firebase/firestore";
//import { firestore } from "src/composables/firebase";
//import { useDefaultStore } from "src/stores/store";
//const db = firestore;
//const store = useDefaultStore();

const props = defineProps({
  collection: String,
  chartType: {
    type: String,
    default: "donut",
  },
});

onMounted(async () => {
  let _data = await getQuarterlyData(2024, props.collection);
  //console.log(_data);
  var chart = bb.generate({
    data: {
      columns: [
        ["Quarter 1", _data.data[0][1]],
        ["Quarter 2", _data.data[1][1]],
        ["Quarter 3", _data.data[2][1]],
        ["Quarter 4", _data.data[3][1]],
      ],

      type:
        props.chartType === "bar"
          ? bar()
          : props.chartType === "donut"
          ? donut()
          : pie(), // for ESM specify as: bar()
    },
    bindto: "#interquarter_revenue",
  });
});
</script>
<style>
@import "billboard.js/dist/billboard.css";
</style>
