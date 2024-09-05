<template>
  <q-fab icon="comment">
    <q-fab-action
      v-if="returnable"
      glossy=""
      square
      color="amber"
      :label="$q.screen.lt.sm ? 'Return' : 'Return'"
      icon="undo"
      @click="returnDocument"
    />
    <q-fab-action
      v-show="submitable"
      glossy=""
      square
      color="positive"
      :label="$q.screen.lt.sm ? 'Submit' : 'Submit'"
      icon="check"
      @click="submit"
    />
    <q-fab-action
      v-if="assignable"
      glossy=""
      square
      color="purple"
      :label="$q.screen.lt.sm ? 'Assign' : 'Assign'"
      icon="perm_identity"
      @click="assign"
    />
  </q-fab>
</template>

<script setup>
const props = defineProps({
  isDirector: Boolean,
  returnable: Boolean,
  returnDocument: Function,
  assignable: Boolean,
  submitable: Boolean,
  submit: Function,
  assign: Function,
  loading: Boolean,
});
</script>
