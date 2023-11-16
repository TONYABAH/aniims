<template>
  <!--<q-card square="" class="q-ma-sm q-mt-lg q-mx-xs">
    <div class="row q-col-gutter-md">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-toolbar>
          <search-auto
            :model="model"
            :min-chars="0"
            :auto-select="true"
            :options="userList"
            :set-model="setModel"
            :filter="filter"
            input-debounce="0"
            option-value="email"
            option-label="email"
            rounded
            outlined
            dense
            class="q-mb-xs full-width"
          />
        </q-toolbar>
        <q-list dense class="full-width">
          <q-item
            clickable
            v-ripple
            v-for="(u, i) of userList"
            :key="i"
            @click="setModel(u)"
          >
            <q-item-section thumbnail top>
              <q-icon color="primary" name="perm_identity" class="q-ml-sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ u.displayName }}</q-item-label>
              <q-item-label> {{ u.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
        <q-card flat class="my-card">
          <q-toolbar>
            <q-btn falt unelevated="" icon="perm_identity" />
            <div class="col text-left text-weight-bold">Manage User</div>
          </q-toolbar>
          <q-card-section>
            <UserForm
              ref="formRef"
              :selected="selectedUser"
              :setModel="setModel"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card>-->
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="['Name', 'Phone']"
    :selected="selectedUser"
    :list="userList"
    icon-name="perm_identity"
    :reset="reset"
    :validate="validate"
  >
    <q-toolbar>
      <search-auto
        :model="model"
        :min-chars="0"
        :auto-select="true"
        :options="userList"
        :set-model="setModel"
        :filter="filter"
        input-debounce="0"
        option-value="email"
        option-label="email"
        rounded
        outlined
        dense
        class="q-mb-xs"
      />
    </q-toolbar>
    <UserForm ref="formRef" :selected="selectedUser" :setModel="setModel" />
  </AdminViewer>
</template>
<script setup>
import { ref, computed, watchEffect } from "vue";
import UserForm from "src/components/forms/UserForm.vue";
import { listUsers } from "src/composables/functions";
import SearchAuto from "src/components/AutoComplete.vue";
import AdminViewer from "src/views/AdminViewer.vue";

//const store = useDefaultStore();
const formRef = ref(null);
const selectedUser = ref({});
const model = ref();
const collection = "Users";
const _list = ref([]);
const allUsers = ref([]);

const userList = computed({
  get: () => _list.value,
  set: (v) => {
    _list.value = v;
  },
});
function setModel(u) {
  selectedUser.value = u;
}
function filter(val) {
  const needle = val?.toLowerCase() || "";
  if (!needle) {
    filtered.value = allUsers.value;
  }
  const filtered = allUsers.value?.filter((v) => {
    return (
      v.email?.toLowerCase().indexOf(needle) > -1 ||
      v.phone?.toLowerCase().indexOf(needle) > -1 ||
      (v.displayName?.toLowerCase().length > 5 &&
        v.displayName?.toLowerCase().indexOf(needle) === 0)
    );
  });
  userList.value = filtered;
  return filtered;
}
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
function reset() {
  formRef.value.reset();
}
function validate() {
  return formRef.value.validate(true);
}
defineExpose({
  reset,
  validate,
});
</script>
