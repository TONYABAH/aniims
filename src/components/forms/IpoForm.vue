<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="ipo"
    :list="ipoList"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-add="create"
    :on-save="save"
    :loading="loading"
    icon-name="perm_identity"
  >
    <!--<IpoForm ref="ipoFormRef" :setProfile="setModel" :profile="selectedIPO" />-->

    <q-form ref="form" class="q-pb-sm q-gutter-xs">
      <q-input
        v-model="ipo.name"
        label="Full name *"
        type="text"
        input-class="text-input"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-icon name="perm_identity" />
        </template>
      </q-input>

      <q-input
        v-model="ipo.phone"
        label="Phone *"
        type="text"
        :rules="[validation.required, validation.isPhoneNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-icon name="phone" />
        </template>
      </q-input>

      <q-input
        v-model="ipo.email"
        label="Email *"
        type="email"
        :rules="[validation.required, validation.isEmail]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onEmailChanged"
            v-if="ipo.id"
          ></q-btn>
          <q-icon name="email" />
        </template>
      </q-input>
      <q-select
        v-model="ipo.rank"
        label="Rank"
        :rules="[validation.required]"
        :options="RANK_OPTIONS"
        options-dense=""
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined=""
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onRankChanged"
            v-if="ipo.id"
          ></q-btn>
        </template>
      </q-select>
      <q-select
        v-model="ipo.role"
        label="Role *"
        :options="roleOptions"
        options-dense=""
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-icon name="category" />
        </template>
      </q-select>

      <q-select
        v-model="ipo.location"
        label="Location *"
        options-dense=""
        :options="store.locations"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-icon name="location_on" />
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onLocationChanged"
            v-if="ipo.id"
          ></q-btn>
        </template>
      </q-select>

      <q-select
        v-model="ipo.unit"
        label="Unit *"
        :options="unitsOptions"
        options-dense=""
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
      >
        <template v-slot:append>
          <q-icon name="apartment" />
        </template>
      </q-select>
      <q-select
        v-model="status"
        label="Status *"
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
            @click.stop="save"
            v-if="ipo.id"
          ></q-btn>
          <q-icon name="wifi" />
        </template>
      </q-select>
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { debounce } from "quasar";
import { Notify, Dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, ref } from "vue";
import { addIPO } from "src/composables/functions";
import { update } from "src/composables/remote";
import { useValidation } from "src/composables/use-fn";
import AdminViewer from "src/views/AdminViewer.vue";
import { addSearch, sortByName } from "src/composables/searchProvider";

const validation = useValidation();
const store = useDefaultStore();
const form = ref(null);
const ipoList = ref([]);
const loading = ref(false);
const profile = ref({});
const collection = "IPOS";
const roleOptions = ["IPO", "2IC", "OC"];
const unitsOptions = ref(["FTF Police", "NAFDAC Police"]);
const STATUS_OPTIONS = ["Active", "Inactive"];
const searchFields = ["Name", "Rank", "Email", "Location"];
const RANK_OPTIONS = [
  "Constable",
  "Corpral",
  "Sergent",
  "Inspector",
  "ASP",
  "DSP",
  "SP",
  "CSP",
  "ACP",
  "DCP",
  "CP",
  "AIG",
  "DIG",
  "IG",
];
const ipo = computed({
  get: () => profile.value || {},
  set: (val) => {
    profile.value = val;
  },
});

function setModel(m) {
  ipo.value = m;
}
function reset() {
  form.value.resetValidation();
}
const validate = async () => await form.value?.validate(true);
const status = computed({
  get: () => ipo.value.status || "Active",
  set: (v) => (ipo.value.status = v),
});
async function onLocationChanged() {
  if (!ipo.value.id) return;
  loading.value = true;
  update(ipo.value.id, { rank: ipo.value.location }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Rank updated",
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
async function onEmailChanged() {
  if (!ipo.value.id) return;
  loading.value = true;
  update(ipo.value.id, { email: ipo.value.email }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Rank updated",
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
async function onRankChanged() {
  if (!ipo.value.id) return;
  loading.value = true;
  update(ipo.value.id, { rank: ipo.value.rank }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Rank updated",
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
async function save() {
  if (!ipo.value?.id) return;
  loading.value = true;
  //delete ipo.value?.meta;
  //delete ipo.value?.Email;
  //console.log(ipo.value);
  update(ipo.value.id, { ...ipo.value }, "Users")
    .then(() => {
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
  //const _fields = ["Name", "Rank"].map((f) => ipo.value[f]);
  /*const meta = {
    search: addSearch(_fields),
  };*/
  // unit.value.meta = meta;
  addIPO({ ...ipo.value })
    .then((result) => {
      ipo.value = result.data;
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
      //loading.value = false;
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
      //loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
}

const handleSearch = debounce((searchTerm, active) => {
  const list = store.ipos;
  ipoList.value = list
    .filter((s) => {
      //let pattern = `${s.Name}|| ${s.Rank} || ${s.Location} || ${s.Unit}`
      let d = searchTerm?.toLowerCase() || "";
      let searchTerms = d.split(" ");
      for (let x of searchTerms) {
        return (
          s.Name?.toLowerCase().indexOf(d) >= 0 ||
          s.Rank?.toLowerCase().indexOf(d) === 0 ||
          s.Location?.toLowerCase().indexOf(d) >= 0 ||
          s.Unit?.toLowerCase().indexOf(d) >= 0
        );
      }
    })
    .sort(sortByName);
}, 5);

defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  //defaults.value = {};
  //handleSearch("", true);
});
</script>
<style scoped></style>
