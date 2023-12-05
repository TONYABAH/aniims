<template>
  <q-card style="width: 280px">
    <q-toolbar class="bg-primary text-white">
      <q-avatar icon="person" color="primary" text-color="white" />
      <span class="q-ml-sm">Assign</span>
      <q-space />
      <q-btn flat color="" icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section>
      <q-form ref="formRef" class="q-gutter-sm">
        <q-select
          v-model="location"
          :options="store.locations"
          options-dense=""
          label="Location"
          dense
          :dark="isDark"
          filled
          outlined=""
          clearable=""
          clear-icon="close"
          :color="isDark ? 'white' : ''"
        />
        <q-select
          v-model="unit"
          :options="units"
          label="Unit"
          options-dense=""
          option-label="Abbrev"
          option-value="Abbrev"
          clearable=""
          clear-icon="close"
          dense
          outlined=""
          :rules="[required]"
        />
        <q-select
          v-model="assigned"
          :options="staffList"
          label="Staff"
          options-dense=""
          option-label="Name"
          option-value="Email"
          clearable=""
          clear-icon="close"
          dense
          outlined=""
          :rules="[required]"
        />
      </q-form>
    </q-card-section>
    <q-card-actions align="right" class="q-pr-md">
      <q-btn
        v-if="unit && assigned"
        no-caps=""
        unelevated=""
        label="Ok"
        color="primary"
        icon="check"
        icon-right="arrow_right"
        @click="assignDocument"
        v-close-popup
      />
      <q-btn
        no-caps=""
        flat=""
        label="Cancel"
        color="negative"
        v-close-popup
        icon="close"
        @click="cancel"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
import { Notify } from "quasar";

const store = useDefaultStore();

const comment = inject("comment");
const onAssign = inject("on-assign");
const formRef = ref(null);
const unit = ref(store.currentDocument?.meta?.Unit);
const location = ref(store.currentDocument?.Location);
const assigned = ref(getOwner());

const props = defineProps({
  onSuccess: {
    type: Function,
    required: true,
  },
  onCancel: {
    type: Function,
    default: () => console.log("Assign document cancelled"),
  },
});

const units = computed(() => {
  return location.value
    ? store.units
        .filter((u) => u.Location === location.value)
        .map((unit) => unit.Abbrev)
    : store.units.map((unit) => unit.Abbrev);
});
const staffList = computed(() => {
  return unit.value
    ? store.staffList.filter((s) => s.Units?.includes(unit.value))
    : store.staffList;
});
function getOwner() {
  return (
    store.staffList.find((s) => s.uid === store.currentDocument?.meta?.From) ||
    {}
  );
}
async function assignDocument() {
  if (!formRef.value.validate()) return;
  //console.log(comment.value, assigned.value, unit.value);
  try {
    await onAssign(comment.value, assigned.value, unit.value);
    reset();
    comment.value = null;
  } catch (error) {
    console.log(error);
    Notify.create({
      timeout: 3000,
      textColor: "white",
      message: error.message,
      icon: "error",
      iconColor: "white",
      color: "red",
    });
  }
}

function cancel() {
  store.assignDialogModel = false;
  reset();
}

function reset() {
  store.assignDialogModel = false;
  assigned.value = null;
  unit.value = null;
  staffList.value = [];
  //comment.value = null;
}
</script>
