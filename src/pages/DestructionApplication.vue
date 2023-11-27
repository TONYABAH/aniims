<template>
  <q-card flat class="my-card bg-transparent">
    <q-form ref="form" class="q-gutter-sm q-my-md">
      <q-separator spaced inset vertical dark />
      <label>Contact name *</label>
      <q-input
        v-model="destruction.ContactName"
        type="text"
        name="contact-name"
        :rules="[(val) => !!val || 'Name is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined=""
        square=""
      />
      <q-separator spaced inset vertical dark />
      <label>Contact email *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.ContactEmail"
        type="text"
        name="contact-email"
        :rules="[(val) => !!val || 'Email is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Contact phone *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.ContactPhone"
        type="text"
        name="contact-phone"
        :rules="[(val) => !!val || 'Phone number is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Company name *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.CoyName"
        type="text"
        :rules="[(val) => !!val || 'Company name is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Company address *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.CoyAddress"
        type="text"
        :rules="[(val) => !!val || 'Company address is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <q-btn
          unelevated
          glossy
          color="teal"
          :label="$q.screen.gt.xs ? 'Validate' : ''"
          @click="onValidateAddress(destruction.CoyAddress)"
          v-if="destruction.CoyAddress"
        />
        <template v-slot:prepend>
          <q-btn
            dense
            unelevated
            glossy
            color="teal"
            icon="map"
            @click="onPreviewMap"
            v-if="destruction.Lat && destruction.Lng"
          />
        </template>
      </q-input>
      <q-separator spaced inset vertical dark />
      <label>Company email *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.CoyEmail"
        type="text"
        :rules="[(val) => !!val || 'Company email is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Company phone *</label>
      <q-input
        outlined
        square=""
        v-model="destruction.CoyPhone"
        type="text"
        :rules="[(val) => !!val || 'Company phone number is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Application title*</label>
      <q-input
        outlined
        square=""
        v-model="destruction.Title"
        type="text"
        :rules="[(val) => !!val || 'Application title is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-separator spaced inset vertical dark />
      <label>Type of destruction*</label>
      <q-select
        optionsDense=""
        v-model="destruction.Type"
        :options="destructionOptions"
        :rules="[(val) => !!val || 'Type of destruction is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined
        square=""
      />
      <template
        v-if="
          destruction?.Type === 'Private' || destruction?.Type === 'Special'
        "
      >
        <q-separator spaced inset vertical dark />
        <label>Site of destruction *</label>
        <q-input
          outlined
          v-model="destruction.Site"
          type="text"
          :rules="[(val) => !!val || 'Type of destruction is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          square=""
        />
        <q-separator spaced inset vertical dark />
        <label>State *</label>
        <q-select
          optionsDense=""
          v-model="destruction.State"
          :options="states"
          :rules="[(val) => !!val || 'State is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined
          square=""
        />
        <q-separator spaced inset vertical dark />
        <label>City *</label>
        <q-select
          v-model="destruction.City"
          :options="cities"
          options-dense=""
          :rules="[(val) => !!val || 'City is required']"
          lazy-rules="ondemand"
          hide-bottom-space=""
          outlined=""
          square=""
        />
      </template>
      <q-separator spaced inset vertical dark />
      <q-input
        outlined
        dense
        v-model="destruction.Reason"
        type="text"
        label="Reason(s) for description *"
        :rules="[(val) => !!val || 'Reason for destruction is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        square=""
      />

      <q-separator spaced inset vertical dark />
      <!--<LocationForm  ref="locationForm" />-->
      <q-separator spaced inset vertical dark />
      <label>Product location address *</label>
      <q-input
        outlined
        v-model="destruction.ProductAddress"
        type="text"
        :rules="[(val) => !!val || 'Reason for destruction is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        square=""
      />
      <q-separator spaced inset vertical dark />
      <label>Product types *</label>
      <q-select
        outlined=""
        v-model="destruction.ProductCategories"
        :options="store.productCategories"
        :rules="[(val) => !!val || 'Product type is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        multiple
        emit-value
        map-options
        options-=""
        options-dense=""
        :use-chips="false"
        square=""
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item dense v-bind="itemProps">
            <q-item-section thumbnail="">
              <q-checkbox
                left-label
                :model-value="selected"
                @update:model-value="toggleOption(opt)"
                size="xs"
              />
              <!--<q-toggle
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />-->
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-separator spaced inset vertical dark />
      <label>Destruction methods *</label>
      <q-select
        outlined=""
        v-model="destruction.Methods"
        :options="store.destructionMetods"
        multiple
        emit-value
        map-options
        options-=""
        options-dense=""
        :use-chips="false"
        square=""
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item dense v-bind="itemProps">
            <q-item-section thumbnail="">
              <q-checkbox
                left-label
                :model-value="selected"
                @update:model-value="toggleOption(opt)"
                size="xs"
              />
              <!--<q-toggle
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />-->
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-separator spaced inset vertical dark />
      <label>Proposed destruction date *</label>
      <q-input
        outlined
        v-model="destruction.ProposedDate"
        type="date"
        input-class="q-mt-sm"
        clearable=""
        clear-icon="clear"
        square=""
      />

      <q-separator spaced inset vertical dark />
      <template v-if="true">
        <label>Attach application letter (pdf)</label>
        <TableView
          :editable="false"
          :deletable="true"
          :data="letters"
          :columns="document_columns"
          :onAddItem="onAttachLetter"
          :onRemoveItem="onRemoveAttachment"
          :onEditItem="onEditAttachment"
          :onViewItem="onViewAttachment"
        />
        <q-separator spaced inset vertical dark />
        <label>Attach product list (Spreadsheet)</label>
        <TableView
          :editable="false"
          :deletable="true"
          :data="inventory"
          :columns="document_columns"
          :onAddItem="onAttachList"
          :onRemoveItem="onRemoveAttachment"
          :onEditItem="onEditAttachment"
          :onViewItem="onViewAttachment"
        />
        <q-separator spaced inset vertical dark />
      </template>
    </q-form>
  </q-card>
  <FileViewerDialog
    :docTitle="docTitle"
    :fileSource="fileSource"
    :model="fileViewerDialogModel"
    :set-model="(v) => (fileViewerDialogModel = v)"
  />
  <UploadDialog
    :accept="fileTypes"
    :model="uploadDialogModel"
    :set-model="(v) => (uploadDialogModel = v)"
    v-on:doc-uploaded="onAttachmentUploaded"
    title="Application Letter"
  />
  <q-dialog v-model="previewMap" class="full-width">
    <q-card flat class="full-width">
      <GoogleGeoViewer :data="geoData.data" />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { Notify as notify, Dialog as dialog } from "quasar";
import { ref, watch, computed, onMounted } from "vue";
import TableView from "src/components/TableView.vue";
import { useStates, useCities } from "../composables/address-use";
import { useDefaultStore } from "src/stores/store";
import FileViewerDialog from "src/components/FileViewerDialog.vue";
import UploadDialog from "src/components/UploadDialog.vue";
import { getStorage, ref as reference, getDownloadURL } from "firebase/storage";
import { onAddAttachment, onDeleteAttachment } from "../composables/remote";
import { useGeolocation } from "src/composables/use-geocation";
//import { Dialog, Notify } from "quasar";
import CircularProgress from "src/components/CircularProgress.vue";
import GoogleGeoViewer from "src/components/dashboard/GoogleGeoViewer.vue";
//import stateOptions from "../data/states.json";
//import cities from "../data/cities.json";
//import LocationForm from "./LocationForm.vue";

const geo = useGeolocation();
const props = defineProps({
  data: Object,
  setData: Function,
});
const document_columns = [
  { name: "name", field: "Name", label: "Name", align: "left" },
  { name: "title", field: "Title", label: "Caption", align: "left" },
  // { name: "id", field: "id", label: "ID", align: "left" },
];
const searchFields = ["Title", "CoyName"];
//const _destuction = ref(props.data);
const destruction = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});

const uploadDialogModel = ref(false);
const fileViewerDialogModel = ref(false);
const states = useStates("Nigeria");
const cities = computed(() => useCities(destruction.value.State));
const store = useDefaultStore();
const destructionOptions = ["Private", "Special", "General"];
const collection = "Destructions";
const form = ref(null);
const fileTypes = ref("");
const docTitle = ref("");
const fileSource = ref("");
const newAttachments = ref([]);
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});

const letters = computed({
  get: () =>
    destruction.value?.Attachments?.filter(
      (f) => f.Type === "application/pdf"
    ) || [],
  //set: (v) => destruction.value?.Attachments = v
});
const inventory = computed({
  get: () =>
    destruction.value?.Attachments?.filter(
      (f) => f.Type !== "application/pdf"
    ) || [],
  //set: (v) => destruction.value?.Attachments = v
});

watch(
  () => destruction.value.State,
  (val) => {
    destruction.value.City = null;
  }
);
function reset() {
  form.value?.resetValidation();
  newAttachments.value.forEach(async (d) => {
    await onDeleteAttachment("Complaints", destruction.value?.id, d)
      .then(() => {
        const index = destruction.value.Attachments?.findIndex(
          (doc) => doc.id === d.id
        );
        destruction.value.Attachments.splice(index, 1);
        const index2 = newAttachments.value?.findIndex(
          (doc) => doc.id === d.id
        );
        newAttachments.value.splice(index2, 1);
      })
      .catch((error) => {
        notify.create({
          textColor: "red",
          message: error.message,
          icon: "error",
          iconColor: "red",
        });
      });
  });
}
const validate = async () => await form.value?.validate(true);

function onAttachLetter() {
  //productListRef.value.pickFiles();
  fileTypes.value = ".pdf";
  //store.documentDialogModel = true;
  uploadDialogModel.value = true;
}
function onAttachList() {
  fileTypes.value = [".xls", ".xlsx"].join(",");
  //productListRef.value.pickFiles();
  //store.documentDialogModel = true;
  uploadDialogModel.value = true;
}
function onAttachmentUploaded(doc) {
  /*const isLetter = doc.Type === "application/pdf" ? true : false;
  if (isLetter)
    destruction.value.Attachments
      ? destruction.value.Attachments.push(doc)
      : (destruction.value.Attachments = [doc]);
  else
    destruction.value.Inventory
      ? destruction.value.Inventory.push(doc)
      : (destruction.value.Inventory = [doc]);
      */
  destruction.value.Attachments
    ? destruction.value.Attachments.push(doc)
    : (destruction.value.Attachments = [doc]);

  newAttachments.value.push(doc);

  if (destruction.value.id) {
    onAddAttachment(collection, destruction.value.id, doc)
      .then(() => {
        notify.create({
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
      onDeleteAttachment(collection, destruction.value.id, d)
        .then(() => {
          const index = destruction.value.Attachments?.findIndex(
            (doc) => doc.id === d.id
          );
          destruction.value.Attachments.splice(index, 1);

          const index2 = newAttachments.value?.findIndex(
            (doc) => doc.id === d.id
          );
          newAttachments.value.splice(index2, 1);
        })
        .catch((error) => {
          notify.create({
            textColor: "red",
            message: error.message,
            icon: "error",
            iconColor: "red",
          });
        });
    });
}

async function onEditAttachment(d) {
  const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
async function onViewAttachment(d) {
  const storage = getStorage();
  //const path = "http://localhost:3000/upload/" + d.id;
  //const url = await getDownloadURL(reference(storage, "files/" + d.id));
  fileSource.value = d.downloadURL;
  docTitle.value = d.Title;
  fileViewerDialogModel.value = true;
}
const onPreviewMap = () => {
  const data = {
    name: destruction.value.CoyAddress,
    data: [
      ["lat", "lng"],
      [destruction.value?.Lat, destruction.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = destruction.value.CoyName
      ? destruction.value.CoyName + ", " + address
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
          destruction.value.Lat = lat;
          destruction.value.Lng = lng;
        }
        if (data.includes("address")) {
          destruction.value.CoyAddress = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) destruction.value.Country = country.long_name;
        if (state) destruction.value.State = state.long_name;
        if (city) {
          setTimeout(() => (destruction.value.City = city.long_name), 100);
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
    notify.create({
      title: "Error",
      message: e.message || e,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
defineExpose({
  reset,
  validate,
  data: destruction,
  searchFields,
  collection: "Destructions",
});
/*watch(
  destruction,
  (val) => {
    if (val && !val.ContactName) {
    }
  },
  { immediate: true }
);*/
onMounted(() => {
  destruction.value.ContactName = store.user?.displayName;
  destruction.value.ContactPhone = store.user?.phoneNumber;
  destruction.value.ContactEmail = store.user?.email;
  destruction.value.uid = store.user?.uid;
  destruction.value.CoyName = store.company?.Name;
  destruction.value.CoyAddress = store.company?.Address;
  destruction.value.CoyEmail = store.company?.Email;
  destruction.value.CoyPhone = store.company?.Phone;
  destruction.value.CoyId = store.company?.id;
  destruction.value.ApplicationYear = new Date().getFullYear();
});
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
