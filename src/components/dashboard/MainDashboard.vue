<template>
  <q-layout
    view="hHr LpR lFf"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-orange-1'"
  >
    <DefaultHeader />
    <DefaultFooter />
    <q-drawer
      side="left"
      v-model="drawerLeft"
      bordered
      :width="200"
      :breakpoint="500"
      content-class="bg-grey-3"
    >
    </q-drawer>
    <q-page-container>
      <q-page padding>
        <q-toolbar class="bg- text-bold text-shadow">
          <q-btn flat round dense icon="analytics" />
          <q-toolbar-title> Dashboard </q-toolbar-title>
        </q-toolbar>
        <div class="q-py-md q-px-sm">
          <div
            class="row dashboard"
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-xs'"
          >
            <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
              <QuantityChart
                :options="{}"
                dataSource="Mails"
                :get-data="getActivityData"
              />
            </div>
            <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
              <QuantityChart
                :options="{}"
                dataSource="Raids"
                :get-data="getActivityData"
              />
            </div>
          </div>
          <div
            class="row dashboard"
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-xs'"
          >
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <QuantityChart
                :options="{}"
                dataSource="Complaints"
                :get-data="getActivityData"
              />
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <QuantityChart
                :options="{}"
                dataSource="Cases"
                :get-data="getActivityData"
              />
            </div>

            <div class="col col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <PieChart data-source="Samples" />
            </div>
          </div>
          <div
            class="row dashboard"
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-xs'"
          >
            <div class="col col-xs-12 col-sm-12 col-md-12 col-lg-8">
              <QuantityChart
                :options="{}"
                dataSource="Revenue"
                :get-data="getRevenueData"
              />
            </div>
          </div>
          <div
            class="row dashboard"
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-xs'"
          >
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <QuantityChart
                :options="{}"
                dataSource="Detentions"
                :get-data="getSuspectData"
                :fill="true"
              />
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <QuantityChart
                :options="{}"
                dataSource="Destruction"
                :get-data="getDestuctionData"
              />
            </div>
          </div>
          <div
            class="row dashboard"
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-xs'"
          >
            <div class="col col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <PieChart
                :options="{}"
                chartType="pie"
                dataSource="Destructions"
              />
            </div>
            <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-8">
              <QuantityChart
                :options="{}"
                dataSource="Destructions"
                :get-data="getDrugDestuctionData"
              />
            </div>

            <!--<div class="col col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <GoogleMapViewer
          :data="geoData"
          :options="geoChartOptions"
          name="GoogleMap"
          title="Google Map"
        />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
        <GoogleGeoViewer :options="geoChartOptions" :data="geoData" />
      </div>-->
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import DefaultHeader from "src/layouts/DefaultHeader.vue";
import DefaultFooter from "src/layouts/DefaultFooter.vue";
import PieChart from "../charts/PieChart.vue";
import QuantityChart from "../charts/QuantityChart.vue";
import { COLORS, hexToRGBA } from "../charts/colors";
//import BarChart from "../charts/BarChart.vue";
//import * as dashboard from "./dashboard";
//import { useDefaultStore } from "src/stores/store";
//const store = useDefaultStore();
//import MixedChart from "../charts/MixedChart.vue";
// Load the Visualization API and the corechart package.
//import ScatterChartViewer from "./ScatterChartViewer.vue";
//import PieChart3DhartViewer from "./PieChart3DViewer.vue";
//import LocationForm from "../forms/LocationForm.vue";
//import StreetViewer from "./StreetViewer.vue";
//import AnalogClock from "../AnalogClock.vue";

const drawerLeft = ref(false);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

function getRevenueData() {
  return {
    //rightYAxis: true,
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
        label: "Revenue",
        type: "line",
        data: [45, 60, 75, 67, 90, 80, 45, 60, 75, 67, 90, 80].map(
          (d) => d * 100000 * 1.5
        ),
        borderColor: "teal",
        backgroundColor: "teal",
        fill: false,
        tension: 0.2,
        borderWidth: 1,
      },
      {
        label: "Admin charges",
        type: "bar",
        data: [45, 60, 75, 67, 90, 80, 45, 60, 75, 67, 90, 80].map(
          (d) => d * 100000
        ),
        fill: false,
        borderWidth: 1,
        borderColor: "#0000FF",
        backgroundColor: "#1976d2",
      },

      {
        label: "Lab charges",
        type: "bar",
        data: [75, 67, 90, 80, 75, 67, 90, 80, 45, 60, 45, 60].map(
          (d) => d * 100000
        ),
        fill: false,
        borderWidth: 1,
        borderColor: "#FF0000",
        backgroundColor: "#FFB1C1",
      },
    ],
  };
}
function getSuspectData() {
  return {
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
        label: "Detentions",
        type: "line",
        data: [5, 7, 9, 8, 5, 7, 9, 8, 4, 6, 4, 6],

        fill: true,
        tension: 0.2,
        borderWidth: 1,
      },
      {
        label: "Suspects",
        type: "line",
        data: [15, 16, 27, 37, 19, 18, 15, 6, 15, 27, 9, 8],
        fill: true,
        tension: 0.2,
        borderWidth: 1,
      },
    ],
  };
}
function getDestuctionData() {
  return {
    rightYAxis: true,
    labels: ["Food", "Drugs", "Cosmetics", "Devices", "Chemicals", "Drinks"],
    datasets: [
      {
        label: "Market Value (1000N)",
        type: "line",
        data: [75, 67, 90, 60, 55, 78].map((d) => d * 1000),
        fill: false,
        borderWidth: 1,
        borderColor: "#FF0000",
        backgroundColor: "#FFB1C1",
        yAxisID: "right-y-axis",
        label: "Market Value (x 1000N)",
        tension: 0.2,
      },
      {
        label: "Quantity (MT)",
        type: "bar",
        data: [75, 67, 90, 40, 75, 67].map((d) => d * 10),
        fill: false,
        borderWidth: 1,
        borderColor: "#0000FF",
        backgroundColor: hexToRGBA(COLORS[2], 0.9),
        yAxisID: "left-y-axis",
        label: "Quantity (MT)",
      },
    ],
  };
}
function getDrugDestuctionData() {
  return {
    rightYAxis: true,
    labels: [
      "Narcotics",
      "Analgesic",
      "Depressant",
      "Hallucinogen",
      "Stimulant",
      "Opioid",
      "Steroid",
      "Antimalaria",
      "Antibiotics",
      "Anticancer",
      "Lifestyle",
      "Others",
    ],
    datasets: [
      {
        label: "Market Value (x 1000N)",
        type: "line",
        data: [75, 89, 90, 60, 55, 78, 40, 34, 25, 40, 50, 70].map(
          (d) => d * 1000
        ),
        fill: false,
        borderWidth: 1,
        borderColor: "#FF0000",
        backgroundColor: "#FFB1C1",
        yAxisID: "right-y-axis",
        label: "Market Value (x 1000N)",
        tension: 0.2,
      },
      {
        label: "Products (MT)",
        type: "bar",
        data: [75, 67, 90, 40, 75, 67, 40, 60, 24, 27, 33, 28].map(
          (d) => d * 10
        ),
        fill: false,
        borderWidth: 1,
        borderColor: "teal",
        backgroundColor: hexToRGBA(COLORS[3], 0.9),
        yAxisID: "left-y-axis",
        label: "Quantity",
      },
    ],
  };
}
function getActivityData() {
  return {
    labels: ["January", "February", "March"],
    datasets: [
      /*{
        label: "Total",
        type: "line",
        data: [15, 16, 18].map((d) => d * 50),
      },*/
      {
        label: "Abuja",
        type: "bar",
        data: [25, 60, 45].map((d) => d * Math.random() * 100),
        borderWidth: 1,
        backgroundColor: COLORS[4],
      },
      {
        label: "Asaba",
        type: "bar",
        data: [25, 60, 45].map((d) => d * Math.random() * 100),
        borderWidth: 1,
        backgroundColor: COLORS[1],
      },
      {
        label: "Kaduna",
        type: "bar",
        data: [25, 60, 45].map((d) => d * Math.random() * 100),
        borderWidth: 1,
        backgroundColor: COLORS[2],
      },
      {
        label: "Lagos",
        type: "bar",
        data: [25, 60, 45].map((d) => d * Math.random() * 100),
        borderWidth: 1,
        backgroundColor: COLORS[3],
      },
    ],
  };
}
onMounted(() => {
  //const year = computed(() => new Date().getFullYear());
  //google.charts.load("current", { packages: ["corechart"] });
  // Set a callback to run when the Google Visualization API is loaded.
  //google.charts.setOnLoadCallback(drawChart);
});
</script>

<style type="scss">
.dashboard .q-card {
  min-height: 70vh;
}
.dashboard .col {
  /*box-shadow: 1px 1px 1px 1px #777;*/
  margin-bottom: 8px;
}
/*.dashboard .q-card :hover {
  height: 105%;
  width: 105%;
}*/
.green-bg {
  background: orange;
}
</style>
../charts/PieChart.vue
