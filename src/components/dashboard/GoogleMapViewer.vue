<template>
  <ChartCard>
    <div id="map_div"></div>
  </ChartCard>
</template>

<script setup>
import { onMounted } from "vue";
import ChartCard from "./ChartCard.vue";

const props = defineProps({
  name: String,
  title: String,
  data: Array,
});

google.charts.load("current", {
  packages: ["map"],
  mapsApiKey: "AIzaSyBISSc3EaCcch7wX9BxFdjtj6QMAe4xr6o",
});
google.charts.setOnLoadCallback(drawMap);

function drawMap() {
  var data = google.visualization.arrayToDataTable([
    ["Address", "Location"],
    ["Apapa, Lagos, Nigeria", "Apapa"],
    ...props.data,
  ]);
  var options = {
    //sizeAxis: { minValue: 0, maxValue: 100 },
    //colorAxis: { colors: ["#e7711c", "#4374e0"] }, // orange to blue
    showTooltip: true,
    showInfoWindow: true,
    useMapTypeControl: true,
    region: "NG",
    displayMode: "markers",
    //center: { lat: 8.397, lng: 15.644 },
    //zoom: 1,
    icons: {
      default: {
        normal:
          "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Chartreuse-icon.png",
        selected:
          "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Right-Chartreuse-icon.png",
      },
    },
  };
  var map = new google.visualization.Map(document.getElementById("map_div"));

  map.draw(data, options);
}

onMounted(() => {});
</script>
