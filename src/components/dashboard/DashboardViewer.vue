<template>
  <q-card flat class="my-card">
    <div>
      <div class="row q-col-gutter-md">
        <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <LineChartViewer
            :data="lineChartData"
            name="LineChart"
            title="Line chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <PieChartViewer
            :data="pieChartData"
            name="PieChart"
            title="Pie chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <PieChartViewer
            :donut="true"
            :data="pieChartData"
            name="DonutChart"
            title="Donut chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
          <PieChart3DhartViewer
            :data="pieChartData"
            name="PieChart"
            title="Pie chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <LineChartViewer
            :area="true"
            :data="lineChartData"
            name="AreaChart"
            title="Area chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <LineChartViewer
            :area="true"
            :data="lineChartData"
            name="Chart"
            title="Area chart"
          />
        </div>
        <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
          <BarChartViewer
            :data="chartdata"
            name="BarChart"
            title="Bar chart"
            :vertical="true"
          />
        </div>
        <div class="col col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <GoogleMapViewer
            :data="geoData"
            name="GoogleMap"
            title="Google Map"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import LineChartViewer from "./LineChartViewer.vue";
import PieChartViewer from "./PieChartViewer.vue";
import ScatterChartViewer from "./ScatterChartViewer.vue";
import BarChartViewer from "./BarChartViewer.vue";
import PieChart3DhartViewer from "./PieChart3DViewer.vue";
import GoogleMapViewer from "./GoogleMapViewer.vue";
//import StreetViewer from "./StreetViewer.vue";

const geoData = [
  ["Shomolu, Lagos, Nigeria", "Shomolu"],
  ["Ketu, Lagos, Nigeria", "Ketu"],
  ["Ilaje, Lagos, Nigeria", "Ilaje"],
  ["Ladilak", "Ladilak"],
  ["Palmgrove, Lagos, Nigeria", "Palmgrove"],
  ["Ikeja", "Ikeja"],
  ["36 Adeshina Street, Ladilak, Bariga, Lagos", "Adeshina"],
  ["Kaduna, Kaduna", "Kaduna"],
  ["Asaba, Delta", "Asaba"],
];
const pieChartData = [
  ["Food", 44],
  ["Drugs", 20],
  ["Drinks", 26],
  ["Water", 10],
];
const lineChartData = [
  {
    name: "Food",
    data: {
      "2017-01-01": 3,
      "2017-01-02": 4,
      "2017-01-03": 7,
      "2017-01-04": 10,
      "2017-01-05": 3,
      "2017-01-06": 4,
    },
  },
  {
    name: "Water",
    data: {
      "2017-01-01": 13,
      "2017-01-02": 9,
      "2017-01-03": 4,
      "2017-01-04": 10,
      "2017-01-05": 5,
      "2017-01-06": 4,
    },
  },
];
const chartdata = [
  {
    name: "Admin charge",
    data: {
      "2017-01-01": 2,
      "2017-01-02": 5,
      "2017-01-03": 7,
      "2017-01-04": 15,
      "2017-01-05": 12,
      "2017-01-06": 5,
      "2017-01-07": 2,
      "2017-01-08": 0,
    },
  },
  {
    name: "Lab fee",
    data: {
      "2017-01-01": 8,
      "2017-01-02": 7,
      "2017-01-03": 7,
      "2017-01-04": 5,
      "2017-01-05": 12,
      "2017-01-06": 15,
      "2017-01-07": 12,
      "2017-01-08": 10,
    },
  },
];
</script>
