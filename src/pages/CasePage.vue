<template>
  <q-layout view="HHh Lpr FFf">
    <default-header />
    <q-page-container>
      <q-splitter
        v-model="splitterModel"
        style="width: 100%; height: 100vh"
        unit="%"
        :vertical="$q.screen.gt.xs"
        :horizontal="$q.screen.lt.sm"
        :limits="[20, 80]"
      >
        <template v-slot:before>
          <q-expansion-item
            expand-separator
            expand-icon="arrow_right"
            icon="search"
            label="Filter"
            class="text-teal q-ma-xs q-pb-xs"
            style="border-radius: 4px"
            header-style="font-size:16px;"
          >
            <!-- <q-btn-dropdown
              unelevated=""
              size="md"
              :label="selectedYear"
              color=""
            >
              <q-list dense>
                <q-item
                  v-for="(item, i) of year_options"
                  :key="i"
                  clickable
                  v-close-popup
                  @click="onSelectYear(item)"
                >
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>-->
            <q-select
              v-model="selectedYear"
              :options="year_options"
              label="Year started"
              options-dense
              outlined
              class="q-mx-sm q-my-sm"
              color="teal"
              clear-icon="clear"
              clearable
            />
            <q-select
              v-model="statusModel"
              :options="status_options"
              label="Status"
              options-dense
              outlined
              class="q-mx-sm"
              color="teal"
              clear-icon="clear"
              clearable
            />
            <!--<StaffInput
              :model="selectedUser"
              :setModel="onSelectUser"
              :searchOptions="staffSearchOptions"
              dark
              outlined
              color="white"
              label="Staff"
              class="q-mx-sm q-mt-sm"
            />-->
            <IpoInput
              :model="selectedIpo"
              :setModel="onSelectIpo"
              :search-options="ipoSearchOptions"
              outlined
              color="teal"
              label="IPO"
              class="q-mx-sm q-my-sm"
            />
          </q-expansion-item>

          <q-list v-if="cases?.length > 0" class="list-panel q-mt-xs">
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of cases"
              :key="i"
              :active-class="'bg-' + store.theme?.color?.default"
              @click="selectCase(item)"
            >
              <q-item-section thumbnail top class="q-px-sm">
                {{ cases.length - i }}.
              </q-item-section>
              <q-item-section top>{{ item.Title }}</q-item-section>
            </q-item>
          </q-list>
          <q-banner v-else class="text-italic"> No cases to show... </q-banner>
          <!--<q-list bordered class="text-white">
            <q-item clickable v-ripple v-for="(item, i) of staffList" :key="i">
              <q-item-section avatar>
                <q-icon color="white" name="person" />
              </q-item-section>
              <q-item-section>{{ item.Name }}</q-item-section>
            </q-item>
          </q-list>-->
        </template>
        <template v-slot:separator>
          <q-avatar
            color=""
            text-color="cyan"
            size="40px"
            icon="drag_indicator"
          />
        </template>
        <template v-slot:after>
          <q-bar>
            <q-toolbar-title>{{ Case?.Title }}</q-toolbar-title>
            {{ store.user?.displayName }}
          </q-bar>
          <q-card
            square
            class="my-card shadow-22"
            style="height: calc(100vh - 120px); overflow: auto"
          >
            <q-card-section>
              <q-toolbar
                style="padding-left: 0; padding-right: 0"
                v-if="!shouldDisable"
              >
                <q-tabs
                  v-model="tab"
                  dense
                  narrow-indicator=""
                  shrink=""
                  mobile-arrows=""
                  outside-arrows=""
                  inline-label=""
                  :class="$q.dark.isActive ? 'text-grey-1' : 'text-teal-8'"
                  align="left"
                >
                  <q-tab name="form" icon="cases" label="View" />
                  <q-tab
                    name="reports"
                    icon="edit"
                    label="Reports"
                    :disable="shouldDisable"
                  />
                  <q-tab
                    name="minutes"
                    icon="comment"
                    title="Minute"
                    :label="$q.screen.lt.sm ? '' : 'Minutes'"
                    style="border-radius: 4px 4px 0 0"
                    :disable="shouldDisable"
                  />
                  <q-tab
                    name="suspects"
                    icon="perm_identity"
                    label="Suspects"
                    :disable="false"
                  />
                  <!--<q-tab
                    name="timeline"
                    icon="timer"
                    title="Timeline"
                    :label="$q.screen.lt.sm ? '' : 'Timeline'"
                    style="border-radius: 4px 4px 0 0"
                    :disable="shouldDisable"
                  />
                  <q-tab
                    name="complaint"
                    icon="phone"
                    label="Complaint"
                    :disable="!complaint?.id && shouldDisable"
                  />
                  <q-tab
                    name="samples"
                    icon="sample"
                    label="Samples"
                    :disable="!complaint?.id && shouldDisable"
                  />-->
                </q-tabs>
              </q-toolbar>
              <q-banner v-else class="bg-transparent text-italic">
                No Case selected. Select a case to view items...
              </q-banner>
              <q-tab-panels
                v-model="tab"
                animated
                vertical=""
                keep-alive=""
                transition-next="scale"
                transition-prev="scale"
                class="bg-"
              >
                <q-tab-panel
                  name="form"
                  style="padding-left: 0; padding-right: 0"
                >
                  <CaseForm
                    ref="formRef"
                    :model="Case"
                    :setModel="setDocument"
                  />
                </q-tab-panel>

                <!--<q-tab-panel
                  name="complaint"
                  style="padding-left: 0; padding-right: 0"
                >
                  <ComplaintForm ref="complaintFormRef" :data="complaint" />
                </q-tab-panel>
                <q-tab-panel
                  name="samples"
                  style="padding-left: 0; padding-right: 0"
                >
                  <TableView
                    :editable="true"
                    :data="samples"
                    :columns="columns"
                    :deleteBtn="false"
                    title="Samples"
                  />
                </q-tab-panel>-->
                <q-tab-panel
                  name="suspects"
                  style="padding-left: 0; padding-right: 0"
                >
                  <TableView
                    :editable="true"
                    :data="suspects"
                    :columns="doc_columns"
                    :onAddItem="() => handleSuspectPopup({})"
                    :onRemoveItem="(data, index) => removeSuspect(data, index)"
                    :onEditItem="
                      (data, index) => handleSuspectPopup(data, index)
                    "
                    :onViewItem="
                      (data, index) => handleSuspectPopup(data, index)
                    "
                    :deleteBtn="false"
                    title="Suspects"
                  />
                </q-tab-panel>

                <q-tab-panel
                  name="reports"
                  style="padding-left: 0; padding-right: 0"
                >
                  <label
                    v-if="reports?.length === 0"
                    class="text-italic text-h6 q-ma-md"
                    >No reports...</label
                  >
                  <q-expansion-item
                    v-for="(item, i) of reports"
                    :key="i"
                    :label="item.Title"
                    :caption="item.Date"
                    :default-opened="false"
                    expand-separator
                    icon="perm_identity"
                    header-style="border: 1px solid grey;"
                    style="border: 1px solid grey"
                    class="q-mb-sm"
                    :class="$q.dark.isActive ? 'text-grey-1' : 'text-grey-10'"
                  >
                    <div class="q-pa-md" v-html="item.Text" />
                  </q-expansion-item>
                  <ReportForm
                    :data="report"
                    :set-data="setReport"
                    :case-id="Case.id"
                  />
                </q-tab-panel>

                <q-tab-panel
                  name="minutes"
                  style="overflow: auto; padding-bottom: 80px"
                >
                  <MinutesTabCard :onMinuted="() => {}" />
                </q-tab-panel>

                <!--<q-tab-panel
                  name="timeline"
                  style="overflow: auto; padding-bottom: 80px"
                >
                  <HistoryTabCard />
                </q-tab-panel>-->
              </q-tab-panels>

              <q-dialog
                full-width=""
                full-height=""
                persistent=""
                v-model="suspectPopupModel"
              >
                <q-card>
                  <q-toolbar class="bg-teal text-white">
                    <q-btn flat round dense icon="perm_identity" />
                    <q-toolbar-title>
                      {{ suspect?.Name || "New Suspect" }}
                    </q-toolbar-title>
                    <q-btn
                      flat
                      color="white"
                      icon="clear"
                      @click.stop="cancelDialog"
                    />
                  </q-toolbar>
                  <div
                    style="
                      width: 100%;
                      height: calc(100vh - 168px);
                      overflow: auto;
                    "
                  >
                    <div class="q-pa-md">
                      <SuspectForm
                        ref="suspectFormRef"
                        :model="suspect"
                        :set-model="(v) => (suspect = v || {})"
                      />
                    </div>
                  </div>
                  <q-card-actions align="right">
                    <q-btn
                      unelevated
                      icon=""
                      icon-right="arrow_right"
                      label="Save"
                      color="secondary"
                      @click="saveSuspect"
                    />
                    <q-btn
                      flat
                      label="Cancel"
                      color="primary"
                      @click.stop="cancelDialog"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <div class="overlay" v-if="tab === 'form'" />
            </q-card-section>
          </q-card>
        </template>
      </q-splitter>
    </q-page-container>
    <DefaultFooter />
  </q-layout>
</template>
<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
  provide,
  defineAsyncComponent,
} from "vue";
import { useRouter } from "vue-router";
import { Dialog as dialog, debounce, Screen } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { useCollection, useDocument } from "vuefire";
import { collection, query, where, or, and, orderBy } from "firebase/firestore";
import { firestore } from "src/composables/firebase";

import { deleteFile, update, create, getById } from "src/composables/remote";

import DefaultHeader from "src/layouts/DefaultHeader.vue";
import DefaultFooter from "src/layouts/DefaultFooter.vue";
import TableView from "src/components/TableView.vue";
import ReportForm from "src/components/forms/ReportForm.vue";
import { useStaffList, useIpoList } from "src/composables/use-fn";
import IpoInput from "src/components/forms/IpoInput.vue";
import StaffInput from "src/components/forms/StaffInput.vue";
//import TextEditor from "src/components/TextEditor.vue";
//import FormCard from "src/components/FormCard.vue";
//import SuspectForm from "src/components/forms/SuspectForm.vue";
//import CaseForm from "src/components/forms/CaseForm.vue";
//import ComplaintForm from "src/components/forms/ComplaintForm.vue";
//import RaidForm from "src/components/forms/RaidForm.vue";
/*const RaidForm = defineAsyncComponent(() =>
  import("src/components/forms/RaidForm.vue")
);*/
const staff_list = useStaffList();
//const ipo_list = useIpoList();

const SuspectForm = defineAsyncComponent(() =>
  import("src/components/forms/SuspectForm.vue")
);
//const ComplaintForm = defineAsyncComponent(() =>import("src/components/forms/ComplaintForm.vue");
const CaseForm = defineAsyncComponent(() =>
  import("src/components/forms/CaseForm.vue")
);
const MinutesTabCard = defineAsyncComponent(() =>
  import("src/components/MinutesTabCard.vue")
);
//const HistoryTabCard = defineAsyncComponent(() =>import("src/components/HistoryTabCard.vue"));
const props = defineProps({
  onCaseLoaded: Function,
});
const router = useRouter();
const store = useDefaultStore();
const tab = ref("");
const formRef = ref(null);
const Case = ref({});
const suspectPopupModel = ref(false);
const suspect = ref({});
const suspectFormRef = ref(null);
const complaintFormRef = ref(null);
const complaint = ref({});
const report = ref({});
const year_options = ref([]);
const selectedUser = ref();
const selectedIpo = ref();
const selectedYear = ref(new Date().getFullYear());
const splitterModel = ref(Screen.gt.xs ? 40 : 20);
const statusModel = ref("Active");
const status_options = ["Active", "Court", "Concluded"];
const columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const doc_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
var suspects = [];
var samples = [];
var reports = [];
var cases = [];

const shouldDisable = computed(() => !Case.value?.id);
const isAdmin = computed(() => store.user.claims.isAdmin);
const isDirector = computed(() => store.user.claims.role === "Director");
const isHOD = computed(
  () =>
    store.user.claims.role === "Head Division" ||
    store.user.claims.role === "Head Location"
);
const isLawyer = computed(() => store.user.claims.role === "Legal");
const isIPO = computed(() => store.user.claims.level === 2);
const isOc = computed(() => store.user.claims.role === "OC");

const staffSearchOptions = computed(() => {
  if (isDirector.value) {
    //return { uid: store.user.uid };
    return null;
  } else {
    if (isHOD.value) {
      return {
        Location: store.user.claims.location,
        unit: store.user.claims.unit,
      };
    } else {
      return { uid: store.user.uid };
    }
  }
});
const ipoSearchOptions = computed(() => {
  if (!isDirector.value) {
    if (isOc.value) {
      return {
        Location: store.user.claims.location,
        unit: store.user.claims.unit,
      };
    } else {
      return { uid: store.user.uid };
    }
  }
  return null;
});
const staffList = computed(
  () =>
    staff_list.value.filter(
      (s) => s.Role === "Director" || s.Role === "Legal"
    ) || []
);

const setDocument = (v) => {
  Case.value = v;
  store.currentDocument = v;
};

const selectCase = (val) => {
  if (tab.value !== "form") tab.value = "form";
  setDocument(val);
};
function extractFileName(downloadURL) {
  let ar = decodeURI(downloadURL).split("/");
  const name = ar.pop().replace("%2F", "/");
  return name.split("?")[0];
}
async function removeSuspect(suspect, index) {
  let dl = dialog.create({
    title: "Confirm",
    html: true,
    message:
      "This action will remove suspect from this Case. However, the suspect will still be in the database. <br/><br/><strong>Do you want to continue?</strong>",
    ok: {
      color: "red",
    },
    cancel: {
      Text: "No",
    },
  });
  dl.onOk(() => {
    store.loading = true;
    const cases = suspect.Cases.splice(index, 1);
    update(suspect.id, { Cases: cases }, "Suspects")
      .then((d) => {
        //suspectPopupModel.value = false;
      })
      .catch((e) => {
        dialog.create({
          title: "Error",
          message: e.message,
          ok: {
            color: "red",
          },
        });
      })
      .finally(() => {
        store.loading = false;
      });
  });
}
async function saveSuspect() {
  if (!(await suspectFormRef.value.validate())) return;
  suspect.value = suspectFormRef.value.suspect;
  if (!suspect.value.Cases) suspect.value.Cases = [Case.value.CaseNumber];
  else suspect.value.Cases.push(Case.value.CaseNumber);
  if (!suspect.value.id)
    create(suspect.value, "Suspects", ["Name"])
      .then((d) => {
        if (Case.value.suspects) Case.value.suspects.push(d);
        else Case.value.suspects = [d];
        suspectPopupModel.value = false;
      })
      .catch((e) => {
        dialog.create({
          title: "Error",
          message: e.message,
          ok: {
            color: "red",
          },
        });
      })
      .finally(() => {});
  else {
    update(suspect.value.id, suspect.value, "Suspects")
      .then((d) => {
        suspectPopupModel.value = false;
      })
      .catch((e) => {
        dialog.create({
          title: "Error",
          message: e.message,
          ok: {
            color: "red",
          },
        });
      })
      .finally(() => {});
  }
}

function handleSuspectPopup(val) {
  suspect.value = val;
  suspectPopupModel.value = true;
}
async function cancelDialog() {
  if (!suspectFormRef.value.suspect?.id) {
    let fileName = null;
    if (suspectFormRef.value.suspect.PhotoURL) {
      // remove photo
      fileName = extractFileName(suspectFormRef.value.suspect.PhotoURL);
      if (fileName) await deleteFile(fileName);
    }
  }
  suspectPopupModel.value = false;
}

function setReport(v) {
  report.value = v;
}

function onSelectIpo(v) {
  selectedIpo.value = v;
}
const suspectyQuery = computed(() =>
  query(
    collection(firestore, "Suspects"),
    where("Cases", "array-contains", Case.value.CaseNumber || 0)
  )
);

const sampleQuery = computed(() =>
  query(
    collection(firestore, "Samples"),
    where("CaseId", "==", Case.value?.id || 0)
  )
);
const reportQuery = computed(() =>
  query(
    collection(firestore, `Investigations/${Case.value.id}/Reports`),
    orderBy("id", "desc")
  )
);
function filterQuery() {
  const year = selectedYear.value;
  const date1 = new Date(year, 0, 1, 0, 0, 0, 0);
  const date2 = new Date(year, 11, 31, 23, 59, 59, 999);
  const filters = [
    // `${selectedYear.value}/0/1 00:00:00.000`
    where("meta.CreatedAt", ">=", Date.parse(date1)),
    // `${selectedYear.value}/11/31 59:59:59.999`
    where("meta.CreatedAt", "<=", Date.parse(date2)),
  ];
  if (isDirector.value || isAdmin.value) {
    // do not filter
    if (selectedUser.value)
      filters.push(
        //where("Division.Abbrev", "==", selectedUser.value.Unit || null)
        where("meta.CreatedBy", "==", selectedUser.value?.uid || null)
      );
    if (selectedIpo.value)
      filters.push(where("IPO", "==", selectedIpo.value.uid || null));
  } else if (isIPO.value) {
    filters.push(where("IPO", "==", selectedIpo.value?.uid || null));
  } else if (isLawyer.value) {
    filters.push(where("Location", "==", store.user.claims.location));
  } else {
    filters.push(
      where("meta.CreatedBy", "==", selectedUser.value?.uid || null)
    );
    //throw { message: "User not allowed" };
  }
  return filters;
}
const caseDatasource = computed(() => {
  const filters = filterQuery();
  return query(collection(firestore, `Investigations`), ...filters);
});

const loadComplaint = debounce(() => {
  const cid = Case.value.ComplaintId;
  if (cid)
    getById(cid, "Complaints")
      .then((d) => {
        complaint.value = d || {};
        Case.value.Title = d.Title;
      })
      .catch((e) => console.log(e));
}, 500);

watch(
  () => Case.value.ComplaintId,
  async (newId) => {
    if (!newId) return;
    loadComplaint();
  }
);
watch(
  () => Case.value.id,
  async (newId) => {
    store.currentDocument = newId ? Case.value : {};
    if (!newId) return;
    suspects = useCollection(suspectyQuery);
    samples = useCollection(sampleQuery);
    reports = useCollection(reportQuery);
  }
);
// const caseDateRef = ref(null)

function reset() {
  formRef.value?.reset();
}
const validate = async () => await formRef.value?.validate();
provide("iconName", "cases");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Cases");
provide("searchFields", ["Title", "Location"]);

onMounted(() => {
  store.currentCollection = "Cases";
  const thisYear = new Date().getFullYear();
  for (let i = 2023; i <= thisYear; i++) {
    year_options.value.push(i);
  }
  store.currentCollection = "Investigations";
  cases = useCollection(caseDatasource);
});
defineExpose({
  reset,
  validate,
});
</script>
<style scoped>
.fits {
  height: calc(100vh - 56px);
}
.overlay {
  position: absolute;
  top: 60px;
  left: 8px;
  right: 8px;
  height: 100%;
  background-color: rgba(0, 200, 0, 0.1);
  cursor: not-allowed;
}
.list-panel {
  font-size: 18px;
  color: teal;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
