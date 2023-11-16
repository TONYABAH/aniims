<template>
  <div
    class="fullscreen bg-blue-10 text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh" class="text-amber text-shadow">404</div>

      <div class="text-h5" style="opacity: 0.6">
        The page you are looking for is not found!
      </div>

      <q-btn
        class="q-mt-xl"
        color="teal"
        text-color="white"
        unelevated
        to="/"
        label="Go Home"
        no-caps
        size="lg"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
