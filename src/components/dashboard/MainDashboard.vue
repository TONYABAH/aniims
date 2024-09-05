<template>
  <q-layout view="hHr LpR lFf">
    <!--<q-header v-model="header" reveal elevated bordered>

    </q-header>-->
    <DefaultHeader />

    <q-footer v-model="footer" reveal elevated bordered>
      <q-toolbar class="bg-purple text-white">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title> Footer </q-toolbar-title>
        <q-btn flat round dense icon="apps" class="q-mr-xs" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </q-footer>
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
            :class="$q.screen.lt.sm ? 'q-col-gutter-xs' : 'q-col-gutter-md'"
          >
            <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-4">
              <div id="google_chart_div">
                <q-card class="my-card">
                  <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                  <q-card-section>
                    <div class="text-h6">Mails</div>
                  </q-card-section>
                  <q-card-section>
                    <BarChart :options="{}" />
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-4">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Raids</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Surveillances</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Samples</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Accounts</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <q-card class="my-card full-height">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Complaints</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-8 col-lg-4">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Destructions</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-8 col-lg-4">
              <q-card class="my-card full-height">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Detentions</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <q-card class="my-card">
                <!--<img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
                <q-card-section>
                  <div class="text-h6">Cases</div>
                </q-card-section>
                <q-card-section> </q-card-section>
              </q-card>
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
import * as dashboard from "./dashboard";
import DefaultHeader from "src/layouts/DefaultHeader.vue";
import BarChart from "../charts/BarChart.vue";
// Load the Visualization API and the corechart package.
//import ScatterChartViewer from "./ScatterChartViewer.vue";
//import PieChart3DhartViewer from "./PieChart3DViewer.vue";
//import LocationForm from "../forms/LocationForm.vue";
//import StreetViewer from "./StreetViewer.vue";
//import AnalogClock from "../AnalogClock.vue";
//import { useDefaultStore } from "src/stores/store";
//const store = useDefaultStore();
const header = ref(true);
const footer = ref(true);
const drawerLeft = ref(false);

const geoChartOptions = {
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

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  // Create the data table.
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.AreaChart(
    document.getElementById("google_chart_div")
  );
  var data = new google.visualization.DataTable();

  // Set chart options
  var options = {
    title: "How Much Pizza I Ate Last Night",
    // width: 400,
    // height: 300,
    curveType: "function",
    legend: { position: "bottom" },
  };
  dashboard.getMonthlyData(2024, "Mails", []).then((_data) => {
    console.log(_data);
    data.addColumn("string", "");
    data.addColumn("number", "");
    data.addRows([..._data.map((d) => ["2024-" + d[0].toString(), d[1]])]);
    chart.draw(data, options);
  });
}
onMounted(() => {
  const year = computed(() => new Date().getFullYear());
  google.charts.load("current", { packages: ["corechart"] });
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
});
</script>

<style>
.dashboard .q-card {
  min-height: 50vh;
}
.dashboard .col {
  /*box-shadow: 1px 1px 1px 1px #777;*/
  margin-bottom: 8px;
}
</style>
