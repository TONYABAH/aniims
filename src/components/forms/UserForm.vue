<template>
  <AdminViewer
    :set-model="setModel"
    :selected="user"
    :title="collectionId"
    :collection="collectionId"
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
      <q-bar class="bg-transparent" v-if="user?.uid">
        <q-space />
        <q-btn
          no-caps=""
          unelevated=""
          color="teal-8"
          label="Password reset"
          :loading="resetingPassword"
          @click="sendPasswordResetEmail(user?.email)"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Wait...
          </template>
        </q-btn>
        <q-separator spaced inset vertical dark />
        <q-btn
          no-caps=""
          unelevated=""
          color="red"
          label="Delete account"
          :loading="deletingAccount"
          @click="deleteUserProfile(user?.uid)"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Wait...
          </template>
        </q-btn>
      </q-bar>

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
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        label="Previledges"
        caption="User rights"
      >
        <div
          style="display: flex; flex-direction: column"
          v-if="user.customClaims?.level === 3"
          class="q-pa-sm bg-pink-2"
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
      </q-expansion-item>

      <q-separator spaced inset vertical dark />
      <label class="text-uppercase"
        >Status:
        <q-radio v-model="disabled" :val="false" label="Active" color="teal" />
        <q-radio v-model="disabled" :val="true" label="Disable" color="grey" />
      </label>
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { debounce, Notify, Dialog } from "quasar";
import { onMounted, watch, ref, computed } from "vue";
import AdminViewer from "src/views/AdminViewer.vue";
import {
  getUser,
  resetPassword,
  deleteUser,
  setUserRights,
} from "src/composables/functions";
import { sortByName } from "src/composables/searchProvider";
import { useCollection } from "vuefire";
import { query, collection, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
//import LoadingButton from "../LoadingButton.vue";
//import { deleteDoc } from "firebase/firestore";
//const store = useDefaultStore();
const model = ref();
const form = ref(null);
const disabled = ref(false);
const isAdmin = ref(false);
const canEditPay = ref(false);
const canConfirmPay = ref(false);
const canEditMail = ref(false);
const canDestroy = ref(false);
const collectionId = "Users";

const loading = ref(false);
const deletingAccount = ref(false);
const resetingPassword = ref(false);
var allUsers = [];
const users = ref([]);

const user = computed({
  get: () => model.value || {},
  set: (val) => {
    model.value = val;
  },
});

async function setModel(val) {
  const u = val?.uid ? await getUser({ uid: val.uid }) : null;
  model.value = u?.data || {};
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
async function sendPasswordResetEmail(email) {
  //let email = user.value?.email;
  Dialog.create({
    message: "Send user reset password?",
    title: "Reset password",
    ok: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    resetingPassword.value = true;
    await resetPassword({ email })
      .then(() => {
        Notify.create({
          message: "Success",
          caption: "Send password reset",
          color: "green",
          position: "center",
        });
      })
      .catch((e) => {
        Notify.create({
          message: e.message,
          caption: "Send password reset",
          color: "red",
        });
      })
      .finally(() => (resetingPassword.value = false));
    //console.log(result);
  });
}
async function deleteUserProfile() {
  let uid = model.value?.uid;
  //let email = user.value?.email;
  //console.log(model.value);
  Dialog.create({
    message: "Delete user profile?",
    title: "Delete user",
    ok: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    deletingAccount.value = true;
    deleteUser({ uid })
      .then(() => {
        let index = users.value.findIndex((u) => u.uid === user.value.uid);
        users.value.splice(index, 1);
        user.value = null;
        Notify.create({
          message: "Success",
          caption: "Delete user",
          color: "green",
          position: "center",
        });
      })
      .catch((e) => {
        Notify.create({
          message: e.message,
          caption: "Delete user",
          color: "red",
        });
      })
      .finally(() => (deletingAccount.value = false));
    //console.log(result);
  });
}
watch(
  user,
  (u) => {
    if (!u) return;
    //console.log(JSON.stringify(u));
    isAdmin.value = u.customClaims?.admin || false;
    canEditPay.value = u.customClaims?.editpay || false;
    canConfirmPay.value = u.customClaims?.confirmpay || false;
    canEditMail.value = u.customClaims?.editmail || false;
    canDestroy.value = u.customClaims?.candestroy || false;
    disabled.value = u.disabled || false;
  },
  { immediate: true }
);

const handleSearch = debounce(async (d, active) => {
  users.value = [];
  if (!d || d.length === 0) return;
  let searchTerms = d.split(" ");
  users.value = allUsers.value
    .filter((u) => {
      for (let x of searchTerms) {
        let m = u.Name.toLowerCase().search(x.toLowerCase());
        if (m > -1) {
          //users.value.push(u);
          return u;
        }
      }
    })
    .sort(sortByName);
});

const dbRef = collection(firestore, collectionId);
const dataSource = query(dbRef, where("Status", "==", "Active"));
allUsers = useCollection(dataSource);

onMounted(() => {
  disabled.value = false;
  isAdmin.value = false;
  //handleSearch("", true);
});
defineExpose({
  reset,
  validate,
});
</script>
