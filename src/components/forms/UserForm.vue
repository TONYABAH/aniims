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
      <q-toolbar dense class="bg-transparent" v-if="user?.uid">
        <div v-if="$q.screen.gt.xs">
          <q-btn
            no-caps=""
            unelevated=""
            color="teal-8"
            label="Send password reset link"
            :loading="resetingPassword"
            @click="sendPasswordResetEmail(user)"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Wait...
            </template>
          </q-btn>
          <q-btn
            no-caps=""
            unelevated=""
            color="teal-8"
            label="Reset user password"
            class="q-ml-xs"
            :loading="resetingPassword"
            @click="() => generatePassword()"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Wait...
            </template>
          </q-btn>
<<<<<<< Updated upstream
          <!--<q-btn
            no-caps=""
            unelevated=""
            color="red"
            label="Delete account"
            class="q-ml-xs"
            :loading="deletingAccount"
            @click="deleteUserProfile(user)"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Wait...
            </template>
          </q-btn>-->
=======
>>>>>>> Stashed changes
        </div>
        <q-toolbar-title v-else class="text-uppercase">
          User account</q-toolbar-title
        >
        <q-space />
        <q-btn flat round dense icon="more_vert">
          <q-menu style="width: 240px">
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="sendPasswordResetEmail(user)"
              >
                <q-item-section avatar="">
                  <q-avatar
                    size="36px"
                    font-size="32px"
                    color=""
                    text-color="teal"
                    icon="mail"
                  />
                </q-item-section>
                <q-item-section>Send reset link</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="passwordDialog = true">
                <q-item-section avatar="">
                  <q-avatar
                    size="36px"
                    font-size="32px"
                    color=""
                    text-color="teal"
                    icon="key"
                  />
                </q-item-section>
                <q-item-section>Change password</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="deleteUserProfile(user)">
                <q-item-section avatar="">
                  <q-avatar
                    size="36px"
                    font-size="32px"
                    color=""
                    text-color="teal"
                    icon="delete"
                  />
                </q-item-section>
                <q-item-section>Delete account</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <q-input
        outlined
        v-model="user.displayName"
        type="text"
        label="Display Name"
      />
      <q-input outlined dense="" v-model="user.email" type="text" label="Email">
        <q-btn
          flat
          color=""
          label="Update"
          @click="updateUser({ email: user?.email })"
        />
      </q-input>

      <q-input
        outlined
        dense
        v-model="user.phoneNumber"
        type="text"
        label="Update"
      >
        <q-btn
          flat
          color=""
          label="Change"
          @click="updateUser({ phoneNumber: user?.phoneNumber })"
        />
      </q-input>
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

  <q-dialog v-model="passwordDialog">
    <q-card class="my-card">
      <q-card-section> </q-card-section>
      <q-card-section>
        <q-toolbar class="bg-transparent">
          <q-toolbar-title>
            <q-input
              v-model="newPassword"
              type="text"
              placeholder="New password"
              rounded=""
              outlined=""
              dense
            >
              <template v-slot:prepend>
                <q-btn flat icon="key" @click.stop="generatePassword()" />
              </template>
            </q-input>
          </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-card-section align="center">
        <q-btn
          unelevated=""
          no-caps
          label="Set password"
          color="pink"
          icon="check"
          v-close-popup
          @click.stop="resetPasswordForUser(user)"
        />
        <q-btn
          no-caps
          unelevated=""
          label="Cancel"
          color="orange"
          icon="close"
          class="q-ml-xs"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { debounce, Notify, Dialog } from "quasar";
import { onMounted, watch, ref, computed } from "vue";
import AdminViewer from "src/views/AdminViewer.vue";
import {
  getUser,
  resetPassword,
  updateUser,
  deleteUser,
  setUserRights,
} from "src/composables/functions";
import { sortByName } from "src/composables/searchProvider";
import { useCollection } from "vuefire";
import { query, collection, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";

const model = ref();
const form = ref(null);
const disabled = ref(false);
const isAdmin = ref(false);
const canEditPay = ref(false);
const canConfirmPay = ref(false);
const canEditMail = ref(false);
const canDestroy = ref(false);
const collectionId = "Users";
const newPassword = ref();
const loading = ref(false);
const deletingAccount = ref(false);
const resetingPassword = ref(false);
const passwordDialog = ref(false);
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
async function sendPasswordResetEmail(user) {
  let email = user?.email;
  Dialog.create({
    message: "Send user reset password?",
    title: "Reset password",
    ok: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    resetingPassword.value = true;
    await resetPassword({ uid: user.uid, email })
      .then((info) => {
        //console.log(info);
        Notify.create({
          message: "Success",
          caption: "Send password reset",
          color: "green",
          position: "center",
          html: true,
<<<<<<< Updated upstream
        });
        /*Dialog.create({
          message: "Success <br/>" + info,
          title: "Send password reset",
          color: "green",
          position: "center",
          html: true,
        });*/
=======
        })
>>>>>>> Stashed changes
      })
      .catch((e) => {
        console.log(e);
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
function generatePassword() {
  newPassword.value = Math.floor(Math.random() * 99999999).toString(16);
  passwordDialog.value = true;
}
async function resetPasswordForUser(user) {
  //let email = user?.email;
  Dialog.create({
    message: "Reset password for user?",
    title: "Reset password",
    ok: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    resetingPassword.value = true;
    updateUser({ uid: user.uid, password: newPassword.value })
      .then(() => {
        Dialog.create({
          title: "Password reset",
          caption: "Send password reset",
          message: `<div>Please copy and send the new password to user. </div><div>New password: ${newPassword.value}</div><br/>`,
          color: "green",
          position: "standard",

          html: true,
          persistent: true,
        });
      })
      .catch((e) => {
        console.trace(e);
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
async function deleteUserProfile(user) {
  let uid = user?.uid;
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
          position: "standard",
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
