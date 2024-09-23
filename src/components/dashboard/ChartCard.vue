<template>
  <q-card
    :flat="$q.dark.isActive"
    :class="$q.dark.isActive ? 'bg-grey-4' : 'shadow-1'"
  >
    <q-bar
      class="bg-transparent"
      :class="$q.dark.isActive ? 'text-grey-10' : ''"
    >
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <q-btn flat dense icon="fullscreen" @click="zoomChart" />
    </q-bar>
    <q-card-section class="chart">
      <slot></slot>
    </q-card-section>
    <q-dialog :maximized="$q.screen.lt.sm" v-model="zoom" persistent="">
      <q-card flat class="no-scroll bg-grey-2" :class="$q.screen.gt.xs ? '' : ''">
        <q-bar class="bg-transparent">
          <q-toolbar-title> {{ dialogTitle }}</q-toolbar-title>
          <q-btn flat dense icon="close" color="negative" @click="cancelZoom" />
        </q-bar>
        <q-card-section ref="dialogChartContainer"> </q-card-section>
        <q-card-section> </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
//import AnimateOnScroll from "src/components/AnimateOnScroll.vue";
const props = defineProps({
  title: {
    type: String,
    default: "Chart",
  },
  onZoom: Function,
});
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
    setTimeout(() => {
      props.onZoom();
    }, 0);
  }, 100);
}
</script>
