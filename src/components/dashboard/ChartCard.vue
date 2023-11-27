<template>
  <q-card :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'shadow-8'">
    <q-bar class="bg-transparent">
      <q-toolbar-title></q-toolbar-title>
      <q-btn flat dense icon="fullscreen" @click="zoomChart" />
    </q-bar>
    <q-card-section class="chart">
      <slot></slot>
    </q-card-section>
  </q-card>

  <q-dialog full-width v-model="zoom" persistent="">
    <q-card flat class="full-">
      <q-bar class="bg-transparent">
        <q-toolbar-title> {{ dialogTitle }}</q-toolbar-title>
        <q-btn flat dense icon="close" color="negative" @click="cancelZoom" />
      </q-bar>
      <q-card-section ref="dialogChartContainer"> </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, inject, provide, watch } from "vue";
//import AnimateOnScroll from "src/components/AnimateOnScroll.vue";
//const chartref = ref(null);
const chartContainer = ref(null);
const dialogChartContainer = ref(null);
const dialogTitle = ref("");
const zoom = ref(false);

function cancelZoom(e) {
  const copy = dialogChartContainer.value.$el;
  const card = chartContainer.value;
  //const copy = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling;
  zoom.value = false;
  card.replaceChild(copy, card.firstElementChild.nextElementSibling);
}
function zoomChart(e) {
  zoom.value = true;
  const card = e.target.parentElement.parentElement.parentElement.parentElement;
  setTimeout(() => {
    const el = dialogChartContainer.value.$el;
    const copy = card.firstElementChild.nextSibling;
    dialogTitle.value = card.firstElementChild.firstElementChild.textContent;
    el.appendChild(copy.firstElementChild);
    chartContainer.value = card;
  }, 100);
}
</script>
