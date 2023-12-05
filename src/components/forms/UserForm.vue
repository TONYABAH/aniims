<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="['Name', 'Phone']"
    :selected="user"
    :list="userList"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-save="save"
    icon-name="perm_identity"
  >
    <q-form ref="form" class="q-gutter-sm">
      <!--<q-input
        v-model="searchText"
        type="text"
        label="Search..."
        outlined
        filled
        dense
        rounded
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>-->
      <q-separator spaced inset vertical dark />
      <label>Display Name</label>
      <q-input
        outlined
        filled
        dense=""
        v-model="user.displayName"
        type="text"
        :disable="true"
      />
      <q-separator spaced inset vertical dark />
      <label>Email</label>
      <q-input
        outlined
        filled
        dense=""
        v-model="user.email"
        type="text"
        :disable="true"
      />
      <q-separator spaced inset vertical dark />
      <label>Phone</label>
      <q-input
        outlined
        filled
        dense
        v-model="user.phoneNumber"
        type="text"
        :disable="true"
      />
      <q-separator spaced inset vertical dark size="40px" />
      <label>Status</label>
      <q-separator spaced inset vertical dark />
      <q-checkbox
        right-label
        v-model="disabled"
        indeterminate-icon=""
        label="Disabled"
      />
      <q-separator spaced inset vertical dark />
      <label>Previledges</label>
      <div
        style="display: flex; flex-direction: column"
        v-if="user.customClaims?.level === 3"
      >
        <!--<q-checkbox left-label v-model="isActive" label="Active" />-->
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
      <!--<q-toolbar
        class="bg- text- q-mt-md"
        style="
          border-top: 1px solid #777;
          border-bottom: 1px solid #777;
          border-radius: 0px;
        "
        v-if="user.uid"
      >
        <q-space />
        <q-btn
          unelevated=""
          icon="check"
          label="Save changes"
          class="q-mr-xs"
          @click="save"
          color="teal"
        />
      </q-toolbar>-->
    </q-form>
  </AdminViewer>
</template>

<script setup>
//import { debounce } from "quasar";
import { Notify, Dialog } from "quasar";
import { onMounted, watch, watchEffect, ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import { setUserRights } from "src/composables/functions";
import AdminViewer from "src/views/AdminViewer.vue";
import { listUsers } from "src/composables/functions";
//import SearchAuto from "src/components/AutoComplete.vue";

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
const allUsers = ref([]);
const searchText = ref("");

/*const props = defineProps({
  setModel: Function,
  selected: Object,
});*/

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
function setModel(val) {
  model.value = val;
}

/*function filter(val) {
  const needle = val?.toLowerCase() || "";
  if (!needle || needle.trim().length === 0) {
    userList.value = allUsers.value;
    return userList.value;
  }
  const filtered = allUsers.value?.filter((v) => {
    return (
      //v.email?.toLowerCase().indexOf(needle) > -1 ||
      //v.phone?.toLowerCase().indexOf(needle) > -1 ||
      v.displayName?.toLowerCase().indexOf(needle) >= 0
    );
  });
  userList.value = filtered;
  return filtered;
}*/
function save() {
  store.loading = true;
  const {
    //displayName: displayName || email,
    units,
    level,
    //admin,
    location,
    role,
  } = user.value.customClaims;
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
      store.loading = false;
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
//watch(searchText, (val) => filter(val));
/*watchEffect(async () => {
  const all = (await listUsers())?.data || [];
  allUsers.value = all;

  all.forEach((v) => {
    let { customClaims, disabled, email, uid, displayName, phoneNumber } = v;
    userList.value.push({
      customClaims,
      disabled,
      email,
      uid,
      displayName,
      phoneNumber,
    });
  });
});*/

const handleSearch = debounce(async (d) => {
  store.loading = true;
  //const all = (await listUsers())?.data || [];
  listUsers()
    .then((users) => {
      //console.log(JSON.stringify(data));
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
      store.loading = false;
    });
}, 500);

onMounted(() => {
  disabled.value = false;
  isAdmin.value = false;
});
defineExpose({
  reset,
  validate,
});
</script>
