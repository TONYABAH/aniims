<template>
  <q-form ref="form" class="q-gutter-sm">
    <q-separator spaced inset vertical dark />
    <!--<label>Complaint ID *</label>-->
    <q-input
      v-model="complaint.id"
      type="text"
      label="Complaint ID"
      outlined
      filled
      square
      readonly=""
      v-if="complaint.id"
    >
      <template v-slot:append>
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color=""
          id="copy_btn0"
          icon="content_copy"
          @click.stop="(e) => copyToClipboard(e, complaint.id)"
        >
        </q-btn>
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Mail ID</label>
    <q-input v-model="complaint.MailId" type="text" outlined filled square>
      <template v-slot:append>
        <q-btn
          :loading="loadingMailId"
          unelevated
          flat
          color=""
          label="Update"
          @click.stop="updateMailId"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
          </template>
        </q-btn>
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Complaint title *</label>
    <q-input
      outlined
      filled
      square
      v-model="complaint.Title"
      type="text"
      :rules="[(val) => !!val || 'Title is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Contact name *</label>
    <q-input
      v-model="complaint.Source"
      type="text"
      :rules="[(val) => !!val || 'Source is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      filled
      square
    />
    <q-separator spaced inset vertical dark />
    <label>Contact phone *</label>
    <q-input
      v-model="complaint.Phone"
      type="text"
      outlined
      filled
      square
      :rules="[(val) => !!val || 'Address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <label>Contact email</label>
    <q-input
      v-model="complaint.Email"
      type="email"
      label="Contact email address"
      hide-bottom-space=""
      outlined
      filled
      square
    >
    </q-input>
    <div class="row q-col-gutter-sm">
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6"></div>
      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6"></div>
    </div>
    <q-separator spaced inset vertical dark />
    <label>Contact address</label>
    <q-input
      v-model="complaint.Address"
      type="text"
      hide-bottom-space=""
      outlined
      filled
      square
    />
    <q-separator spaced inset vertical dark />
    <label>Company name</label>
    <q-input outlined filled square v-model="complaint.CoyName" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Company address</label>
    <q-input outlined filled square v-model="complaint.CoyAddress" type="text">
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(complaint.CoyAddress)"
        v-if="complaint.CoyAddress"
      />
      <template v-slot:prepend>
        <q-btn
          dense
          unelevated
          glossy
          color="teal"
          icon="map"
          @click="onPreviewMap"
          v-if="complaint.Lat && complaint.Lng"
        />
      </template>
    </q-input>
    <q-separator spaced inset vertical dark />
    <label>Company email</label>
    <q-input outlined filled square v-model="complaint.CoyEmail" type="text" />
    <q-separator spaced inset vertical dark />
    <label>Company phone</label>
    <q-input outlined filled square v-model="complaint.CoyPhone" type="text" />

    <div class="q-pl-xs">
      <label
        >Give short details of your complaint
        <q-space />
        <!--<TextEditor
            :Text="complaint.Details"
            :set-text="(v) => (complaint.Details = v)"
            style="border: 4px solid orange"
          />-->
        <textarea
          v-model="complaint.Details"
          rows="5"
          style="border: 4px solid orange"
          class="full-width"
        ></textarea>
      </label>
    </div>
    <template v-if="complaint">
      <TableView
        :data="locations"
        :columns="tableColumns"
        title="Where are the locations?"
        :onAddItem="showAddLocation"
        :onEditItem="showEditLocation"
        :onViewItem="showViewLocation"
        :onRemoveItem="removeLocation"
        :deletable="true"
        :editable="false"
      />

      <q-separator spaced inset vertical dark />
      <label>Attach application letter (pdf)</label>
      <TableView
        :editable="false"
        :deletable="true"
        :data="attachments"
        :columns="document_columns"
        :onAddItem="onAttachLetter"
        :onRemoveItem="onRemoveAttachment"
        :onEditItem="onEditAttachment"
        :onViewItem="onViewAttachment"
      />
    </template>
    <q-dialog v-model="locationPopupModel">
      <q-card>
        <q-card-section class="row items-center bg-teal text-grey-1">
          <q-icon name="location" color="white" />
          <q-toolbar-title> Location</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="reset" />
        </q-card-section>
        <q-card-section>
          <q-scroll-area style="width: 400px; height: 280px">
            <LocationForm
              ref="locationFormRef"
              :data="location"
              :setLocation="setLocation"
            />
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Send" color="primary" @click="addLocation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <FileViewerDialog
      :docTitle="docTitle"
      :fileSource="fileSource"
      :model="fileViewerDialogModel"
      :set-model="(v) => (fileViewerDialogModel = v)"
    />
    <UploadDialog
      :accept="fileTypes"
      v-on:doc-uploaded="onAttachmentUploaded"
      title="Application Letter"
      :model="uploadDialogModel"
      :set-model="(v) => (uploadDialogModel = v)"
    />
    <q-dialog v-model="previewMap" class="full-width">
      <q-card flat class="full-width">
        <GoogleGeoViewer :data="geoData.data" />
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script setup>
import { Notify, Dialog as dialog } from "quasar";
import { useDefaultStore } from "src/stores/store";
import {
  computed,
  onMounted,
  onBeforeUnmount,
  unref,
  ref,
  watch,
  provide,
} from "vue";
import LocationForm from "src/components/forms/LocationForm.vue";
import TableView from "src/components/TableView.vue";
import {
  onAddDocument,
  onDeleteDocument,
  onAddAttachment,
  onDeleteAttachment,
  update,
} from "src/composables/remote";
import FileViewerDialog from "src/components/FileViewerDialog.vue";
import UploadDialog from "src/components/UploadDialog.vue";
//import { onAddAttachment, onDeleteAttachment } from "src/composables/remote";
import Clipboard from "src/utils/clipboard.js";
import { useGeolocation } from "src/composables/use-geocation";
//import CircularProgress from "src/components/CircularProgress.vue";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
//const $q = useQuasar();
const searchFields = ["Title", "CoyName"];
const document_columns = [
  { name: "name", field: "Name", label: "Name", align: "left" },
  { name: "title", field: "Title", label: "Caption", align: "left" },
  // { name: "id", field: "id", label: "ID", align: "left" },
];
const tableColumns = [
  {
    name: "Address",
    label: "Address",
    field: "Address",
    title: "Address",
    align: "left",
  },
];

const props = defineProps({
  data: Object,
  setData: Function,
});
const geo = useGeolocation();
const locationFormRef = ref(null);
const uploadDialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});

const docTitle = ref("");
const fileSource = ref("");
const store = useDefaultStore();
const fileTypes = ref("");
const form = ref(null);
const locationPopupModel = ref(false);
const location = ref({});
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn0");
const loadingMailId = ref(false);
//const clipboard0 = new Clipboard("#copy_btn0");
//const clipboard1 = new Clipboard("#copy_btn1");
//const clipboard2 = new Clipboard("#copy_btn2");

const complaint = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});
const newAttachments = ref([]);
const locations = computed({
  get: () => complaint.value.Locations || [],
  set: (v) => (complaint.value.Locations = v),
});
const attachments = computed({
  get: () => complaint.value.Attachments || [],
  set: (v) => (complaint.value.Attachments = v),
});
const setLocation = (l) => (lLocation.value = l);

function reset() {
  form.value?.resetValidation();
  newAttachments.value.forEach(async (d) => {
    await onDeleteAttachment("Complaints", complaint.value?.id, d)
      .then(() => {
        const index = complaint.value.Attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        complaint.value.Attachments.splice(index, 1);
        const index2 = newAttachments.value?.findIndex(
          (doc) => doc.id === d.id
        );
        newAttachments.value.splice(index2, 1);
      })
      .catch((error) => {
        Notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  });
}
const validate = async () => await form.value?.validate(true);
function updateMailId() {
  loadingMailId.value = true;
  update(complaint.value.id, { MailId: complaint.value.MailId }, "Complaints")
    .then(() => {
      Notify.create({
        textColor: "teal",
        message: "Update success",
        icon: "error",
        iconColor: "teal",
        title: "Success",
      });
    })
    .catch((error) => {
      dialog.create({
        textColor: "red",
        message: error.message,
        icon: "error",
        iconColor: "red",
        title: "Error",
      });
    })
    .finally(() => (loadingMailId.value = false));
}
function showAddLocation(loc) {
  locationPopupModel.value = true;
}
function onAttachLetter() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".pdf";
  //store.documentDialogModel = true;
  uploadDialogModel.value = true;
}

function copyToClipboard(e, val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
async function addLocation(loc) {
  if (!(await locationFormRef.value?.validate())) {
    Dialog.create({
      message: "Please fill form correctly",
      title: "Validation error",
    });
    return;
  }
  const data = Object.assign({}, location.value);
  if (complaint.value?.id) {
    await onAddDocument("Complaints", complaint.value.id, "Locations", data);
    locations.value.push(data);
  } else {
    if (!complaint.value?.Locations) complaint.value.Locations = [data];
    else complaint.value.Locations.push(data);
    //locations.value.push(data);
  }
  //location.value = {};
  locationPopupModel.value = false;
}
async function removeLocation(loc, index) {
  if (complaint.value?.id) {
    await onDeleteDocument(
      "Complaints",
      store.currentDocumentId,
      "Locations",
      loc
    );
  }
  locations.value?.splice(index, 1);
}
function showViewLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}
function showEditLocation(loc, index) {
  location.value = loc;
  locationPopupModel.value = true;
}

function onAttachmentUploaded(doc) {
  //const isLetter = doc.Type === "application/pdf" ? true : false;
  //console.log(doc);
  if (complaint.value.Attachments) complaint.value.Attachments.push(doc);
  else complaint.value.Attachments = [doc];
  newAttachments.value.push(doc);
  if (complaint.value.id) {
    onAddAttachment("Complaints", complaint.value.id, doc)
      .then(() => {
        Notify.create({
          textColor: "teal",
          message: "Document uploaded",
          icon: "error",
          iconColor: "teal",
          title: "Success",
        });
      })
      .catch((error) => {
        dialog.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
          title: "Error",
        });
      });
  }
}

function onRemoveAttachment(d) {
  dialog
    .create({
      noBackdropDismiss: true,
      title: "Delete file",
      message: "Do you want to delete " + d.Title + "?",

      ok: "Yes Delete",
      cancel: true,
    })
    .onOk(() => {
      onDeleteAttachment("Complaints", complaint.value.id, d)
        .then(() => {
          const index = complaint.value.Attachments?.findIndex(
            (doc) => doc.id === d.id
          );
          complaint.value.Attachments.splice(index, 1);
          const index2 = newAttachments.value?.findIndex(
            (doc) => doc.id === d.id
          );
          newAttachments.value.splice(index2, 1);
        })
        .catch((error) => {
          Notify.create({
            textColor: "red",
            message: error.message,
            icon: "error",
            iconColor: "red",
          });
        });
    });
}
async function onEditAttachment(d) {
  //const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
async function onViewAttachment(d) {
  //const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
const onPreviewMap = () => {
  const data = {
    name: complaint.value.CoyAddress,
    data: [
      ["lat", "lng"],
      [complaint.value?.Lat, complaint.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = complaint.value.CoyName
      ? complaint.value.CoyName + ", " + address
      : address;
    const { addr, lat, lng, comp, country, state, city } =
      await geo.getLocation(_address);
    //console.log(Comp);
    dialog
      .create({
        title: "Accept Address?",
        message: "Select Location components to use",
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: "negative",
        },
        persistent: true,
        options: {
          type: "checkbox",
          model: ["address", "location"],
          // inline: true
          items: [
            { label: addr, value: "address", color: "secondary" },
            { label: lat + " " + lng, value: "location", color: "secondary" },
            // { label: Lng, value: "longitude", color: "secondary" },
          ],
        },
      })
      .onOk((data) => {
        if (data.includes("location")) {
          complaint.value.Lat = lat;
          complaint.value.Lng = lng;
        }
        if (data.includes("address")) {
          complaint.value.CoyAddress = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) complaint.value.Country = country.long_name;
        if (state) complaint.value.State = state.long_name;
        if (city) {
          setTimeout(() => (complaint.value.City = city.long_name), 100);
        }
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  } catch (e) {
    //console.log(e);
    Notify.create({
      title: "Error",
      message: e.message || e,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
/*watch(
  complaint,
  (val) => {
    if (val && !complaint.value.Source) {
    }
  },
  { immediate: true }
);*/
defineExpose({
  reset,
  validate,
  data: complaint,
  searchFields,
  collection: "Complaints",
});
provide("iconName", "campaign");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Complaints");
provide("searchFields", ["Title", "Source", "Address"]);
// defineExpose({ reset, save, add })
onMounted(async () => {
  if (!complaint.value?.Locations) {
    //complaint.value.Locations = [];
  }
  if (!complaint.value?.Attachments) {
    //complaint.value.Attachments = [];
  }
  complaint.value.Source = store.user?.displayName;
  complaint.value.Phone = store.user?.phoneNumber;
  complaint.value.Email = store.user?.email;
  complaint.value.uid = store.user?.uid;
  /*complaint.value.CoyName = store.company?.Name;
  complaint.value.CoyAddress = store.company?.Address;
  complaint.value.CoyEmail = store.company?.Email;
  complaint.value.CoyPhone = store.company?.Phone;
  complaint.value.CoyId = store.company?.id;
  */
  complaint.value.ApplicationYear = new Date().getFullYear();
  provide("location", location);
  provide("locations", complaint.value?.Locations);
  //complaint.value = store.currentDocument || {};
});
onBeforeUnmount(() => {
  /* document
    .querySelector("#copy_btn0")
    .removeEventListener("mouseenter", initClipboard);
  document
    .querySelector("#copy_btn1")
    .removeEventListener("mouseenter", initClipboard);
  document
    .querySelector("#copy_btn2")
    .removeEventListener("mouseenter", initClipboard);*/
});
</script>
