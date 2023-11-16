<template>
  <template v-if="!store.chatMode">
    <q-card
      v-for="(item, i) of comments"
      :key="i"
      square=""
      class="shadow-1 q-mt-xs"
      :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-1'"
      style="border-radius: 2px 2px; border: 0px inset #888"
    >
      <div
        class="q-pl-sm text-white full-width"
        :class="store.user.uid === item.uid ? 'bg-teal' : 'bg-purple'"
      >
        <q-icon name="person" class="q-mr-sm" />
        <label>{{ item.from }}</label>
        <div rows="" type="text" dark readonly class="full-width transparent">
          <q-icon name="comment" class="q-mr-sm" />
          {{ item.comment }}
        </div>

        <label class="text-grey-3" style="font-size: 12px">
          <q-icon name="timer" class="q-mr-sm" />
          {{ new Date(item.time).toString() }}</label
        >
      </div>
    </q-card>
  </template>
  <template v-else>
    <q-chat-message
      v-for="(item, i) of comments"
      :key="i"
      :name="item.from"
      :text="[item.comment]"
      :stamp="new Date(item.time).toString()"
      :sent="store.user?.uid === item.uid"
      :bg-color="store.user?.uid === item.uid ? 'teal' : 'purple'"
      text-color="white"
      :avatar="
        store.user?.uid === item.uid
          ? 'https://cdn.quasar.dev/img/avatar2.jpg'
          : 'https://cdn.quasar.dev/img/avatar3.jpg'
      "
    ></q-chat-message>
  </template>
</template>
<script setup>
import { useDefaultStore } from "src/stores/store";
//import { inject } from "vue";
//const minutes = inject("minutes")
const store = useDefaultStore();
const props = defineProps({
  comments: Array,
  //chatMode: Boolean,
});
</script>
