<template>
  <ChartCard>
    <area-chart
      v-if="area"
      :name="name"
      :data="data"
      :title="title"
       :download="true"
    ></area-chart>
    <line-chart
      v-else
      :name="name"
      :data="data"
      :title="title"
       :download="true"
    ></line-chart>
  </ChartCard>
</template>

<script setup>
//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import ChartCard from "./ChartCard.vue";
const props = defineProps({
  name: String,
  title: String,
  data: Array,
  area: Boolean,
});
</script>
