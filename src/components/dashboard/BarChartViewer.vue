<template>
  <ChartCard>
    <column-chart
      v-if="vertical"
      :name="name"
      :data="data"
      :title="title"
    ></column-chart>
    <bar-chart
      v-else
      :name="name"
      :data="data"
      :title="title"
    ></bar-chart>
  </ChartCard>
</template>

<script setup>
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import ChartCard from "./ChartCard.vue";
//import * as dashboard from "./dashboard";
const props = defineProps({
  name: String,
  title: String,
  data: Array,
  vertical: Boolean,
  is3D: Boolean,
});
</script>
