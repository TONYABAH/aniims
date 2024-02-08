<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-select
      v-model="_model.whereTo"
      options-dense
      :options="['Division', 'IPO', 'Legal']"
      label="Where to?"
      outlined=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      :color="isDark ? 'white' : 'grey-10'"
    />
    <q-select
      v-model="_model.location"
      :options="store.locations"
      options-dense=""
      label="Location"
      :dark="isDark"
      outlined=""
      clearable=""
      clear-icon="close"
      :color="isDark ? 'white' : 'grey-10'"
    />

    <q-select
      v-model="_model.unit"
      :options="store.units"
      label="Unit"
      options-dense=""
      option-label="Abbrev"
      option-value="Abbrev"
      clearable=""
      clear-icon="close"
      outlined=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      :color="isDark ? 'white' : 'grey-10'"
    />
    <q-select
      v-model="_model.assigned"
      :options="store.staffList"
      label="Staff"
      options-dense=""
      option-label="Name"
      option-value="uid"
      clearable=""
      clear-icon="close"
      outlined=""
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      :color="isDark ? 'white' : 'grey-10'"
    />
  </q-form>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
const store = useDefaultStore();
const form = ref(null);

const props = defineProps({
  model: Object,
  setModel: Function,
});
const _model = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v),
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
    null
  );
}
async function assignDocument() {
  if (!form.value.validate()) return;
  try {
    await onAssign(
      props.comment,
      assigned.value,
      unit.value,
      store.currentDocument.id
    );
    reset();
    //comment.value = null;
    props.onSuccess();
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
async function validate() {
  return await form.value?.validate(true);
}
function reset() {
  store.assignDialogModel = false;
  form.value.resetValidation();
}
defineExpose({
  reset,
  validate,
  //assigned: assigned.value,
  //unit: unit.value,
  //location: location.value,
  //whereTo: whereTo.value,
});
</script>
