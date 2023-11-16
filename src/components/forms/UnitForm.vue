<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="unit"
    :list="store.units"
    icon-name="room"
    :reset="reset"
    :validate="validate"
  >
    <q-form ref="form" class="q-gutter-sm">
      <q-separator spaced inset vertical dark />
      <label>Name *</label>
      <q-input
        v-model="unit.Name"
        type="text"
        outlined
        square
        :rules="[(val) => !!val || 'Name is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Abbreviation *</label>
      <q-input
        v-model="unit.Abbrev"
        outlined
        square
        type="text"
        :rules="[(val) => !!val || 'Abbreviation is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Location *</label>
      <q-select
        v-model="unit.Location"
        outlined
        square
        options-dense=""
        :options="store.locations"
        :rules="[(val) => !!val || 'Location is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Status *</label>
      <q-select
        v-model="status"
        :options="STATUS_OPTIONS"
        options-dense=""
        outlined
        square
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onStatusChanged"
            v-if="unit.id && updateBtn"
          ></q-btn>
        </template>
      </q-select>
      <q-toolbar class="bg-transparent text- q-mt-md">
        <q-space />
        <q-btn
          unelevated=""
          icon-right="check"
          class="q-mr-xs"
          @click="save"
          color="secondary"
          label="Create"
          glossy
          :disable="!!unit.id"
        />
      </q-toolbar>
    </q-form>
  </AdminViewer>
</template>
<script setup>
//import { useQuasar } from "quasar";
import { Notify, Dialog } from "quasar";
import { ref, computed, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { addUnit } from "src/composables/functions";
import { update } from "src/composables/remote";
import AdminViewer from "src/views/AdminViewer.vue";

const STATUS_OPTIONS = ["Active", "Deleted", "Deactivated"];
const collection = "Units";
const searchFields = ["Name", "Abbrev", "Location"];
const store = useDefaultStore();
const form = ref(null);
const updateBtn = ref(false);
const _unit = ref({});

const unit = computed({
  get: () => _unit.value || {},
  set: (val) => {
    _unit.value = val;
  },
});

const status = computed({
  get: () => unit.value.Status || "Active",
  set: (v) => (unit.value.Status = v),
});
function setModel(m) {
  unit.value = m;
}
function reset() {
  form.value.resetValidation();
}
const validate = async () => await form.value?.validate(true);
watch(
  () => unit.value.Status,
  (val, oldVal) => {
    if (val !== oldVal) {
      updateBtn.value = true;
    } else {
      updateBtn.value = false;
    }
  },
  { immediate: true }
);
async function onStatusChanged() {
  if (!unit.value.id) return;
  store.loading = true;
  update(unit.value.id, { Status: status.value }, "Units")
    .then(() => {
      updateBtn.value = false;
      Notify.create({
        timeout: 800,
        message: "Status updated",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      store.loading = false;
    });
}
async function save() {
  if (!(await validate())) return;
  store.loading = true;
  try {
    const result = await addUnit(unit.value);
    unit.value.id = result.data;
    Notify.create({
      timeout: 800,
      message: "Created successfully",
      caption: "Update",
      color: "secondary",
      textColor: "white",
      icon: "check",
      position: "right",
    });
  } catch (e) {
    //console.log(e.code, e.message);
    Dialog.create({
      title: "Error",
      message: e.message,
      color: "red",
    });
  } finally {
    store.loading = false;
  }
}
defineExpose({
  reset,
  validate,
});
</script>

<style scoped></style>
