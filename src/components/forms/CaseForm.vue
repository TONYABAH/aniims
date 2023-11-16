<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <q-form class="q-gutter-sm" ref="form">
      <label>Case Number</label>
      <q-input
        v-model="Case.CaseNumber"
        type="text"
        color=""
        name="caseNumber"
        outlined
        square
        readonly=""
        style="max-width: 50%"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            no-caps
            unelevated
            color="secondary"
            id="copy_btn"
            @click="copyToClipboard(Case.CaseNumber)"
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 3C6 1.34315 7.34315 0 9 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893L21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V17C22 18.6569 20.6569 20 19 20H18V21C18 22.6569 16.6569 24 15 24H5C3.34315 24 2 22.6569 2 21V7C2 5.34315 3.34315 4 5 4H6V3ZM6 6H5C4.44772 6 4 6.44772 4 7V21C4 21.5523 4.44772 22 5 22H15C15.5523 22 16 21.5523 16 21V20H9C7.34315 20 6 18.6569 6 17V6ZM9 2C8.44772 2 8 2.44772 8 3V17C8 17.5523 8.44771 18 9 18H19C19.5523 18 20 17.5523 20 17V9H16C14.3431 9 13 7.65685 13 6V2H9ZM15 3.41421L18.5858 7H16C15.4477 7 15 6.55228 15 6V3.41421Z"
                fill="teal"
              />
            </svg>
          </q-btn>
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Complaint ID</label>
      <q-input v-model="Case.ComplaintId" type="text" outlined square />
      <q-separator spaced inset vertical dark />
      <label>Complaint Title *</label>
      <q-input
        v-model="Case.Title"
        type="text"
        :rules="[(val) => !!val || 'Complaint is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square
      />
      <q-separator spaced inset vertical dark />
      <label>Location *</label>
      <q-select
        v-model="Case.Location"
        :options="nafdacLocations"
        options-dense=""
        :rules="[(val) => !!val || 'Location is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
      />
      <q-separator spaced inset vertical dark />
      <label>Division in charge *</label>
      <q-select
        v-model="Case.Division"
        :options="units"
        :rules="[(val) => !!val || 'Division is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
        options-dense=""
        option-value="Abbrev"
        option-label="Abbrev"
      />
      <q-separator spaced inset vertical dark />
      <label>Case IPO *</label>
      <q-select
        v-model="Case.IPO"
        :options="store.ipos"
        :rules="[(val) => !!val || 'IPO is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
        options-dense=""
        option-value="Name"
        option-label="Name"
      />
      <q-separator spaced inset vertical dark />
      <label>File number *</label>
      <q-input
        v-model="Case.FileNumber"
        type="text"
        color=""
        name="fileNumber"
        outlined
        square
      >
        <template v-slot:append>
          <q-btn
            v-if="update_fileNumber"
            flat
            color="primary"
            label="Update"
            @click.stop="updateFileNumber"
          />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Status *</label>
      <q-select
        v-model="Case.Status"
        :options="CASE_STATUS_OPTIONS"
        outlined
        square
        options-dense=""
        :rules="[(val) => !!val || 'Status is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-btn
            v-if="update_status"
            flat
            color="primary"
            label="Update"
            @click.stop="updateCaseStatus"
          />
        </template>
      </q-select>
      <TableView
        :editable="true"
        :data="suspects"
        :columns="suspect_columns"
        :onAddItem="() => handleSuspectPopup({})"
        :onRemoveItem="(data, index) => removeSuspect(data, index)"
        :onEditItem="(data, index) => handleSuspectPopup(data, index)"
        :onViewItem="(data, index) => handleSuspectPopup(data, index)"
        :deleteBtn="false"
        title="Suspects"
      />
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
    </q-form>
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

import Clipboard from "src/utils/clipboard.js";
//import LocationForm from "./LocationForm.vue";
//import SurveillanceForm from "./SurveillanceForm.vue";
//import SurveillanceView from "./SurveillanceView.vue";
//import RaidForm from "./RaidForm.vue";
const CASE_STATUS_OPTIONS = ["Open", "Progress", "Closed"];
const props = defineProps({
  onCaseLoaded: Function,
});
const router = useRouter();
const store = useDefaultStore();
const form = ref(null);
const suspectPopupModel = ref(false);
const Case = ref({});
//const surveillance = ref({});
const updateFields = ref([]);
const update_fileNumber = ref(false);
const update_status = ref(false);
const suspect = ref({});
const suspectFormRef = ref(null);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const suspect_columns = [
  { name: "Name", field: "Name", label: "Name", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
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
//const setSurveillance = (v) => (surveillance.value = v || {});
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
const nafdacLocations = computed(() => {
  //console.log(store.currentStaff);
  if (store.user.role === "Director" || store.user.claims?.admin) {
    return store.locations;
  }
  return [store.currentStaff.Location];
});
const units = computed(() => {
  if (store.user.role === "Director" || store.user.claims?.admin) {
    return Case.value.Location
      ? store.units.filter((u) => u.Location === Case.value?.Location)
      : store.units;
  }
  return store.user.claims.units;
});
/*const staffList = computed(() => {
  return Case.value.Unit
    ? store.staffList.filter((s) => s.Units?.includes(Case.value.Unit.Abbrev))
    : store.staffList;
});*/
function showRaid(d) {
  router.push("/Raids/#" + (d?.id || ""));
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

const suspects = useCollection(suspectyQuery);
const raids = useCollection(raidQuery);
watch(
  () => Case.value.FileNumber,
  (newValue) => {
    //console.log(newValue);
    update_fileNumber.value = newValue ? true : false;
  }
);
watch(
  () => Case.value.Status,
  (newValue) => {
    //console.log(newValue);
    update_status.value = newValue ? true : false;
  }
);
//watch(Case.value.Title, async (c) => {
//ssif (!Case.value || !Case.value.id) return;
//console.log(resp)
//raids.value = resp[0].data;
//surveillances.value = resp[2].data;
//});
// const caseDateRef = ref(null)

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);
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
