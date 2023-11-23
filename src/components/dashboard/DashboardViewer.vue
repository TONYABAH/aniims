<template>
  <div>
    <div class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <!--<AnalogClock class="q-pl-xl" />-->
        <LocationForm />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
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
        <GoogleGeoViewer :options="geoChartOptions" :data="geoData" />
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
        <!--<GoogleMapViewer
            :data="geoData"
            name="GoogleMap"
            title="Google Map"
          />-->
      </div>
    </div>
  </div>
</template>

<script setup>
import LineChartViewer from "./LineChartViewer.vue";
import PieChartViewer from "./PieChartViewer.vue";
import ScatterChartViewer from "./ScatterChartViewer.vue";
import BarChartViewer from "./BarChartViewer.vue";
import PieChart3DhartViewer from "./PieChart3DViewer.vue";
//import GoogleMapViewer from "./GoogleMapViewer.vue";
import GoogleGeoViewer from "./GoogleGeoViewer.vue";
import AnalogClock from "../AnalogClock.vue";
//import StreetViewer from "./StreetViewer.vue";
import { onMounted } from "vue";
import LocationForm from "../forms/LocationForm.vue";
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
const geoData = [
  ["Shomolu, Lagos, Nigeria", "Shomolu"],
  ["Ketu, Lagos, Nigeria", "Ketu"],
  ["Ilaje, Lagos, Nigeria", "Ilaje"],
  ["Ladilak", "Ladilak"],
  ["Palmgrove, Lagos, Nigeria", "Palmgrove"],
  ["Ikeja, Lagos", "Ikeja"],
  ["36 Adeshina Street, Ladilak, Bariga, Lagos", "Adeshina"],
  //["Kaduna, Kaduna", "Kaduna"],
  //["Asaba, Delta", "Asaba"],
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
function logData() {
  console.log(new Date());
  window.requestAnimationFrame(logData);
}
//window.requestAnimationFrame(logData);
onMounted(() => {});
</script>
