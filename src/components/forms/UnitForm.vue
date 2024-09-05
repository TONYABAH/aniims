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
    :loading="loading"
  >
    <q-form ref="form" class="q-gutter-xs">
      <q-input
        v-model="unit.Name"
        label="Name *"
        type="text"
        outlined
        :rules="[(val) => !!val || 'Name is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="apartment" />
        </template>
      </q-input>

      <q-input
        v-model="unit.Abbrev"
        label="Abbreviation *"
        outlined
        type="text"
        :rules="[(val) => !!val || 'Abbreviation is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />

      <q-select
        v-model="unit.Location"
        label="Location *"
        outlined
        options-dense=""
        :options="store.locations"
        :rules="[(val) => !!val || 'Location is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="location_on" />
        </template>
      </q-select>

      <q-select
        label="Status *"
        v-model="status"
        :options="STATUS_OPTIONS"
        options-dense=""
        outlined
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="saveStatus"
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
import { addSearch, sortByName } from "src/composables/searchProvider";
//import { useUnits } from "src/composables/use-fn";

const STATUS_OPTIONS = ["Active", "Deleted", "Deactivated"];
const searchFields = ["Name", "Abbrev", "Location"];
const collection = "Units";
const store = useDefaultStore();
const form = ref(null);
const updateBtn = ref(false);
const _unit = ref({});
//const search = ref("");

const loading = ref(false);

let units = ref([]);

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
  console.log(m);
}
function reset() {
  form.value.resetValidation();
}
const validate = async () => await form.value?.validate(true);

async function save() {
  if (!unit.value.id) return;
  loading.value = true;
  delete unit.value.meta;
  let data = Object.assign({}, unit.value);
  //delete data.meta;
  update(unit.value.id, data, "Units")
    .then(() => {
      updateBtn.value = false;
      handleSearch();
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
      loading.value = false;
    });
}

async function saveStatus() {
  if (!unit.value.id) return;
  loading.value = true;
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
      loading.value = false;
    });
}

async function create() {
  if (!(await validate())) return;
  loading.value = true;
  try {
    const _fields = ["Name", "Abbrev"].map((f) => unit.value[f]);
    const meta = {
      search: addSearch(_fields),
    };
    unit.value.meta = meta;
    const result = await addUnit(unit.value);
    unit.value.id = result.data;
    handleSearch("");
    setModel({});
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
    loading.value = false;
  }
}
const handleSearch = debounce((searchTerm, active) => {
  //if (active) whereFilters.push(["Status", "==", "Active"]);
  const list = store.units;
  //listStaff(whereFilters).then((list) => {
  units.value = list
    .filter((s) => {
      //let pattern = `${s.Name}|| ${s.Rank} || ${s.Location} || ${s.Unit}`
      let d = searchTerm?.toLowerCase() || "";
      let searchTerms = d.split(" ");
      for (let x of searchTerms) {
        return (
          s.Name?.toLowerCase().indexOf(x) >= 0 ||
          s.Abbrev?.toLowerCase().indexOf(x) === 0 ||
          s.Location?.toLowerCase().indexOf(x) >= 0
          //s.Unit?.toLowerCase().indexOf(x) >= 0
        );
      }
    })
    .sort(sortByName);
}, 5);

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

handleSearch(" ");
defineExpose({
  reset,
  validate,
});
</script>

<style scoped></style>
