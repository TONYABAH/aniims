<template>
  <AdminViewer
    icon-name="room"
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="unit"
    :list="units"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-add="create"
    :on-save="save"
  >
    <q-form ref="form" class="q-gutter-sm">
      <q-separator spaced inset vertical dark />
      <label>Name *</label>
      <q-input
        v-model="unit.Name"
        type="text"
        outlined
        filled
        dense
        :rules="[(val) => !!val || 'Name is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Abbreviation *</label>
      <q-input
        v-model="unit.Abbrev"
        outlined
        filled
        dense
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
        filled
        dense
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
        filled
        dense
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="save"
            v-if="unit.id && updateBtn"
          ></q-btn>
        </template>
      </q-select>
      <!--<q-toolbar class="bg-transparent text- q-mt-md">
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
      </q-toolbar>-->
    </q-form>
  </AdminViewer>
</template>
<script setup>
//import { useQuasar } from "quasar";
import { Notify, Dialog, debounce } from "quasar";
import { ref, computed, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { addUnit } from "src/composables/functions";
import { update } from "src/composables/remote";
import AdminViewer from "src/views/AdminViewer.vue";
import { addSearch, lifeSearch } from "src/composables/searchProvider";

const STATUS_OPTIONS = ["Active", "Deleted", "Deactivated"];
const collection = "Units";
const searchFields = ["Name", "Abbrev", "Location"];
const store = useDefaultStore();
const form = ref(null);
const updateBtn = ref(false);
const _unit = ref({});
const units = ref([]);
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
async function save() {
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
async function create() {
  if (!(await validate())) return;
  store.loading = true;
  try {
    const _fields = ["Name", "Abbrev"].map((f) => unit.value[f]);
    const meta = {
      search: addSearch(_fields),
    };
    unit.value.meta = meta;
    const result = await addUnit(unit.value);
    unit.value.id = result.data;
    handleSearch("");
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

const handleSearch = debounce(async (d) => {
  store.loading = true;
  lifeSearch("Units", { searchText: d, limits: 100 })
    .then((_units) => {
      units.value = _units;
    })
    .catch((e) => {
      Dialog.create({
        message: e.message,
        title: "Error",
        timeout: 2000,
        cancel: true,
        ok: false,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}, 500);

defineExpose({
  reset,
  validate,
});
</script>

<style scoped></style>
