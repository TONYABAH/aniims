<template>
  <div class="q-py-md q-px-sm">
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
      <!-- <div class="col col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <LineChartViewer
          :area="true"
          :data="barChartData"
          name="AreaChart"
          title="Area chart"
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
          :data="barChartData"
          name="BarChart"
          title="Bar chart"
          :vertical="true"
        />
      </div>-->
      <!-- <div class="col col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
import LineChartViewer from "./LineChartViewer.vue";
import PieChartViewer from "./PieChartViewer.vue";
import BarChartViewer from "./BarChartViewer.vue";
//import GoogleGeoViewer from "./GoogleGeoViewer.vue";
import { computed, ref, onMounted, watch } from "vue";
//import GoogleMapViewer from "./GoogleMapViewer.vue";
import {
  lastQuarterData,
  lineChartData,
  barChartData,
  barChartData0,
  YearData,
  interQuarterData,
  useDashboardData,
} from "src/components/dashboard/dashboard-data";
//import ScatterChartViewer from "./ScatterChartViewer.vue";
//import PieChart3DhartViewer from "./PieChart3DViewer.vue";
//import LocationForm from "../forms/LocationForm.vue";
//import StreetViewer from "./StreetViewer.vue";
//import AnalogClock from "../AnalogClock.vue";
//import { useDefaultStore } from "src/stores/store";
//const store = useDefaultStore();
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
useDashboardData();
const year = computed(() => new Date().getFullYear());
onMounted(async () => {});
</script>
