<template>
  <div class="row">
    <div class="col col-xs-12 col-sm-6 col-md-6">
      <DateInput :onDateChange="onUpdateStartDateModel" :date="startDate" />
    </div>
    <div class="col col-xs-12 col-sm-6 col-md-6" v-if="!hideEndDate">
      <DateInput :onDateChange="onUpdateEndDateModel" :date="endDate" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import DateInput from "./__DateInput.vue";
const date = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
})
const date0 = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/01`
})
const startDate = ref(date0)
const endDate = ref(date)
const props = defineProps({
  hideEndDate: {
    type: Boolean,
    default: false,
  }
})
const emits = defineEmits([
  "end-date-change", "start-date-change"
])
function onUpdateEndDateModel(d) {
  emits("end-date-change", d)
  //endDateRef.value?.hide()
}
function onUpdateStartDateModel(d) {
  emits("start-date-change", d)
  //startDateRef.value?.hide()
}
defineExpose({
  startDate, endDate
})
onMounted(() => {
  onUpdateStartDateModel();
  onUpdateEndDateModel();
})
</script>
