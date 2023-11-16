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
    icon-name="perm_identity"
  >
    <q-form ref="form" class="q-gutter-sm">
      <q-input
        v-model="searchText"
        type="text"
        label="Search..."
        outlined
        rounded
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Display Name</label>
      <q-input
        outlined=""
        v-model="user.displayName"
        type="text"
        :disable="true"
        square
      />
      <q-separator spaced inset vertical dark />
      <label>Email</label>
      <q-input
        outlined=""
        v-model="user.email"
        type="text"
        :disable="true"
        square
      />
      <q-separator spaced inset vertical dark />
      <label>Phone</label>
      <q-input
        outlined
        v-model="user.phoneNumber"
        type="text"
        :disable="true"
        square
      />
      <div align="left" class="q-pa-sm">
        <q-separator spaced inset vertical dark />
        <q-toggle v-model="isAdmin" color="green" label="Admin" />
        <q-toggle v-model="disabled" color="green" label="Disabled" />
        <q-separator spaced inset vertical dark />
      </div>
      <q-toolbar
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
      </q-toolbar>
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
import SearchAuto from "src/components/AutoComplete.vue";

const store = useDefaultStore();
const model = ref();
const form = ref(null);
const disabled = ref(false);
const isAdmin = ref(false);
const loading = ref(false);
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

function filter(val) {
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
}
function save() {
  store.loading = true;
  setUserRights({
    Disabled: disabled.value,
    IsAdmin: isAdmin.value,
    uid: user.value.uid,
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
watch(user, (u) => {
  isAdmin.value = u.customClaims?.admin;
  disabled.value = u.disabled;
});
watch(searchText, (val) => filter(val));
watchEffect(async () => {
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
});
onMounted(() => {
  disabled.value = false;
  isAdmin.value = false;
});
defineExpose({
  reset,
  validate,
});
</script>
