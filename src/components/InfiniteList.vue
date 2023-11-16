<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" :offset="offset">
      <q-list bordered dense>
        <q-item
          clickable
          v-ripple
          v-for="(item, index) of items"
          :key="index"
          @click="clickHandler(item, index)"
        >
          <q-item-section thumbnail="">
            <q-icon :color="iconColor" :name="icon" class="q-ml-sm" />
          </q-item-section>
          <q-item-section>{{ item.Name }}</q-item-section>
        </q-item>
      </q-list>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import { ref } from "vue";
const items = ref([{}, {}, {}, {}, {}, {}, {}]);
const props = defineProps({
  icon: String,
  iconColor: {
    type: String,
    default: "primary",
  },
  loadFn: {
    type: Function,
    required: true,
  },
  clickHandler: {
    type: Function,
    required: true,
  },
  offset: {
    type: Number,
    default: 250,
  },
});
async function onLoad(index, done) {
  const _items = await props.loadFn(index);
  items.value.push(_items);
  done();
}
</script>
