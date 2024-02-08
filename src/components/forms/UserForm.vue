<template>
  <AdminViewer
    :set-model="setModel"
    :selected="user"
    :title="collection"
    :collection="collection"
    :search-fields="['Name', 'Phone']"
    :list="users"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-save="save"
    :loading="loading"
    icon-name="perm_identity"
  >
    <q-form ref="form" class="q-gutter-xs">
      <q-input
        outlined
        v-model="user.displayName"
        type="text"
        :disable="true"
        label="Display Name"
      />

      <q-input
        outlined
        dense=""
        v-model="user.email"
        type="text"
        :disable="true"
        label="Email"
      />

      <q-input
        outlined
        dense
        v-model="user.phoneNumber"
        type="text"
        :disable="true"
        label="Phone"
      />
      <q-separator spaced inset vertical dark />
      <label class="text-uppercase"
        >Status:
        <q-radio v-model="disabled" :val="false" label="Active" color="teal" />
        <q-radio v-model="disabled" :val="true" label="Disable" color="grey" />
      </label>
      <q-separator spaced inset vertical dark />
      <div
        style="display: flex; flex-direction: column"
        v-if="user.customClaims?.level === 3"
      >
        <label class="text-uppercase">Previledges</label>
        <q-checkbox
          right-label
          v-model="isAdmin"
          indeterminate-icon=""
          label="Is Admin"
        />
        <q-checkbox
          right-label
          v-model="canEditPay"
          indeterminate-icon=""
          label="Can Edit Payment"
        />
        <q-checkbox
          right-label
          v-model="canConfirmPay"
          indeterminate-icon=""
          label="Can Confirm Payment"
        />
        <q-checkbox
          right-label
          v-model="canEditMail"
          indeterminate-icon=""
          label="Can Receive Mail"
        />
        <q-checkbox
          right-label
          v-model="canDestroy"
          indeterminate-icon=""
          label="Handle Destruction"
        />
      </div>
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { debounce } from "quasar";
import { Notify, Dialog } from "quasar";
import { onMounted, watch, watchEffect, ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import { setUserRights } from "src/composables/functions";
import AdminViewer from "src/views/AdminViewer.vue";
import { listUsers, getUser } from "src/composables/functions";
import { addSearch, lifeSearch } from "src/composables/searchProvider";

const store = useDefaultStore();
const model = ref();
const form = ref(null);
const disabled = ref(false);
const isAdmin = ref(false);
const canEditPay = ref(false);
const canConfirmPay = ref(false);
const canEditMail = ref(false);
const canDestroy = ref(false);
const collection = "Users";
const _list = ref([]);
const users = ref([]);
const loading = ref(false);

const user = computed({
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
async function setModel(val) {
  const u = await getUser({ uid: val.uid });
  //console.log(u.data);
  model.value = u.data;
}
function save() {
  loading.value = true;
  const { units, level, location, role } = user.value.customClaims;

  setUserRights({
    Disabled: disabled.value,
    IsAdmin: isAdmin.value,
    uid: user.value.uid,
    claims: {
      units,
      level,
      location,
      role,
      admin: isAdmin.value,
      editpay: canEditPay.value,
      editmail: canEditMail.value,
      confirmpay: canConfirmPay.value,
      candestroy: canDestroy.value,
    },
  })
    .then((result) => {
      //console.log(result.data);
      Notify.create({
        timeout: 800,
        message: "User created successfully",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e.code, e.message);
      Notify.create({
        timeout: 2000,
        message: "There were errors. " + e.message,
        caption: "Update",
        color: "negative",
        textColor: "white",
        icon: "error",
        position: "right",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function reset() {
  form.value.resetValidation();
}
function validate() {
  return true;
}
watch(
  user,
  (u) => {
    if (!u) return;
    //console.log(u);
    isAdmin.value = u.customClaims?.admin || false;
    canEditPay.value = u.customClaims?.editpay || false;
    canConfirmPay.value = u.customClaims?.confirmpay || false;
    canEditMail.value = u.customClaims?.editmail || false;
    canDestroy.value = u.customClaims?.candestroy || false;
    disabled.value = u.disabled || false;
  },
  { immediate: true }
);
/*const __handleSearch = debounce(async (d) => {
  loading.value = true;
  listUsers()
    .then((users) => {
      let filtered = users?.data?.filter(
        (u) =>
          d === "" ||
          u.displayName?.toLowerCase().split(" ").includes(d.toLowerCase())
      );

      userList.value.splice(0, userList.value.length);

      filtered.forEach((v) => {
        let { customClaims, disabled, email, uid, displayName, phoneNumber } =
          v;
        userList.value.push({
          customClaims,
          disabled,
          email,
          uid,
          displayName,
          Name: displayName,
          phoneNumber,
        });
      });
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
      loading.value = false;
    });
}, 500);*/

const handleSearch = debounce(async (d, active) => {
  const whereFilters = [];
  //whereFilters.push(["Status", "==", "Active"]);
  const _users = await lifeSearch("Users", {
    searchText: d,
    whereFilters,
    orderByFilters: [
      ["Location", "asc"],
      ["Name", "asc"],
    ],
    limits: 100,
  });
  users.value = _users;
}, 500);

onMounted(() => {
  disabled.value = false;
  isAdmin.value = false;
  handleSearch("", true);
});
defineExpose({
  reset,
  validate,
});
</script>
