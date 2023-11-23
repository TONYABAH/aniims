<template>
  <ChartCard>
    <GChart
      :type="type"
      :data="data"
      :options="options"
      :settings="{
        packages: ['corechart', 'table', 'map', 'geochart'],
        mapsApiKey: 'AIzaSyBISSc3EaCcch7wX9BxFdjtj6QMAe4xr6o',
      }"
      @ready="onChartReady"
    />
  </ChartCard>
</template>

<script setup>
//const id = "geo__" + Math.random().toString(32).substring(2);
import { GChart } from "vue-google-charts";
import ChartCard from "./ChartCard.vue";

const props = defineProps({
  type: {
    type: String,
    default: "Map",
  },
  data: {
    type: Array,
  },
  options: {
    type: Object,
    default: () => ({
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
    }),
  },
});
async function onChartReady(chart, google) {
  //const {Geocoder} = await google.maps.importLibrary("geocoding").
  //const query = new google.visualization.Query("https://url-to-spreadsheet...");
  /*query.send((response) => {
    const options = {
      // some custom options
    };
    const data = response.getDataTable();
    chart.draw(data, options);
  });*/
  /*const { map } = google;
  console.log(chart, map, google);
  setTimeout(() => {

  });*/
}
</script>
