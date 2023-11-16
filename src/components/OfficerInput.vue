<template>
  <q-input dense filled readonly="" dark color="white" v-model="officer.name" type="text" label="Officer">
    <q-menu dense dark>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup v-for="(s, i) of officers" :key="i" @click="onStaffChange(s)">
          <q-item-section>{{ s.Name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <template v-slot:append>
      <q-icon name="arrow_right" />
    </template>
  </q-input>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { computed, onMounted, ref, watch } from 'vue';
const officer = ref({ name: "Select" })
const officers = ref([])
const emits = defineEmits([
  "officer-change", "officers-loaded"
])
const props = defineProps({
  unit: Object
})

const unit = computed(() => props.unit)

watch(unit, (u) => {
  loadstaff(u)
})

async function loadstaff(u) {
  const t = Date.now()
  var path = `staff/?t=${t}`
  if (u?.id) {
    path += '&u=' + u.id
  }
  officers.value = [{ name: "Select" }]
  officer.value = { name: "Select" }
  const res = await api.get(path)
  if (res.status === 200 && res.data.length > 0) {
    officers.value.push(...res.data)
    onStaffsLoaded(res.data)
  }
}

function onStaffChange(s) {
  officer.value = s
  emits("officer-change", s)
}
function onStaffsLoaded(s) {
  emits("officers-loaded", s)
}
onMounted(async () => {
  Promise.all([loadstaff()])
})
</script>
