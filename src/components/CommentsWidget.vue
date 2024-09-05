<template>
  <template v-if="!store.chatMode">
    <q-card
      v-for="(item, i) of comments"
      :key="i"
      :class="
        $q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-2 text-grey-10'
      "
      class="q-my-md"
      style="border-radius: 8px 8px 0 0"
    >
      <div
        class="full-width q-px-sm"
        :style="
          store.user.uid === item.From?.uid
            ? 'border-radius: 8px 8px 0 8px;'
            : 'border-radius: 8px 8px 8px 0'
        "
      >
        <q-icon name="person" class="q-mr-sm" />
        <label>{{ item.From?.Name }}</label>
        <q-icon name="comment" class="q-mx-sm" />
        <div rows="" type="text" dark readonly class="transparent text-teal">
          <q-editor
            v-model="item.Comment"
            square=""
            :content-class="
              $q.dark.isActive
                ? 'bg-grey-8 text-white'
                : 'bg-grey-2 text-grey-9'
            "
            min-height="2rem"
            :toolbar="false"
            style="border: 0; border-top: 1px solid"
          />
        </div>

        <div class="text-" style="font-size: 12px">
          <q-icon name="timer" class="q-mr-sm" />
          {{ new Date(item.Date).toLocaleString("en-GB") }}
        </div>
      </div>
    </q-card>
  </template>
  <template v-else>
    <q-chat-message
      v-for="(item, i) of comments"
      :key="i"
      :name="item.From?.Name"
      :text-html="true"
      :text="[item.Comment]"
      :stamp="new Date(item.Date).toLocaleString('en-GB')"
      :sent="store.user?.uid === item.From?.uid"
      :bg-color="store.user?.uid === item.From?.uid ? 'blue-3' : 'yellow-3'"
      :text-color="store.user?.uid === item.From?.uid ? 'black' : 'grey-10'"
      :avatar="
        store.user?.uid === item.From?.uid
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
