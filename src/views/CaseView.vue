<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <q-toolbar style="padding-left: 0; padding-right: 0">
      <q-tabs
        v-model="tab"
        dense
        narrow-indicator=""
        shrink=""
        mobile-arrows=""
        outside-arrows=""
        :class="$q.dark.isActive ? 'text-grey-1' : 'text-teal-8'"
        align="left"
      >
        <q-tab name="form" icon="cases" label="View" />
        <q-tab
          name="complaint"
          icon="phone"
          label="Complaint"
          :disable="!Case.ComplaintId && shouldDisable"
        />
        <q-tab
          name="raids"
          icon="raids"
          label="Raids"
          :disable="shouldDisable"
        />
        <q-tab
          name="samples"
          icon="sample"
          label="Samples"
          :disable="shouldDisable"
        />
        <q-tab
          name="suspects"
          icon="perm_identity"
          label="Suspects"
          :disable="shouldDisable"
        />
        <q-tab
          name="payments"
          icon="payment"
          label="Payments"
          :disable="shouldDisable"
        />
        <q-tab
          name="reports"
          icon="edit"
          label="Reports"
          :disable="shouldDisable"
        />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated vertical="" class="bg-transparent">
      <q-tab-panel name="form" style="padding-left: 0; padding-right: 0">
        <CaseForm ref="formRef" :model="Case" :setModel="setDocument" />
      </q-tab-panel>
      <q-tab-panel name="complaint" style="padding-left: 0; padding-right: 0">
        <ComplaintApplication
          ref="complaintFormRef"
          :data="complaint"
          :setData="setComplaint"
        />
        <q-toolbar class="bg-purple text-white">
          <q-toolbar-title> </q-toolbar-title>
          <q-btn
            flat
            label="Save complaint"
            class="q-mr-xs"
            @click="saveComplaint"
          />
        </q-toolbar>
      </q-tab-panel>
      <q-tab-panel name="raids" style="padding-left: 0; padding-right: 0">
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
      </q-tab-panel>
      <q-tab-panel name="reports" style="padding-left: 0; padding-right: 0">
        <TableView
          :editable="false"
          :deletable="true"
          :data="reports"
          :columns="columns"
          :onAddItem="onAddReport"
          :onRemoveItem="onDeleteReport"
          :onEditItem="onEditReport"
          :onViewItem="onViewReport"
          :addBtn="true"
          title="Reports"
        />
        <q-form class="q-gutter-md q-mt-md">
          <q-separator spaced inset vertical dark />
          <label>Write a report</label>
          <q-input v-model="report.Title" type="text" label="Report Title" />
          <TextEditor :Text="report.Text" :setText="setReportText" />
          <div class="bg-" align="center">
            <q-btn label="Submit report" color="" flat />
            <q-btn label="Reset" type="reset" color="" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-tab-panel>
      <q-tab-panel name="suspects" style="padding-left: 0; padding-right: 0">
        <TableView
          :editable="true"
          :data="suspects"
          :columns="doc_columns"
          :onAddItem="() => handleSuspectPopup({})"
          :onRemoveItem="(data, index) => removeSuspect(data, index)"
          :onEditItem="(data, index) => handleSuspectPopup(data, index)"
          :onViewItem="(data, index) => handleSuspectPopup(data, index)"
          :deleteBtn="false"
          title="Suspects"
        />
      </q-tab-panel>
      <q-tab-panel name="samples" style="padding-left: 0; padding-right: 0">
        <TableView
          :editable="true"
          :data="samples"
          :columns="columns"
          :onAddItem="showSample"
          :onEditItem="showSample"
          :onViewItem="showSample"
          :deleteBtn="false"
          title="Samples"
        />
      </q-tab-panel>
      <q-tab-panel name="payments" style="padding-left: 0; padding-right: 0">
        <TableView
          :editable="true"
          :data="payments"
          :columns="columns"
          :onAddItem="showPayment"
          :onEditItem="showPayment"
          :onViewItem="showPayment"
          :deleteBtn="false"
          title="Samples"
        />
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog persistent="" v-model="suspectPopupModel">
      <q-card>
        <q-toolbar class="bg-teal text-white">
          <q-btn flat round dense icon="perm_identity" />
          <q-toolbar-title>
            {{ suspect?.Name || "New Suspect" }}
          </q-toolbar-title>
          <q-btn flat color="white" icon="clear" @click.stop="cancelDialog" />
        </q-toolbar>
        <q-card-section
          class="row items-center"
          style="padding: 0; padding-right: 16px"
        >
          <q-scroll-area style="width: 600px; height: 280px">
            <SuspectForm ref="suspectFormRef" :data="suspect" />
          </q-scroll-area>
        </q-card-section>
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
    <q-dialog persistent="" v-model="raidPopupModel">
      <q-card>
        <q-toolbar class="bg-teal text-white">
          <q-btn flat round dense icon="perm_identity" />
          <q-toolbar-title>
            {{ raid?.Title || "New Suspect" }}
          </q-toolbar-title>
          <q-btn flat color="white" icon="clear" @click.stop="cancelDialog" />
        </q-toolbar>
        <q-card-section
          class="row items-center"
          style="padding: 0; padding-right: 16px"
        >
          <q-scroll-area style="width: 600px; height: 280px">
            <RaidForm ref="raidFormRef" :model="raid" />
          </q-scroll-area>
        </q-card-section>
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
  </FormCard>
</template>
<script setup>
import { computed, ref, watch, provide } from "vue";
import { useRouter } from "vue-router";
import { Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { useCollection, useDocument } from "vuefire";
import { collection, query, where, orderBy } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import FormCard from "src/components/FormCard.vue";
import SuspectForm from "src/components/forms/SuspectForm.vue";
import { deleteFile, update, create } from "src/composables/remote";
import TableView from "src/components/TableView.vue";
import CaseForm from "src/components/forms/CaseForm.vue";
import Clipboard from "src/utils/clipboard.js";
//import ComplaintForm from "./ComplaintForm.vue";
import ComplaintApplication from "src/pages/ComplaintApplication.vue";
import TextEditor from "src/components/TextEditor.vue";
//import LocationForm from "./LocationForm.vue";
//import SurveillanceForm from "./SurveillanceForm.vue";
//import SurveillanceView from "./SurveillanceView.vue";
import RaidForm from "src/components/forms/RaidForm.vue";
const CASE_STATUS_OPTIONS = ["Open", "Progress", "Closed"];
const props = defineProps({
  onCaseLoaded: Function,
});
const router = useRouter();
const store = useDefaultStore();
const tab = ref("form");
const formRef = ref(null);
const Case = ref({});
const suspectPopupModel = ref(false);
const raidPopupModel = ref(false);
const updateFields = ref([]);
const update_fileNumber = ref(false);
const update_status = ref(false);
const suspect = ref({});
const raid = ref({});
const suspectFormRef = ref(null);
const raidFormRef = ref(null);
const complaintFormRef = ref(null);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const complaint = ref({});
const report = ref({});

const columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const doc_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const shouldDisable = computed(() => !Case.value?.id);
const setComplaint = (v) => {
  complaint.value = v;
};
const setDocument = (v) => {
  Case.value = v;
};
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
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

function getDocument() {
  return Case.value;
}
function updateFileNumber() {
  // send update file number field
  store.loading = true;
  update(Case.value.id, { FileNumber: Case.value.FileNumber }, "Cases")
    .then((d) => {
      const dl = dialog.create({
        title: "Success",
        message: "Update succeeded",
        ok: {
          color: "teal",
        },
      });
      setTimeout(() => {
        dl.hide();
      }, 1000);
    })
    .catch((e) => {
      dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}
function updateCaseStatus() {
  store.loading = true;
  update(Case.value.id, { Status: Case.value.Status }, "Cases")
    .then((d) => {
      const dl = dialog.create({
        title: "Success",
        message: "Update succeeded",
        ok: {
          color: "teal",
        },
      });
      setTimeout(() => {
        dl.hide();
      }, 1000);
    })
    .catch((e) => {
      dialog.create({
        title: "Error",
        message: e.message,
      });
    })
    .finally(() => {
      store.loading = false;
    });
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
const nafdac_locations = computed(() => {
  return store.locations;
  // if (store.user.role === "Director" || store.user.claims?.admin) {}
});
const units = computed(() => {
  //if (store.user.role === "Director" || store.user.claims?.admin) {
  return Case.value.Location
    ? store.units.filter((u) => u.Location === Case.value?.Location)
    : store.units;
  //}
  //return store.user.claims.units;
});
/*const staffList = computed(() => {
  return Case.value.Unit
    ? store.staffList.filter((s) => s.Units?.includes(Case.value.Unit.Abbrev))
    : store.staffList;
});*/
function showRaid(d) {
  router.push("/Raids/#" + (d?.id || ""));
}
function showSample(d) {
  router.push("/Samples/#" + (d?.id || ""));
}
function showPayment(d) {
  router.push("/Payments/#" + (d?.id || ""));
}
function setReportText(v) {
  report.value.Text = v;
}
function onAddReport() {
  report.value = {};
}

async function addReport() {
  const { addChildDocument } = await import("src/composables/remote.js");
  addChildDocument("Cases", Case.value.id, "Reports")
    .then((id) => {
      report.value.id = id;
      onAddReport();
    })
    .catch((e) => {
      Dialog.create({
        message: e.message,
        title: "Error",
      });
    });
}
function saveComplaint(){

}
const suspectyQuery = computed(() =>
  query(
    collection(firestore, "Suspects"),
    where("Cases", "array-contains", Case.value.CaseNumber || 0)
  )
);
const raidQuery = computed(() =>
  query(
    collection(firestore, "Raids"),
    where("CaseNumber", "==", Case.value.CaseNumber || 0)
  )
);
const sampleQuery = computed(() =>
  query(
    collection(firestore, "Samples"),
    where("CaseNumber", "==", Case.value.CaseNumber || 0)
  )
);
const reportQuery = computed(() =>
  query(collection(firestore, `Cases/${Case.value.id}/Reports`))
);

var suspects = useCollection(suspectyQuery);
var raids = useCollection(raidQuery);
var samples = useCollection(sampleQuery);
var reports = useCollection(reportQuery);
/*watch(
  () => Case.value.FileNumber,
  (newValue) => {
    update_fileNumber.value = newValue ? true : false;
  }
);
watch(
  () => Case.value.Status,
  (newValue) => {
    update_status.value = newValue ? true : false;
v  }.;/
);*/
watch(
  () => Case.value.ComplaintId,
  async (newId) => {
    if (!newId) return;
    const { get } = await import("src/composables/remote.js");
    const cid = Case.value.ComplaintId;
    if (cid)
      get(cid, "Complaints")
        .then((d) => {
          complaint.value = d || {};
          Case.value.Title = d.Title;
        })
        .catch((e) => console.log(e));
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

defineExpose({
  reset,
  validate,
});
</script>
<style></style>
