<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="staff"
    :list="userList"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-add="create"
    :on-save="save"
    icon-name="perm_identity"
    :loading="loading"
  >
    <q-form class="q-pb-sm q-gutter-sm" ref="form">
      <!--<q-input
        v-model="searchText"
        type="text"
        label="Search name, email, location..."
        outlined  dense
        rounded
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>-->
      <q-separator spaced inset vertical dark />

      <label>Title *</label>
      <q-select
        v-model="staff.Title"
        :options="TITLE_OPTIONS"
        options-dense=""
        outlined
        name="title"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />

      <label>Full name *</label>
      <q-input
        v-model="staff.Name"
        type="text"
        input-class="text-input"
        outlined
        name="name"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="person" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />

      <label>Phone *</label>
      <q-input
        outlined
        v-model="staff.Phone"
        type="text"
        name="phone"
        :rules="[validation.required, validation.isPhoneNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="phone" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />

      <label>Email *</label>
      <q-input
        outlined
        v-model="staff.Email"
        type="email"
        name="email"
        :rules="[validation.required, validation.isEmail]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="email" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />

      <label>Staff Number *</label>
      <q-input
        outlined
        v-model="StaffId"
        type="text"
        name="staffnumber"
        :rules="[validation.isStaffNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
      </q-input>
      <q-separator spaced inset vertical dark />

      <label>Rank *</label>
      <q-input
        outlined
        v-model="staff.Rank"
        type="text"
        name="rank"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />

      <label>Role *</label>
      <q-select
        outlined
        v-model="staff.Role"
        :options="roleOptions"
        options-dense=""
        name="role"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />

      <label>Location *</label>
      <q-select
        v-model="staff.Location"
        options-dense=""
        :options="store.locations"
        outlined
        name="location"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />

      <q-separator spaced inset vertical dark />

      <template v-if="staff.Role !== 'Director'">
        <label>Divisions or Units *</label>
        <q-select
          outlined
          v-model="staff.Units"
          :options="store.units"
          option-value="Abbrev"
          option-label="Abbrev"
          multiple
          emit-value
          map-options
          options-=""
          options-dense=""
          name="units"
          :use-chips="false"
          :rules="[validation.required]"
          lazy-rules="ondemand"
          hide-bottom-space=""
        >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item dense v-bind="itemProps">
              <q-item-section thumbnail="">
                <q-checkbox
                  left-label
                  :model-value="selected"
                  @update:model-value="toggleOption(opt)"
                  size="xs"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ opt.Abbrev }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-separator spaced inset vertical dark />

        <label>Divisions or Units Headed (optional)</label>
        <q-select
          outlined
          v-model="staff.Heads"
          :options="staff.Units"
          multiple
          emit-value
          map-options
          options-=""
          name="heads"
          options-dense=""
          :use-chips="false"
        >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item dense v-bind="itemProps">
              <q-item-section thumbnail="">
                <q-checkbox
                  left-label
                  :model-value="selected"
                  @update:model-value="toggleOption(opt)"
                  size="xs"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ opt }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </template>

      <q-select
        v-model="status"
        :options="STATUS_OPTIONS"
        options-dense=""
        label="Status"
        outlined
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onStatusChanged"
            v-if="staff.id"
          ></q-btn>
        </template>
      </q-select>

      <!--<q-toolbar class="bg-grey-9" style="border-radius: 6px">
        <q-toolbar-title></q-toolbar-title>
        <q-btn
          color="teal"
          label="Save changes"
          unelevated=""
          @click="save"
          v-if="!!staff.id"
        />
        <q-separator spaced inset vertical dark />
        <q-btn
          unelevated=""
          class="q-mr-xs"
          color="negative"
          label="Save"
          glossy=""
          @click.stop="save"
          :disable="!staff.id || !store.user.claims.admin"
        />
        <q-btn
          unelevated=""
          class="q-mr-xs"
          color="secondary"
          label="Create"
          glossy=""
          @click.stop="create"
          v-if="!staff.id"
        />
      </q-toolbar>-->
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { Notify, Dialog, debounce } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { createUser } from "src/composables/functions";
import { update } from "src/composables/remote";
import { useValidation } from "src/composables/use-fn";
import AdminViewer from "src/views/AdminViewer.vue";
import { addSearch, lifeSearch } from "src/composables/searchProvider";

const form = ref(null);
const store = useDefaultStore();
const validation = useValidation();
const loading = ref(false);

const roleOptions = [
  "Director",
  "Head Location",
  "Head Division",
  "Regulatory",
  "Secretary",
  "Accountant",
  "Administrative",
  "Press",
  "Legal",
  "Maintenance",
  "Transport",
];
const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Pharm", "Prof"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const collection = "Staff";
const searchFields = ["Name", "Rank", "Email", "Location"];
const staffList = ref([]);

const model = ref({});

function setModel(s) {
  model.value = s;
}
//const active = ref(staff.value?.Active)
const staff = computed({
  get: () => model.value || {},
  set: (val) => {
    model.value = val;
  },
});

const userList = computed({
  get: () => staffList.value,
  set: (v) => {
    staffList.value = v;
  },
});
const StaffId = computed({
  get: () => staff.value?.StaffId?.toUpperCase(),
  set: (v) => (staff.value.StaffId = v.toUpperCase()),
});
const status = computed({
  get: () => staff.value.Status || "Active",
  set: (v) => (staff.value.Status = v),
});
const isAdmin = computed({
  get: () => staff.value.IsAdmin || undefined,
  set: (v) => (staff.value.IsAdmin = v),
});
async function onAdminStatusChanged() {
  if (!staff.value.id) return;
  loading.value = true;
  update(staff.value.id, { IsAdmin: isAdmin.value }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "User admin status updated",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e);
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
async function onStatusChanged() {
  if (!staff.value.id) return;
  loading.value = true;
  update(staff.value.id, { Status: status.value }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "User status updated",
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
  if (!staff.value.id) return;
  loading.value = true;
  update(
    staff.value.id,
    {
      Status: status.value,
      Rank: staff.value.Rank,
      Role: staff.value.Role,
      Heads: staff.value.Heads || [],
      Units: staff.value.Units || [],
      Location: staff.value.Location,
      //Admin: isAdmin.value,
      //CanEditPayment: staff.value.CanEditPayment || false,
      //CanConfirmPayment: staff.value.CanConfirmPayment || false,
      CanReceiveMail: staff.value.CanReceiveMail || false,
    },
    "Users"
  )
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "User status updated",
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
  const _fields = ["Name", "StaffId", "Rank"].map((f) => staff.value[f]);
  const meta = {
    search: addSearch(_fields),
  };
  createUser({ ...staff.value, meta })
    .then((result) => {
      staff.value.id = result.data;
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
/*function filter(val) {
  const needle = val?.toLowerCase() || "";
  if (!needle || needle.trim().length === 0) {
    userList.value = store.staffList;
    return userList.value;
  }
  const filtered = store.staffList?.filter((v) => {
    return (
      v.Email?.toLowerCase().indexOf(needle) > -1 ||
      v.Location?.toLowerCase().indexOf(needle) > -1 ||
      v.Name?.toLowerCase().indexOf(needle) >= 0
    );
  });
  userList.value = filtered;
  return filtered;
}*/
function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

//watch(searchText, (val) => filter(val), { immediate: true });

const handleSearch = debounce(async (d, active) => {
  const whereFilters = [["Level", "==", 3]];
  if (active) whereFilters.push(["Status", "==", "Active"]);
  const _users = await lifeSearch("Users", {
    searchText: d,
    whereFilters,
    limits: 100,
  });
  staffList.value = _users;
}, 500);

defineExpose({
  reset,
  validate,
});
onMounted(async () => {
  if (staff.value.Status === undefined) {
    staff.value.Status = "Active";
  }
  if (staff.value.IsAdmin === undefined) {
    staff.value.IsAdmin = false;
  }
  handleSearch("", true);
});
</script>

<style scoped></style>
