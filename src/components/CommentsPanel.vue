<template>
  <div class="text-bold">
    <div v-if="minutes?.length > 0" class="full-width">
      <q-expansion-item
        expand-separator
        icon="comment"
        label="Minutes"
        caption=""
        v-model="expanded"
        dense=""
        dense-toggle=""
        style="border-radius: 2px 2px; border: 1px solid #888"
      >
        <template v-slot:header>
          <q-toolbar dark>
            <q-icon name="comment" />
            <q-toolbar-title>Minutes</q-toolbar-title>
            <q-checkbox left-label v-model="store.chatMode" label="Conversational" />
            <!--<q-toggle v-model="store.chatMode" color="primary" label="Chat" />-->
          </q-toolbar>
        </template>
        <CommentsWidget :comments="minutes" />
        <template v-slot:append></template>
      </q-expansion-item>
    </div>
    <div v-else class="full-width">
      <i>No minutes</i>
    </div>
  </div>
</template>
<script setup>
import CommentsWidget from "./CommentsWidget.vue";
import { ref } from "vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const expanded = ref(true);
const props = defineProps({
  handleComment: Function,
  minutes: {
    type: Array,
    default: () => [],
  },
});
</script>
