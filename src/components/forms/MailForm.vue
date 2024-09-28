<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setMail"
    :getDocument="getDocument"
    :searchFields="SEARCH_FIELDS"
    :commentable="commentable"
    collectionName="Mails"
  >
    <q-form ref="form" class="q-gutter-md q-pt-md">
      <q-input
        v-model="mail.id"
        label="Mail ID"
        type="text"
        outlined
        stack-label
        readonly=""
        v-if="mail?.id"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            no-caps
            unelevated
            color="secondary"
            id="copy_btn"
            @click="copyToClipboard(mail.id)"
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
      <q-select
        label="Location *"
        options-dense=""
        v-model="mail.location"
        :options="store.locations"
        :rules="[(val) => !!val || 'I&E Location is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        stack-label
        square=""
      />
      <q-input
        v-model="mail.file_number"
        label="File number"
        type="text"
        color=""
        name="fileNumber"
        outlined
        stack-label=""
      >
        <template v-slot:append v-if="mail?.id">
          <q-btn
            v-if="mail?.file_number"
            no-caps=""
            unelevated=""
            color="secondary"
            icon-right="campaign"
            label="View complaint"
            :to="'/files/#' + mail?.file_number"
          />
          <q-btn
            v-if="update_fileNumber"
            flat
            color="primary"
            label="Update"
            @click="updateFileNumber"
          />
        </template>
      </q-input>

      <q-input
        v-model="mail.subject"
        label="Subject *"
        type="text"
        color=""
        name="title"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        :rules="[(val) => !!val || 'Subject is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        stack-label=""
      />

      <q-input
        v-model="mail.source"
        label="Source name *"
        type="text"
        color=""
        name="source"
        :rules="[(val) => !!val || 'Source is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        stack-label=""
      />

      <q-input
        v-model="mail.address"
        label="Source address *"
        type="text"
        color=""
        name="address"
        :rules="[(val) => !!val || 'Address is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        stack-label=""
      />
      <div class="row q-col-gutter-xs">
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-input
            name="inDate"
            v-model="mail.in_date"
            label="Incoming date *"
            type="date"
            clear-icon="clear"
            :rules="[(val) => !!val || 'In coming date is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            outlined
            stack-label=""
          />
        </div>
        <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-input
            name="outDate"
            v-model="mail.out_date"
            label="Outgoing date"
            type="date"
            clear-icon="clear"
            outlined
            stack-label=""
          >
            <template v-slot:append>
              <q-btn
                v-if="update_outdate && mail?.id"
                flat
                color="primary"
                label="Update"
                @click="updateOutDate"
              />
            </template>
          </q-input>
        </div>
      </div>
      <StatusInput
        collection-name="Mails"
        :documentId="mail?.id"
        :status="mail?.Status"
        :set-status="(v) => (mail.status = v)"
        :options="statusOptions"
        outlined
        dense
      />
    </q-form>
    <q-separator spaced inset vertical dark />
    <q-btn
      v-if="mail?.complaint_id"
      no-caps=""
      unelevated=""
      color="secondary"
      icon-right="campaign"
      label="View complaint"
      :to="'/complaints/#' + mail?.complaint_id"
    />
    <q-btn
      v-else
      no-caps=""
      unelevated=""
      color="secondary"
      icon-right="campaign"
      label="File complaint"
      @click="() => generateComplaint()"
    />
    <q-btn
      v-if="mail?.id && mail.status === 'Created'"
      no-caps=""
      unelevated=""
      color="purple"
      icon-right="arrow_right"
      label="Send to Head"
      :loading="loading"
      class="q-mx-xs"
      @click="sendToDirector"
    />
    <q-dialog v-model="complaintDialog" persistent>
      <q-card>
        <q-toolbar class="bg-purple text-white">
          <q-toolbar-title> Create complaint </q-toolbar-title>
        </q-toolbar>
        <q-scroll-area
          class="q-pa-md q-mr-xs"
          style="width: 400px; height: calc(100vh - 200px)"
        >
          <ComplaintForm
            ref="complaintFormRef"
            :data="complaint"
            :setData="(d) => (complaint = d)"
          />
        </q-scroll-area>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Create"
            color="primary"
            @click="() => generateComplaint(complaint)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </FormCard>
</template>

<script setup>
import { Notify, Dialog as dialog } from "quasar";
import { ref, onBeforeMount, onMounted, watch, provide, computed } from "vue";
import FormCard from "src/components/FormCard.vue";
import {
  update,
  create,
  onSubmit,
  getMailComplaints,
} from "src/composables/remote";
import { simpleSearch } from "src/composables/searchProvider";
import { useDefaultStore } from "src/stores/store";
import Clipboard from "src/utils/clipboard.js";
import StatusInput from "./StatusInput.vue";
import ComplaintForm from "./ComplaintForm.vue";

const store = useDefaultStore();
const complaintDialog = ref(false);
const form = ref(null);
const update_fileNumber = ref(false);
const update_outdate = ref(false);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const SEARCH_FIELDS = ["Title", "Source", "Address"];
const complaint = ref({});
//const complaints = ref([]);
const complaintFormRef = ref(null);
const statusOptions = ["Open", "Dispatched", "Treated", "KIV", "Closed"];
const loading = ref(false);
const mail = computed({
  get: () => store.currentDocument || { IsComplaint: false },
  set: (v) => (store.currentDocument = v || { IsComplaint: false }),
});
const commentable = ref(true);
const setMail = (v) => (mail.value = v || { IsComplaint: false });

const validate = async () => await form.value?.validate(true);

function getDocument() {
  return mail.value;
}
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
async function sendToDirector() {
  loading.value = true;
  let assigned = null;
  let action = "Submit";
  let comment = "Sir, please find this mail for your attention. Thank you.";
  if (mail.value?.Location === "Lagos") {
    assigned = store.staffList.find((s) => s.role === "Director");
  } else {
    assigned = store.staffList.find((s) => s.role === "Head Location");
  }
  //console.log(mail);
  //if (true) return;
  onSubmit(comment, assigned, "", mail.value?.id, action)
    .then(() => {
      Notify.create({
        message: "Success",
        caption: "Send Mail",
        color: "teal",
      });
      store.tabModel = "search";
    })
    .catch((error) => {
      console.log(error);
      dialog.create({
        timeout: 3000,
        textColor: "white",
        message: error.message,
        icon: "error",
        iconColor: "white",
        color: "red",
        position: "right",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

function updateFileNumber() {
  store.loading = true;
  update(mail.value.id, { file_number: mail.value.file_number }, "Mails")
    .then((d) => {
      Notify.create({
        title: "File number",
        message: "Updated successfully",
        color: "teal",
        icon: "info",
      });
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
function updateOutDate() {
  // send update file number field
  store.loading = true;
  update(mail.value.id, { out_date: mail.value.out_date }, "Mails")
    .then(() => {
      Notify.create({
        title: "Outgoing date",
        message: "Updated successfully",
        color: "teal",
        icon: "info",
      });
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
function reset() {
  form.value?.resetValidation();
  //store.currentDocument = null;
  mail.value = {};
}

async function generateComplaint(data) {
  if (data) {
    complaintFormRef.value
      .validate()
      .then(() => {
        create(data, "Complaints", ["Title", "CoyName"])
          .then((id) => {
            complaint.value.id = id;
            complaintDialog.value = false;
            update(
              mail.value.id,
              { complaint_id: id, IsComplaint: true },
              "Mails"
            )
              .then(() => {})
              .catch((e) => {
                dialog.create({
                  title: "Error",
                  message: e.message,
                });
              });
            Notify.create({
              title: "Complaint",
              message: "Created successfully",
              color: "teal",
              icon: "info",
            });
            store.tabModel = "search";
          })
          .catch((e) => {
            dialog.create({
              title: "Error",
              message: e.message,
              color: "red",
              icon: "error",
            });
          });
      })
      .catch(() => {
        // Do nothing
      });
  } else {
    let _mail = Object.assign({}, mail.value);
    complaint.value.subject = _mail.subject;
    complaint.value.mail_id = _mail.id;
    complaint.value.source = _mail.source;
    complaint.value.address = _mail.sddress;
    complaint.value.status = "Open";
    complaintDialog.value = true;
  }
}

watch(
  () => mail.value?.file_number,
  (newValue) => {
    if (newValue) {
      simpleSearch("Files", { whereFilters: [["FileNumber", "==", newValue]] })
        .then((list) => {
          if (list.length > 0) {
            const file = list[0];
            mail.value.file_id = file.id;
          }
        })
        .catch((e) => {});
    } else {
      mail.value.file_id = null;
    }
    update_fileNumber.value = newValue ? true : false;
  },
  { immediate: true }
);
watch(
  () => mail.value?.out_date,
  (newValue) => {
    //console.log(newValue);
    update_outdate.value = newValue ? true : false;
  }
);
watch(
  () => mail.value?.id,
  async (newValue) => {
    if (newValue) {
      // Load complaint
      if (mail.value?.complaint_id) commentable.value = false;
    }
  },
  { immediate: true }
);
provide("iconName", "mail");
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Mails");
//provide("searchFields", ["Title", "Source", "Address"]);
onMounted(async () => {});
onBeforeMount(() => {
  store.loading = false;
});

defineExpose({ validate, reset });
</script>
<style></style>
