<template>
  <div id="map"></div>
  <div id="pano"></div>
</template>

<script setup>
import { onMounted } from "vue";
function initialize() {
  const fenway = { lat: 4.345573, lng: 5.098326 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: fenway,
    zoom: 14,
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  );

  map.setStreetView(panorama);
}

//window.initialize = initialize;
onMounted(() => initialize());
</script>
