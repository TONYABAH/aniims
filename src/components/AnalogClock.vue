<template>
  <div class="container">
    <div
      class="clock shadow-22"
      :style="style"
      :class="$q.dark.isActive ? 'text-grey-1' : 'text-grey-9'"
    >
      <label style="--i: 1"><span>1</span></label>
      <label style="--i: 2"><span>2</span></label>
      <label style="--i: 3"><span>3</span></label>
      <label style="--i: 4"><span>4</span></label>
      <label style="--i: 5"><span>5</span></label>
      <label style="--i: 6"><span>6</span></label>
      <label style="--i: 7"><span>7</span></label>
      <label style="--i: 8"><span>8</span></label>
      <label style="--i: 9"><span>9</span></label>
      <label style="--i: 10"><span>10</span></label>
      <label style="--i: 11"><span>11</span></label>
      <label style="--i: 12"><span>12</span></label>
      <div class="indicator">
        <span
          class="hand hour"
          :class="$q.dark.isActive ? 'bg-teal' : 'bg-grey-8'"
        ></span>
        <span
          class="hand minute"
          :class="$q.dark.isActive ? 'bg-grey-5' : 'bg-grey-8'"
        ></span>
        <span
          class="hand second"
          :class="$q.dark.isActive ? 'bg-red' : 'bg-pink'"
        ></span>
        <span
          class="hand projection"
          :class="$q.dark.isActive ? 'bg-red' : 'bg-pink'"
        ></span>
      </div>
      <q-btn
        unelevated=""
        rounded=""
        label="Aniims"
        size="lg"
        glossy
        class="mode-switch q-px-md"
        @click="toggleClock"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  size: {
    type: Number,
    default: 400,
  },
});
const style = computed(() => {
  return `width:${props.size}px;height:${props.size}px`;
});
const stopped = ref(false);
const pulses = ref(0);
// Get references to DOM elements
var hourHand = document.querySelector(".hour"),
  minuteHand = document.querySelector(".minute"),
  secondHand = document.querySelector(".second"),
  projection = document.querySelector(".projection");
var clock = document.querySelector(".clock");

const updateTime = (date) => {
  let minToDeg = (date.getMinutes() / 60) * 360,
    hrToDeg = (date.getHours() / 12) * 360;
  // Rotate the clock hands to the appropriate degree based on the current time
  minuteHand.style.transform = `rotate(${minToDeg}deg)`;
  hourHand.style.transform = `rotate(${hrToDeg}deg)`;
};
const updateSecond = () => {
  // Get current time and calculate degrees for clock hands
  let date = new Date();
  let seconds = date.getSeconds();
  if (seconds === 0) {
    updateTime(date);
  }
  let miliseconds = date.getMilliseconds();
  let secToDeg = ((seconds * 1000 + miliseconds) / 1000 / 60) * 360;
  // Rotate the clock hands to the appropriate degree based on the current time
  secondHand.style.transform = `rotate(${secToDeg}deg)`;
  projection.style.transform = `rotate(${secToDeg - 180}deg)`;
  if (!stopped.value) window.requestAnimationFrame(updateSecond);
};
const rotateClock = () => {
  const deg = pulses.value % 360;
  clock.style.transform = `rotate(${deg}deg)`;
};
const toggleClock = () => {
  stopped.value = !stopped.value;
  if (!stopped.value) {
    updateTime(new Date());
    window.requestAnimationFrame(updateSecond);
  }
};
let interval1 = null,
  interval2 = null;
onMounted(() => {
  hourHand = document.querySelector(".hour");
  minuteHand = document.querySelector(".minute");
  secondHand = document.querySelector(".second");
  clock = document.querySelector(".clock");
  projection = document.querySelector(".projection");
  // call updateTime to set clock hands every second
  //interval1 = setInterval(updateTime, 1);
  //interval2 = setInterval(updateSecond, 1);
  //call updateTime function on page load
  updateTime(new Date());
  //window.requestAnimationFrame(updateTime);
  window.requestAnimationFrame(updateSecond);
  /*setInterval(() => {
    pulses.value += 1;
    const deg = pulses.value % 360;
    const offset = pulses.value % 500;
    //clock.style.transform = `rotate(${deg}deg)`;
    //clock.style.transform = `translateX(${offset}px) rotate(${deg}deg)`;
  }, 20);*/
});
onBeforeUnmount(() => {
  clearInterval(interval1);
  clearInterval(interval2);
});
</script>

<style>
/* Import Google font - Poppins */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
* {
  /*margin: 0;
  padding: 0;*/
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
:root {
  --primary-color: #f6f7fb;
  --white-color: #fff;
  --black-color: #333;
  --red-color: #e74c3c;
}
body {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
}
.dark {
  --primary-color: #242526;
  --white-color: #18191a;
  --black-color: #fff;
  --red-color: #e74c3c;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}
.container .clock {
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1), 0 25px 45px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 4px solid teal;
}
.clock label {
  position: absolute;
  inset: 20px;
  text-align: center;
  transform: rotate(calc(var(--i) * (360deg / 12)));
}
.clock label span {
  display: inline-block;
  font-size: 30px;
  font-weight: 600;
  transform: rotate(calc(var(--i) * (-360deg / 12)));
}
.container .indicator {
  position: absolute;
  height: 18px;
  width: 18px;
  display: flex;
  justify-content: center;
  border-radius: 50%;
}
.indicator::before {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  z-index: 1;
  background: var(--red-color);
  border: 1px solid var(--red-color);
}
.indicator .hand {
  position: absolute;
  height: 130px;
  width: 4px;
  bottom: 9px;
  border-radius: 25px;
  transform-origin: bottom;
  background: var(--red-color);
}
.hand.minute {
  height: 120px;
  width: 5px;
  background: var(--black-color);
}
.hand.hour {
  height: 100px;
  width: 10px;
  background: var(--black-color);
}
.hand.projection {
  height: 24px;
  width: 10px;
  border-radius: 0px, 0px;
  background: var(--black-color);
  z-index: 100;
}
.mode-switch {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 50%;
  padding: 0, 36px;
}
/*.round-spot {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgb(2, 105, 105);
}*/
</style>
