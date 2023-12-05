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
    icon-name="perm_identity"
  >
    <!--<IpoForm ref="ipoFormRef" :setProfile="setModel" :profile="selectedIPO" />-->

    <q-form ref="form" class="q-pb-sm q-gutter-sm">
      <!--<q-input
        v-model="searchText"
        type="text"
        label="Search name, email, location..."
        outlined filled dense
        rounded
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>-->
      <q-separator spaced inset vertical dark />
      <label>Full name *</label>
      <q-input
        v-model="ipo.Name"
        type="text"
        input-class="text-input"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
      >
        <template v-slot:append>
          <q-icon name="perm_identity" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Phone *</label>
      <q-input
        v-model="ipo.Phone"
        type="text"
        :rules="[validation.required, validation.isPhoneNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
      >
        <template v-slot:append>
          <q-icon name="phone" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Email *</label>
      <q-input
        v-model="ipo.Email"
        type="email"
        :rules="[validation.required, validation.isEmail]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
      >
        <template v-slot:append>
          <q-icon name="email" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Rank *</label>
      <q-input
        v-model="ipo.Rank"
        type="text"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
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
            @click.stop="onRankChanged"
            v-if="ipo.id"
          ></q-btn>
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Role *</label>
      <q-select
        v-model="ipo.Role"
        :options="roleOptions"
        options-dense=""
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
      />
      <q-separator spaced inset vertical dark />
      <label>Location *</label>
      <q-select
        v-model="ipo.Location"
        options-dense=""
        :options="store.locations"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
      />
      <q-separator spaced inset vertical dark />
      <label>Unit *</label>
      <q-select
        v-model="ipo.Unit"
        :options="unitsOptions"
        options-dense=""
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        filled
        dense
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
            v-if="ipo.id"
          ></q-btn>
        </template>
      </q-select>
      <!--<q-toolbar class="bg-transparent text- q-mt-md">
        <q-toolbar-title></q-toolbar-title>
        <q-btn
          unelevated=""
          class="q-mr-xs"
          @click="save"
          color="negative"
          label="Save changes"
          glossy
          v-if="!!ipo.id"
        />
        <q-btn
          unelevated=""
          class="q-mr-xs"
          @click="save"
          color="secondary"
          label="Create"
          glossy
          v-else
        />
      </q-toolbar>-->
    </q-form>
  </AdminViewer>
</template>

<script setup>
//import { debounce, useQuasar } from "quasar";
import { Notify, Dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, ref, watch } from "vue";
import { addIPO } from "src/composables/functions";
import { update } from "src/composables/remote";
import { validation } from "src/composables/use";
import AdminViewer from "src/views/AdminViewer.vue";
import { addSearch, lifeSearch } from "src/composables/searchProvider";

const store = useDefaultStore();
const roleOptions = ["IPO", "2IC", "OC"];
const unitsOptions = ref(["FTF", "NAFDAC Police"]);
const form = ref(null);
const STATUS_OPTIONS = ["Active", "Inactive"];
const collection = "IPO";
const searchFields = ["Name", "Rank", "Email", "Location"];
//const searchText = ref("");
const userList = ref([]);
const ipoList = ref([]);
//const allUsers = ref([]);

const profile = ref({});

const ipo = computed({
  get: () => profile.value || {},
  set: (val) => {
    profile.value = val;
  },
});
/*const isActive = computed({
  get: () => ipo.value.Active || false,
  set: (v) => (ipo.value.Active = v),
});*/
function setModel(m) {
  ipo.value = m;
}
function reset() {
  form.value.resetValidation();
}
const validate = async () => await form.value?.validate(true);
const status = computed({
  get: () => ipo.value.Status || "Active",
  set: (v) => (ipo.value.Status = v),
});
async function onRankChanged() {
  if (!ipo.value.id) return;
  store.loading = true;
  update(ipo.value.id, { Rank: ipo.value.Rank }, "Users")
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
      store.loading = false;
    });
}
async function save() {
  if (!ipo.value.id) return;
  store.loading = true;
  update(ipo.value.id, { Status: status.value }, "Users")
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
      store.loading = false;
    });
}
async function create() {
  if (!(await validate())) return;
  store.loading = true;
  const _fields = ["Name", "Rank"].map((f) => ipo.value[f]);
  const meta = {
    search: addSearch(_fields),
  };
  // unit.value.meta = meta;
  addIPO({ ...ipo.value, meta })
    .then((result) => {
      ipo.value = result.data;
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
      store.loading = false;
    });
}
/*function filter(val) {
  const needle = val?.toLowerCase() || "";
  if (!needle || needle.trim().length === 0) {
    userList.value = store.ipos;
    return userList.value;
  }
  const filtered = store.ipos?.filter((v) => {
    return (
      v.Email?.toLowerCase().indexOf(needle) > -1 ||
      v.Location?.toLowerCase().indexOf(needle) > -1 ||
      v.Name?.toLowerCase().indexOf(needle) >= 0
    );
  });
  userList.value = filtered;
  return filtered;
}*/
//watch(searchText, (val) => filter(val), { immediate: true });

const handleSearch = debounce(async (d) => {
  const whereFilters = [["Level", "==", 2]];
  const _users = await lifeSearch("Users", {
    searchText: d,
    whereFilters,
    limits: 100,
  });
  ipoList.value = _users;
}, 500);

defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  //defaults.value = {};
});
</script>
<style scoped></style>
