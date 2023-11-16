<template>
  <q-card style="width: 280px">
    <q-toolbar class="bg-primary text-white">
      <q-avatar icon="person" color="primary" text-color="white" />
      <span class="q-ml-sm">Superior</span>
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
    <q-card-actions align="right" class="q-mx-md">
      <q-btn
        v-if="unit && assigned"
        no-caps=""
        unelevated=""
        label="Submit"
        color="secondary"
        glossy=""
        icon="check"
        @click="submitDocument"
        v-close-popup
      />
      <q-btn
        no-caps=""
        unelevated=""
        label="Cancel"
        color="negative"
        glossy=""
        v-close-popup
        icon="close"
        @click="cancel"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
import { onSubmit } from "../composables/remote";
import { Notify } from "quasar";

const store = useDefaultStore();
const assigned = ref("");
const location = ref("");
const unit = ref("");
const comment = inject("comment");

const formRef = ref(null);

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
    ? store.units.filter((u) => u.Location === location.value)
    : store.units;
});
const staffList = computed(() => {
  return unit.value
    ? store.staffList.filter((s) => s.Units?.includes(unit.value.Abbrev))
    : store.staffList;
});

async function submitDocument() {
  if (!formRef.value.validate()) return;
  try {
    await onSubmit(
      comment.value,
      assigned.value,
      unit.value.Abbrev,
      store.currentDocument.id
    );
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
  //props.onCancel();
  store.submitDialogModel = false;
  reset();
}
function reset() {
  store.submitDialogModel = false;
  assigned.value = null;
  unit.value = null;
  staffList.value = [];
  //comment.value = null;
}
</script>
