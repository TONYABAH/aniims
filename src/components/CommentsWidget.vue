<template>
  <template v-if="!store.chatMode">
    <q-card
      v-for="(item, i) of comments"
      :key="i"
      square=""
      class="shadow-1 q-my-md"
      :class="$q.dark.isActive ? 'bg-grey text-white' : 'bg-grey-1'"
      style="border-radius: 12px 12px"
    >
      <div
        class="text-white full-width q-px-sm"
        :class="store.user.uid === item.uid ? 'bg-purple-7' : 'bg-purple-5'"
        :style="
          store.user.uid === item.uid
            ? 'border-radius: 8px 8px 0 8px; text-align:right'
            : 'border-radius: 8px 8px 8px 0'
        "
      >
        <q-icon name="person" class="q-mr-sm" />
        <label>{{ item.from }}</label>
        <q-icon name="comment" class="q-mx-sm" />
        <div rows="" type="text" dark readonly class="transparent">
          <q-editor
            v-model="item.comment"
            square=""
            :content-class="
              store.user.uid === item.uid ? 'bg-purple-7' : 'bg-purple-5'
            "
            min-height="2rem"
            :toolbar="false"
            style="border: 0; border-top: 1px solid"
          />
        </div>

        <label class="text-grey-3" style="font-size: 12px">
          <q-icon name="timer" class="q-mr-sm" />
          {{ new Date(item.time).toUTCString() }}</label
        >
      </div>
    </q-card>
  </template>
  <template v-else>
    <q-chat-message
      v-for="(item, i) of comments"
      :key="i"
      :name="item.from"
      :text-html="true"
      :text="[item.comment]"
      :stamp="new Date(item.time).toUTCString()"
      :sent="store.user?.uid === item.uid"
      :bg-color="store.user?.uid === item.uid ? 'purple-7' : 'purple-5'"
      :text-color="store.user?.uid === item.uid ? 'white' : 'grey-1'"
      :avatar="
        store.user?.uid === item.uid
          ? '../assets/avatar1.jpg'
          : '../assets/avatar2.jpg'
      "
    ></q-chat-message>
  </template>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const props = defineProps({
  comments: Array,
  //chatMode: Boolean,
});
</script>
