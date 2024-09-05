<template>
  <div class="q-py-md q-px-sm">
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-3">
        <!--<MonthlyRevenue :collection="collection" />
        <InterQuarterRevenue :collection="collection" />-->
      </div>
    </div>
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-3"></div>
    </div>
    <div
      class="row"
      :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-md'"
    >
      <div class="col col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <BarChartViewer
          :data="lineChartData"
          :vertical="true"
          name="LineChart"
          :title="year - 2 + ' - ' + year"
          :download="true"
        />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <PieChartViewer
          :donut="true"
          :data="interQuarterData"
          name="DonutChart"
          :title="'Q1 - 4 ' + year"
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <PieChartViewer
          :data="lastQuarterData"
          name="PieChart"
          :title="'Q4 ' + year"
        />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
        <LineChartViewer
          :data="YearData"
          name="LineChart"
          :title="'Jan - Dec ' + year"
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <BarChartViewer
          :data="barChartData"
          :vertical="true"
          name="LineChart"
          title="Last three months"
          :download="true"
        />
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <LineChartViewer
          :area="true"
          :data="barChartData0"
          name="Chart"
          title="Area chart"
        />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-6">
        <BarChartViewer
          :data="YearData"
          name="JanDecBarChart"
          :title="'Jan - Dec ' + year"
          :vertical="true"
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
</template>

<script setup>
import { watch, computed } from "vue";
//import MonthlyRevenue from "../billboard-chart/MonthlyRevenue.vue";
//import InterQuarterRevenue from "../billboard-chart/InterQuarterRevenue.vue";
import LineChartViewer from "./LineChartViewer.vue";
import PieChartViewer from "./PieChartViewer.vue";
import BarChartViewer from "./BarChartViewer.vue";
//import GoogleGeoViewer from "./GoogleGeoViewer.vue";
//import { computed, ref, onMounted, watch } from "vue";
//import GoogleMapViewer from "./GoogleMapViewer.vue";
import {
  lastQuarterData,
  lineChartData,
  barChartData,
  barChartData0,
  YearData,
  interQuarterData,
  useDashboardData,
} from "./dashboard-data";
import { useRoute } from "vue-router";
import {
  getAggregateFromServer,
  getCountFromServer,
  collection,
  sum,
  average,
  count,
  where,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "src/composables/firebase";
const route = useRoute();
const year = computed(() => new Date().getFullYear());
/*const collection = computed(() =>
  route.path.substring(1, route.path.length - 1)
);*/
watch(
  () => route.fullPath,
  (p) => {
    if (p) useDashboardData();
  },
  { immediate: true }
);
async function init() {
  const coll = collection(firestore, "Mails");
  const locations = ["Lagos", "Asaba", "Abuja", "Kaduna"];
  const promises = [];
  for (let loc of locations) {
    const q = query(coll, where("Location", "==", loc), orderBy("Location"));
    const snapshot = getAggregateFromServer(q, {
      count: count(),
      //sum: sum("Amount"),
      //average: average("Amount"),
    });
    promises.push(snapshot);
  }
  const results = await Promise.all(promises);
  let i = 0;
  for (let p of results) {
    console.log(locations[i], p.data());
    i++;
  }
}
init();

//import ScatterChartViewer from "./ScatterChartViewer.vue";
//import PieChart3DhartViewer from "./PieChart3DViewer.vue";
//import LocationForm from "../forms/LocationForm.vue";
//import StreetViewer from "./StreetViewer.vue";
//import AnalogClock from "../AnalogClock.vue";
//import { useDefaultStore } from "src/stores/store";
//const store = useDefaultStore();
/*const geoChartOptions = {
  chart: {
    title: "Company Performance",
    subtitle: "Sales, Expenses, and Profit: 2014-2017",
  },
  region: "NG",
  displayMode: "text",
  //colorAxis: { colors: ["#00853f", "black", "#e31b23"] },
  backgroundColor: "#81d4fa",
  datalessRegionColor: "#efefef",
  defaultColor: "#f5f5f5",
  showTooltip: true,
  showInfoWindow: true,
  useMapTypeControl: true,
  icons: {
    default: {
      normal:
        "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Chartreuse-icon.png",
      selected:
        "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Right-Chartreuse-icon.png",
    },
  },
  maps: {
    styledMap: {
      name: "Styled",
      styles: [
        { featureType: "poi.attraction", stylers: [{ color: "#fce8b2" }] },
        {
          featureType: "road.highway",
          stylers: [{ hue: "#0277bd" }, { saturation: -50 }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.icon",
          stylers: [{ hue: "#000" }, { saturation: 100 }, { lightness: 50 }],
        },
        {
          featureType: "landscape",
          stylers: [{ hue: "#259b24" }, { saturation: 10 }, { lightness: -22 }],
        },
      ],
    },
  },
};

//
onMounted(async () => {
  // Load the Visualization API and the corechart package.
  google.charts.load("current", { packages: ["corechart"] });

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Topping");
    data.addColumn("number", "Slices");
    data.addRows([
      ["Mushrooms", 3],
      ["Onions", 1],
      ["Olives", 1],
      ["Zucchini", 1],
      ["Pepperoni", 2],
    ]);

    // Set chart options
    var options = {
      title: "How Much Pizza I Ate Last Night",
      width: 400,
      height: 300,
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById("google_chart_div")
    );
    chart.draw(data, options);
  }
});*/
</script>

<script type="text/javascript"></script>
<style>
@import "billboard.js/dist/billboard.css";
</style>
