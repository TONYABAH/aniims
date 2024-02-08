<template>
  <q-footer class="bg-deep-purple-10 text-grey-1">
    <q-bar dark="" class="text-white">
      <q-btn flat color="white" icon="timer" @click="onClick"> </q-btn>
      <q-toolbar-title style="font-size: 12px; font-variant: small-caps">
        {{ pkg.productName }} v{{ pkg.version }} -
        {{ pkg.description }}</q-toolbar-title
      >
      <!--<FloatingEditorButtons direction="up" />-->
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
    </q-bar>
    <!--<analog-clock :size="280" id="clock" class="slide-left" />-->
  </q-footer>
</template>
<script setup>
//import { useQuasar } from "quasar";
import { ref } from "vue";
//import AnalogClock from "src/components/AnalogClock.vue";
import pkg from "../../package.json";

const clockVisible = ref(false);

function onClick() {
  let el = document.querySelector("#clock");
  if (clockVisible.value) {
    //el.style.left = "-450px";
    el.classList.remove("slide-right");
    el.classList.add("slide-left");
    setTimeout(() => {
      el.style.marginLeft = "-280px";
    }, 1000);
  } else {
    //el.style.left = "16px";
    el.classList.remove("slide-left");
    el.classList.add("slide-right");
    setTimeout(() => {
      el.style.marginLeft = "0";
    }, 400);
  }
  clockVisible.value = !clockVisible.value;
}
</script>
<style>
#clock {
  position: absolute;
  bottom: 32px;
  z-index: 100;
  margin-left: -280px;
}
/***** Global Slide *****/
/***** Slide Right *****/
.slide-right {
  animation: slide-right ease-in-out 400ms;
}
@keyframes slide-right {
  from {
    margin-left: -280px;
  }
  to {
    margin-left: 0;
  }
}

/***** Slide Left *****/
.slide-left {
  animation: 1s slide-left;
}
@keyframes slide-left {
  from {
    margin-left: 0;
  }
  to {
    margin-left: -280px;
  }
}
.fade-in {
  animation: fadeIn ease 3s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes slideOutUp {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, -100%, 0);
  }
}

.slideOutUp {
  animation-name: slideOutUp;
}
.slideInUp {
  animation-name: slideInUp;
}
</style>
