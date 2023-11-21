<template>
  <div :id="id"></div>
</template>
<script setup>
const id = "geo__" + Math.random().toString(32).substring(2);
</script>
