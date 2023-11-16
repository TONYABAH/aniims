<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-9">
    <default-header />
    <q-drawer
      side="left"
      show-if-above=""
      v-model="store.leftDrawerOpen"
      :width="$q.screen.width > 600 ? 380 : $q.screen.width"
      class="fit bg-blue-grey-10 text-white"
    >
      <q-item>
        <q-item-section avatar>
          <q-icon color="white" name="perm_identity" />
        </q-item-section>
        <q-item-section>{{ store.user?.displayName }}</q-item-section>
        <q-item-section side top
          ><q-btn
            flat
            color="white"
            :icon="$q.screen.gt.xm ? 'arrow_right' : 'close'"
            @click="store.leftDrawerOpen = false"
        /></q-item-section>
      </q-item>

      <q-scroll-area class="fits">
        <q-expansion-item
          expand-separator
          expand-icon-class="text-white"
          icon="arrow_right"
          label="Accounts"
          :default-opened="true"
        >
          <q-list dense bordered class="q-pl-md">
            <q-item
              clickable
              v-ripple
              active-class="text-yellow"
              :active="account.id === active"
              @click="navigateTo(account)"
              v-for="(account, i) of accounts"
              :key="i"
            >
              <q-item-section side>
                <q-icon color="amber" name="company" />
              </q-item-section>
              <q-item-section>{{ account.Name }}</q-item-section>
              <q-item-section avatar
                ><q-btn
                  flat
                  color="white"
                  icon="arrow_right"
                  @click="showCompanyPopup(company)"
              /></q-item-section>
            </q-item>
            <q-btn
              flat
              no-caps=""
              color="white"
              icon="add"
              label="Add new company account"
              @click="showCompanyPopup({})"
            />
          </q-list>
        </q-expansion-item>
      </q-scroll-area>
    </q-drawer>
    <q-dialog v-model="companyPopupModel">
      <q-card
        class="full-width full-height"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-yellow-1'"
        style="overflow: hidden"
      >
        <q-toolbar class="bg-teal text-white">
          <q-icon name="location" color="white" />
          <q-toolbar-title> Company Account </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-scroll-area
            style="
              width: 100%;
              height: calc(100vh - 180px);
              padding-right: 32px;
            "
            :visible="true"
          >
            <q-card flat class="my-card bg-transparent">
              <q-form ref="form" class="q-gutter-sm q-mb-md">
                <q-input
                  filled
                  v-model="company.RegNumber"
                  type="text"
                  label="CAC registration number *"
                />
                <q-input
                  filled
                  v-model="company.Name"
                  type="text"
                  label="Company name *"
                />

                <q-input
                  filled
                  v-model="company.Email"
                  type="text"
                  label="Company email *"
                />
                <q-input
                  filled
                  v-model="company.Phone"
                  type="text"
                  label="Company phone *"
                />
                <q-input
                  filled
                  v-model="company.Address"
                  type="text"
                  label="Company address *"
                />

                <q-select
                  optionsDense=""
                  v-model="company.State"
                  :options="states"
                  label="State *"
                  filled
                />
                <q-select
                  optionsDense=""
                  v-model="company.City"
                  :options="cities"
                  label="City *"
                  filled
                />
                <q-toolbar>
                  <q-space />
                  <q-btn
                    flat
                    icon="check"
                    label="Submit"
                    color="primary"
                    class="q-mr-xs"
                    @click="addCompany"
                  />
                  <q-btn
                    flat
                    icon="close"
                    label="Cancel"
                    color="negative"
                    v-close-popup
                  />
                  <q-space />
                </q-toolbar>
              </q-form>
            </q-card>
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="right" class="bg-teal-8">
          <q-btn flat label="Close" icon="clear" color="grey-1" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, ref, watch } from "vue";
import { create } from "src/composables/remote";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultFooter from "./DefaultFooter.vue";
import { useStates, useCities } from "../composables/address-use";

const $q = useQuasar();
//const leftDrawerOpen = ref(true);
const active = ref("");
const company = ref({});
const store = useDefaultStore();
const companyPopupModel = ref(false);
const db = firestore;
const accountCollection = collection(db, "Companies");

const states = useStates("Nigeria");
const cities = computed(() => useCities(company.value.State));

const accountDatasource = computed(() =>
  query(accountCollection, where("uid", "==", store.user.uid))
);
//const collectionRef =
const accounts = useCollection(accountDatasource);

function navigateTo(account) {
  active.value = account.id;
  company.value = account;
  store.company = account;
}
function showCompanyPopup(coy) {
  //company.value = coy;
  companyPopupModel.value = true;
  //store.company = coy;
}
async function addCompany() {
  try {
    company.value.uid = store.user.uid;
    const searchFields = ["Name", "Address", "City", "State"];
    const resp = await create(company.value, "Companies", searchFields);
    company.value.id = resp.data.id;
    companyPopupModel.value = false;
  } catch (e) {
    $q.dialog({
      title: "Error",
      message: e.message,
      color: "red",
    });
  }
}
onMounted(() => {});
watch(
  accounts,
  (val) => {
    if (val && val.length > 0) navigateTo(val[0]);
  },
  { immediate: false }
);
</script>

<style scoped>
.fits {
  height: calc(100vh - 160px);
}
</style>
