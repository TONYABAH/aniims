<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :searchFields="SEARCH_FIELDS"
    :hide-save-button="hideSaveButton"
    :showPrevious="showPrevious"
    :onPrevious="onPrevious"
    :commentable="true"
    collectionName="Investigations"
  >
    <q-toolbar
      class="text-white q-pt-xs"
      :class="store.theme.bg.light"
      style="border-radius: 4px"
      v-if="Case?.id"
    >
      <q-tabs
        v-model="tab"
        narrow-indicator=""
        mobile-arrows=""
        outside-arrows=""
        :active-bg-color="$q.dark.isActive ? 'grey-10' : 'white'"
        active-color="teal"
        shrink=""
        dense
        :switch-indicator="false"
        indicator-color=""
        :class="$q.dark.isActive ? 'text-grey-1' : ''"
      >
        <q-tab name="form" icon="edit" :label="$q.screen.lt.sm ? '' : 'Form'" />
        <q-tab
          name="reports"
          icon="book"
          :label="$q.screen.lt.sm ? '' : 'Reports'"
          :disable="shouldDisable"
        />
        <q-tab
          name="raids"
          icon="hub"
          :label="$q.screen.lt.sm ? '' : 'Raids'"
          :disable="shouldDisable"
        />
        <q-tab
          name="samples"
          icon="sample"
          :label="$q.screen.lt.sm ? '' : 'Samples'"
          :disable="shouldDisable"
        />
        <q-tab
          name="payments"
          icon="money"
          :label="$q.screen.lt.sm ? '' : 'Billing'"
          :disable="shouldDisable"
        />
        <q-tab
          name="suspects"
          icon="perm_identity"
          :label="$q.screen.lt.sm ? '' : 'Suspects'"
          :disable="shouldDisable"
        />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels
      v-model="tab"
      animated
      vertical=""
      class="bg-transparent"
      ref="tabRef"
    >
      <q-tab-panel name="form" style="padding-left: 0; padding-right: 0">
        <CaseForm ref="formRef" :model="Case" :setModel="setDocument" />
      </q-tab-panel>
      <q-tab-panel name="reports" style="padding-left: 0; padding-right: 0">
        <!--<q-expansion-item
          v-for="(item, i) of reports"
          :key="i"
          expand-separator
          :label="item.Title"
          icon="book"
        >
          <q-editor
            :model-value="item.Text"
            min-height="5rem"
            flat
            :toolbar="false"
          />
        </q-expansion-item>-->
        <q-card flat class="my-card">
          <q-card-section>
            <q-expansion-item
              expand-separator
              icon="book"
              label="Reports & updates"
              caption=""
              :default-opened="opened"
              header-class="border"
              v-model="opened"
              class="q-pa-sm"
            >
              <TableView
                :editable="false"
                :deletable="false"
                :data="reports"
                :columns="columns"
                :onAddItem="onAddReport"
                :onRemoveItem="onViewReport"
                :onEditItem="onViewReport"
                :onViewItem="onViewReport"
                :addBtn="true"
                title="Reports"
              />
            </q-expansion-item>
            <q-badge
              color="pink"
              text-color="white"
              :label="reports?.length"
              style="position: absolute; right: 18px; top: 18px"
            />
          </q-card-section>
          <q-card-section>
            <ReportForm
              :data="report"
              :set-data="setReport"
              :case-id="Case.id"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="raids" style="padding-left: 0; padding-right: 0">
        <q-card flat class="my-card">
          <q-card-section>
            <TableView
              :editable="false"
              :data="raids"
              :columns="columns"
              :deleteBtn="false"
              :onAddItem="showRaid"
              :onViewItem="showRaid"
              :onEditItem="showRaid"
              title="Raids"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="samples" style="padding-left: 0; padding-right: 0">
        <q-card flat class="my-card">
          <q-card-section>
            <TableView
              :editable="false"
              :data="samples"
              :columns="doc_columns"
              :onAddItem="showSample"
              :onEditItem="showSample"
              :onViewItem="showSample"
              :deleteBtn="false"
              title="Samples"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="payments" style="padding-left: 0; padding-right: 0">
        <q-card flat class="my-card">
          <q-card-section>
            <TableView
              :editable="true"
              :data="payments"
              :columns="columns"
              :onAddItem="showPayment"
              :onEditItem="showPayment"
              :onViewItem="showPayment"
              :deleteBtn="false"
              title="Payments"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="suspects" style="padding-left: 0; padding-right: 0">
        <q-card flat class="my-card">
          <q-card-section>
            <TableView
              :editable="true"
              :data="suspects"
              :columns="doc_columns"
              :onAddItem="() => showSuspect()"
              :onRemoveItem="(data, index) => removeSuspect(data, index)"
              :onEditItem="(data, index) => showSuspect(data, index)"
              :onViewItem="(data, index) => showSuspect(data, index)"
              :deleteBtn="false"
              title="Suspects"
            />
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
    <q-toolbar
      class="bg-"
      v-if="
        Case?.id &&
        Case.meta?.Status !== 'Created' &&
        store.user?.claims.role === 'Director'
      "
    >
      <q-toolbar-title></q-toolbar-title>
      <q-btn
        unelevated=""
        glossy
        icon="balance"
        icon-right="arrow_right"
        :label="Case.Status === 'Closed' ? 'Open case' : 'Close case'"
        color="pink"
        class="q-mr-xs"
        :loading="loading"
        @click="closeCase"
      />
    </q-toolbar>
  </FormCard>

  <q-dialog
    persistent=""
    full-width=""
    full-height=""
    v-model="suspectPopupModel"
  >
    <q-card>
      <q-toolbar class="bg-teal text-white">
        <q-btn flat round dense icon="perm_identity" />
        <q-toolbar-title>
          {{ suspect?.Name || "New Suspect" }}
        </q-toolbar-title>
        <q-btn flat color="white" icon="clear" @click.stop="cancelDialog" />
      </q-toolbar>
      <q-card-section
        style="width: auto; height: calc(100% - 120px); overflow: auto"
      >
        <SuspectForm
          ref="suspectFormRef"
          :model="suspect"
          :set-model="(v) => (suspect = v || {})"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          unelevated
          icon=""
          icon-right="arrow_right"
          label="Save"
          color="secondary"
          :loading="loading"
          @click="saveSuspect"
        />
        <q-btn flat label="Cancel" color="primary" @click.stop="cancelDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch, provide } from "vue";
import { useRouter } from "vue-router";
import { Dialog as dialog, Notify, debounce } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { useCollection } from "vuefire";
import { collection, query, where, orderBy } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import FormCard from "src/components/FormCard.vue";
import SuspectForm from "src/components/forms/SuspectForm.vue";
import {
  deleteFile,
  update,
  create,
  getById,
  addChildDocument,
} from "src/composables/remote";
import TableView from "src/components/TableView.vue";
import CaseForm from "src/components/forms/CaseForm.vue";
//import Clipboard from "src/utils/clipboard.js";
//import ComplaintForm from "src/components/forms/ComplaintForm.vue";
//import RaidForm from "src/components/forms/RaidForm.vue";
import ReportForm from "src/components/forms/ReportForm.vue";
//import RaidsView from "./RaidsView.vue";

const props = defineProps({
  onCaseLoaded: Function,
});
const router = useRouter();
const store = useDefaultStore();
const tab = ref("form");
const formRef = ref(null);
const suspectPopupModel = ref(false);
const complaintPopupModel = ref(false);
const tabRef = ref(null);
const updateFields = ref([]);
const suspect = ref({});
const suspectFormRef = ref(null);
const actionButton = ref(false);
const hideSaveButton = ref(false);
const showPrevious = ref(true);
const complaint = ref({});
const report = ref({});
const opened = ref(true);
const loading = ref(false);

var suspects = [];
var raids = [];
var samples = [];
var reports = [];
var payments = [];

const SEARCH_FIELDS = ["Title", "Location","CaseNumber"];
const columns = [
  { name: "Title", field: "Title", label: "Title", align: "left" },
  { name: "Date", field: "Date", label: "Date", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const doc_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const Case = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const shouldDisable = computed(() => !Case.value?.id);

const setDocument = (v) => {
  Case.value = v || {};
};
function onPrevious() {
  tabRef.value.previous();
}
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
    loading.value = true;
    const cases = suspect.Cases.splice(index, 1);
    update(suspect.id, { Cases: cases }, "Suspects")
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
      .finally(() => {
        loading.value = false;
      });
  });
}
async function saveSuspect() {
  if (!(await suspectFormRef.value.validate())) return;
  suspect.value = suspectFormRef.value.suspect;
  if (!suspect.value.Cases) suspect.value.Cases = [Case.value.CaseNumber];
  else suspect.value.Cases.push(Case.value.CaseNumber);
  loading.value = true;
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
      .finally(() => {
        loading.value = false;
      });
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
      .finally(() => {
        loading.value = false;
      });
  }
}

function getDocument() {
  return Case.value;
}
function closeCase() {
  loading.value = true;
  let data =
    Case.value.Status === "Closed" ? { Status: "Open" } : { Status: "Closed" };
  update(Case.value.id, data, "Investigations")
    .then((d) => {
      Notify.create({
        title: data.Status,
        message: data.Status,
        position: "right",
      });
      //if (data.Status === "Closed") {
      setDocument({});
      store.tabModel = "search";
      //router.push("/Investigations");
      //}
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
      loading.value = false;
    });
}
async function cancelDialog() {
  if (!suspectFormRef.value?.suspect?.id) {
    let fileName = null;
    if (suspectFormRef.value?.suspect?.PhotoURL) {
      // remove photo
      fileName = extractFileName(suspectFormRef.value.suspect.PhotoURL);
      if (fileName) await deleteFile(fileName);
    }
  }
  suspectPopupModel.value = false;
}
/*async function addReport() {
  const valid = await reportFormRef.value.validate();
  if (!valid) return;
  if (!report.value?.Text) return;
  loading.value = true;
  const data = report.value;
  data.Date = new Date().toISOString();

  addChildDocument("Investigations", Case.value.id, "Reports", data)
    .then((id) => {
      report.value.id = id;
      //onAddReport();
      reportPopupModel.value = false;
    })
    .catch((e) => {
      dialog.create({
        message: e.message,
        title: "Error",
        position: "right",
        color: "red",
      });
    })
    .finally(() => (loading.value = false));
}*/

function showRaid(d) {
  //raidPopupModel.value = true;
  //router.push("/Raids/#?cid=" + Case.value.id + "&cn=" + Case.value.CaseNumber);
  store.currentCollection = "Raids";
  router.push("/Investigations/" + Case.value.id + "/Raids/#" + (d?.id || 0));
}
function showSample(d) {
  store.currentCollection = "Samples";
  //router.push("/Samples/#?cid=" + Case.value.id + "&cn=" + Case.value.CaseNumber);
  router.push("/Investigations/" + Case.value.id + "/Samples/#" + (d?.id || 0));
}
function showPayment(d) {
  store.currentCollection = "Payments";
  //router.push("/Payments/#?cid=" + Case.value.id + "&cn=" + Case.value.CaseNumber);
  router.push(
    "/Investigations/" + Case.value.id + "/Payments/#" + (d?.id || 0)
  );
}
function showSuspect(d) {
  suspect.value = d || {};
  suspectPopupModel.value = true;
  //router.push("/Raids/#?cid=" + Case.value.id + "&cn=" + Case.value.CaseNumber);
  //store.currentCollection = "Suspects";
  //router.push("/Investigations/" + Case.value.id + "/Suspects/#" + (d?.id || 0));
}
function onAddReport() {
  report.value = {};
  opened.value = false;
  //store.currentCollection = "Investigations/" + Case.value.id + "/Reports";
  //reportPopupModel.value = true;
  //router.push("/Investigations/" + Case.value.id + "/Reports/#0");
}
function onViewReport(item) {
  report.value = item;
  opened.value = false;
  //reportPopupModel.value = true;
  //store.currentCollection = "Investigations/" + Case.value.id + "/Reports";
  //router.push("/Investigations/" + Case.value.id + "/Reports/#" + (item?.id || 0));
}
function setReport(v) {
  report.value = v;
}
function reset() {
  formRef.value?.reset();
  report.value = {};
}

const validate = async () => await formRef.value?.validate();

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
  tab,
  (newValue) => {
    actionButton.value = false;
    hideSaveButton.value = true;
    showPrevious.value = true;
    if (newValue === "form") {
      hideSaveButton.value = false;
      showPrevious.value = false;
    }
    if (newValue === "reports") {
      actionButton.value = true;
    }
  },
  { immediate: true }
);
watch(
  () => Case.value?.ComplaintId,
  async (newId) => {
    if (!newId || Case.value.id) return;
    loadComplaint();
  },
  { immediate: false }
);
watch(
  () => Case.value,
  (c) => {
    if (!c?.CaseNumber || !c?.id) return;
    const sampleQuery = query(
      collection(firestore, `Samples`),
      where("CaseId", "==", Case.value?.id),
      orderBy("id", "desc")
    );
    const reportQuery = query(
      collection(firestore, `Investigations/${Case.value?.id}/Reports`),
      orderBy("id", "desc")
    );
    const suspectyQuery = query(
      collection(firestore, "Suspects"),
      where("Cases", "array-contains", c.CaseNumber),
      orderBy("Name", "asc")
    );
    const paymentQuery = query(
      collection(firestore, `Payments`),
      where("CaseId", "==", Case.value?.id),
      orderBy("id", "desc")
    );
    const raidQuery = query(
      collection(firestore, `Raids`),
      where("CaseId", "==", Case.value?.id),
      orderBy("id", "desc")
    );

    suspects = useCollection(suspectyQuery);
    raids = useCollection(raidQuery);
    samples = useCollection(sampleQuery);
    reports = useCollection(reportQuery);
    payments = useCollection(paymentQuery);
  }
);

provide("iconName", "cases");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Investigations");
provide("searchFields", ["Title", "Location"]);

defineExpose({
  reset,
  validate,
});
</script>
<style></style>
