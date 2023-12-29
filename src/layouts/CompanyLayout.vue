<template>
  <q-layout view="lHh Lpr lFf">
    <default-header />
    <q-drawer
      side="left"
      show-if-above=""
      v-model="store.leftDrawerOpen"
      :breakpoint="800"
      :width="$q.screen.width > 800 ? 380 : $q.screen.width"
      :class="$q.dark.isActive ? 'bg-grey-9' : store.theme.bg.normal"
      class="fits text-white"
    >
      <q-item>
        <q-item-section avatar>
          <q-icon color="white" name="person" />
        </q-item-section>
        <q-item-section>{{ store.user?.displayName }}</q-item-section>
        <q-item-section side top
          ><q-btn
            flat
            dense
            color="white"
            :icon="$q.screen.gt.xm ? 'arrow_right' : 'close'"
            @click="store.leftDrawerOpen = false"
        /></q-item-section>
      </q-item>

      <q-scroll-area class="fits">
        <q-expansion-item
          v-model="expanded"
          expand-separator
          expand-icon-class="text-white"
          icon="people"
          label="Accounts"
          :default-opened="true"
        >
          <q-list dense class="q-pl-md">
            <q-item
              clickable
              v-ripple
              active-class="text-yellow"
              :active="account.id === active"
              @click="navigateTo(account, true)"
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
                  size="sm"
                  color="white"
                  icon="visibility"
                  @click.stop="showCompanyPopup(account)"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-btn
          flat
          no-caps=""
          color="white"
          icon="add"
          label="Add new company account"
          class="full-width"
          align="left"
          @click="showCompanyPopup({})"
        />
      </q-scroll-area>
      <q-item clickable to="/petitions" class="bg-cyan- text-white q-mt-sm">
        <q-btn
          push
          flat
          unelevated
          square
          no-caps=""
          color="white"
          icon="campaign"
          icon-right="arrow_forward"
          label="Submit petition or complaint"
          class="full-width"
          to="/petitions"
          align="left"
        />
        <q-space />
      </q-item>
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
            <CompanyForm ref="coyFormRef" :data="company" />
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" class="bg-teal-8">
          <q-btn
            unelevated
            icon="check"
            label="Submit"
            color="cyan-8"
            class="q-mr-xs"
            :loading="loading"
            @click="addCompany"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Saving...
            </template>
          </q-btn>
          <q-btn
            unelevated
            icon="close"
            label="Cancel"
            color="negative"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container>
      <div
        class="q-pb-xl"
        :class="store.theme.bg.dark"
        style="height: calc(100vh - 64px)"
      >
        <q-toolbar class="bg-purple text-white">
          <q-tabs
            v-model="tab"
            class="text-"
            inline-label=""
            narrow-indicator=""
          >
            <q-route-tab
              to="/applications/destructions"
              icon="mail"
              label="Destructions"
              :tabindex="1"
            />
            <q-route-tab
              to="/applications/petitions"
              icon="announcement"
              label="Petitions"
              :tabindex="2"
            />
          </q-tabs>
        </q-toolbar>
        <router-view></router-view>
      </div>
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, onBeforeMount, ref, watch } from "vue";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import { create, update } from "src/composables/remote";
//import { useStates, useCities } from "src/composables/address-use";
import DefaultHeader from "./DefaultHeader.vue";
import DefaultFooter from "./DefaultFooter.vue";
import CompanyForm from "src/components/forms/CompanyForm.vue";

const $q = useQuasar();
const db = firestore;
const router = useRouter();
const route = useRoute();
const active = ref("");
const company = ref({});
const store = useDefaultStore();
const companyPopupModel = ref(false);
const coyFormRef = ref(null);
const expanded = ref(true);
const loading = ref(false);
const accountCollection = collection(db, "Companies");
const accountDatasource = computed(() =>
  query(accountCollection, where("uid", "==", store.user.uid))
);
//const collectionRef =
const accounts = useCollection(accountDatasource);
const tab = ref("destructions");

function navigateTo(account, home) {
  active.value = account.id;
  company.value = account;
  store.company = account;
  if (home) router.push("/applications");
}
function showCompanyPopup(coy) {
  company.value = coy;
  companyPopupModel.value = true;
  //store.company = coy;
}
async function addCompany() {
  const validated = await coyFormRef.value.validate();
  if (validated) {
    loading.value = true;
    if (company.value?.id) {
      let d = Object.assign({}, coyFormRef.value.data);
      update(company.value.id, d, "Companies")
        .then(() => {
          companyPopupModel.value = false;
        })
        .catch((e) => {
          console.trace(e);
          Dialog.create({
            title: "Error",
            message: e.message,
            color: "red",
          });
        })
        .finally(() => (loading.value = false));
    } else {
      const coy = coyFormRef.value.data;
      coy.uid = store.user.uid;
      const searchFields = ["Name", "Address", "City", "State"];
      create(coy, "Companies", searchFields)
        .then((resp) => {
          companyPopupModel.value = false;
        })
        .catch((e) => {
          console.trace(e);
          Dialog.create({
            title: "Error",
            message: e.message,
            color: "red",
          });
        })
        .finally(() => (loading.value = false));
    }
  }
  /*try {
    const coy = coyFormRef.value.data;
    coy.uid = store.user.uid;
    const searchFields = ["Name", "Address", "City", "State"];
    const resp = await create(coy, "Companies", searchFields);
    //company.value.id = resp.id;
    companyPopupModel.value = false;
  } catch (e) {
    $q.dialog({
      title: "Error",
      message: e.message,
      color: "red",
    });
  }*/
}
onBeforeMount(() => {
  //router.push("/applications/destructions")
  if (route.name != "Petitions" && route.path != "/applications/destructions") {
    router.push("/applications/destructions");
  }
});
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
  height: calc(100vh - 140px);
}
</style>
