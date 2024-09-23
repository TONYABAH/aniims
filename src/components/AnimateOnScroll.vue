<template>
  <div ref="target">
    <transition
      :name="animationType"
      :appear="true"
      :duration="6000"
      mode="in-out"
    >
      <div v-show="animate" class="animated-component">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  animationType: {
    type: String,
    required: false,
    default: "zoom",
  },
});
const target = ref();
const animate = ref(false);
const observer = new IntersectionObserver(
  ([entry]) => {
    animate.value = entry.isIntersecting;
  },
  {
    threshold: 0.01,
  }
);

onMounted(() => {
  observer.observe(target.value);
});
</script>

<style scoped>
.animated-component.fade-enter-from,
.animated-component.zoom-enter-from {
  transition: none;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Zoom animation */
.zoom-enter-active,
.zoom-leave-active- {
  transition: transform 1000ms ease;
}

.zoom-enter-from,
.zoom-leave-to- {
  transform: scale(0.9);
}
</style>
