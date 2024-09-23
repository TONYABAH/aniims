<template>
  <q-card flat square class="fit bg-transparent">
    <q-card-section>
      <q-btn
        disable=""
        flat
        color=""
        :icon="icon"
        :label="title"
        class="text-bold q-mb-sm"
      />
      <q-list>
        <q-item
          style="font-variant: small-caps"
          v-for="(item, i) of items"
          :key="i"
        >
          <q-item-section style="padding: 0">
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label lines="2"
              ><span>{{ item.value }}</span></q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script setup>
defineProps({
  icon: String,
  title: String,
  items: Array,
});
</script>
