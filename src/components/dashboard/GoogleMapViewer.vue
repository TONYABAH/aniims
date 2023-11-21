<template>
  <ChartCard>
    <div :id="id"></div>
  </ChartCard>
</template>

<script setup>
import { onMounted } from "vue";
import ChartCard from "./ChartCard.vue";

const id = "map__" + Math.random().toString(32).substring(2);
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
    ...props.data,
  ]);
  var options = {
    showTooltip: true,
    showInfoWindow: true,
    useMapTypeControl: true,
    region: "NG",
    displayMode: "markers",
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
