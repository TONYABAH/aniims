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
    icon-name="perm_identity"
  >
    <q-form class="q-pb-sm q-gutter-sm" ref="form">
      <q-input
        v-model="searchText"
        type="text"
        label="Search name, email, location..."
        outlined
        rounded
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Title *</label>
      <q-select
        v-model="staff.Title"
        :options="TITLE_OPTIONS"
        options-dense=""
        outlined
        square
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
        square
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
        square
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
        square
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
        square
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
        square
        v-model="staff.Rank"
        type="text"
        name="rank"
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
        square
        name="location"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Units *</label>
      <q-select
        v-if="staff.Role !== 'Director'"
        outlined
        square
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
      <label>Select Divisions Headed *</label>
      <q-select
        outlined
        square
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
      <q-separator spaced inset vertical dark />
      <label>Role *</label>
      <q-select
        outlined
        square
        v-model="staff.Role"
        :options="roleOptions"
        options-dense=""
        name="role"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />

      <!--<q-checkbox left-label v-model="isActive" label="Active" />-->
      <q-checkbox right-label v-model="isAdmin" label="Admin" /><q-btn
        color="teal"
        label="Update"
        unelevated=""
        rounded
        flat
        @click="onAdminStatusChanged"
      />
      <q-select
        v-model="status"
        :options="STATUS_OPTIONS"
        options-dense=""
        label="Status"
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
            v-if="staff.id"
          ></q-btn>
        </template>
      </q-select>
      <q-toolbar class="q-mt-md bg-transparent" style="border-radius: 6px">
        <q-toolbar-title></q-toolbar-title>
        <q-btn
          unelevated=""
          class="q-mr-xs"
          color="negative"
          label="Update"
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
          @click.stop="save"
          :disable="!!staff.id"
        />
      </q-toolbar>
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { Notify, Dialog } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { createUser } from "src/composables/functions";
import { update } from "src/composables/remote";
import { validation } from "src/composables/use";
import AdminViewer from "src/views/AdminViewer.vue";

const form = ref(null);
const store = useDefaultStore();
const roleOptions = [
  "Director",
  "Head",
  "Regulatory",
  "Secretary",
  "Accountant",
  "Admin",
  "Press",
  "Legal",
  "Engineer",
];
const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Pharm", "Prof"];
const STATUS_OPTIONS = ["Active", "Deleted", "Deactivated"];
const collection = "Staff";
const searchFields = ["Name", "Rank", "Email", "Location"];
const _list = ref(store.staffList || []);
const allUsers = ref([]);
const searchText = ref("");

const model = ref({});

function setModel(s) {
  model.value = s;
}
const staff = computed({
  get: () => model.value || {},
  set: (val) => {
    model.value = val;
  },
});

const userList = computed({
  get: () => _list.value,
  set: (v) => {
    _list.value = v;
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
  get: () => staff.value.IsAdmin || false,
  set: (v) => (staff.value.IsAdmin = v),
});
async function onAdminStatusChanged() {
  if (!staff.value.id) return;
  store.loading = true;
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
      store.loading = false;
    });
}
async function onStatusChanged() {
  if (!staff.value.id) return;
  store.loading = true;
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
      store.loading = false;
    });
}
async function save() {
  if (!(await validate())) return;
  store.loading = true;
  createUser({ ...staff.value })
    .then((result) => {
      staff.value.id = result.data;
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
      store.loading = false;
    });
}
function filter(val) {
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
}
function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

watch(searchText, (val) => filter(val), { immediate: true });

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
});
</script>

<style scoped></style>
