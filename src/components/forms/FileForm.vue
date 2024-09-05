<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
    :searchFields="SEARCH_FIELDS"
    :commentable="file.id !== undefined"
    collectionName="Files"
  >
    <label>
      NAFDAC/ENFD/{{ file?.Location?.toUpperCase() }}/{{
        file?.FileNumber
      }}/VOL{{ file?.Volume || 1 }}</label
    >
    <q-tabs
      v-model="tab"
      class="text-teal"
      active-color="white"
      active-bg-color="teal"
      shrink=""
      inline-label=""
      align="left"
    >
      <q-tab name="form" icon="edit" label="Form" />
      <q-tab name="mails" icon="mail" label="Mails" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="form">
        <q-form ref="form" class="q-gutter-md">
          <div class="row q-">
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
              <q-separator spaced inset vertical dark />
              <q-input
                v-model="file.FileNumber"
                label="File number *"
                type="text"
                :rules="[(val) => !!val || 'File number is required']"
                lazy-rules="ondemand"
                hide-bottom-space=""
                outlined
                stack-label
                square=""
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    no-caps
                    unelevated
                    color="secondary"
                    id="copy_btn"
                    @click="copyToClipboard(file.FileNumber)"
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
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <q-separator spaced inset vertical dark />
              <q-input
                v-model="file.Volume"
                label="Volume number *"
                type="number"
                :rules="[(val) => !!val || 'Volume is required']"
                lazy-rules="ondemand"
                hide-bottom-space=""
                outlined
                stack-label
                square=""
              />
            </div>
          </div>
          <q-separator spaced inset vertical dark />
          <q-input
            v-model="file.Title"
            label="Subject *"
            type="text"
            :rules="[(val) => !!val || 'Subject is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            outlined
            stack-label
            square=""
          />
          <div class="row q-col-">
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pr-xs">
              <q-select
                label="Location *"
                options-dense=""
                v-model="file.Location"
                :options="options"
                :rules="[(val) => !!val || 'I&E Location is required']"
                lazy-rules="ondemand"
                hide-bottom-space=""
                outlined
                stack-label
                square=""
              />
            </div>
            <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <StatusInput
                collection-name="Files"
                :documentId="file?.id"
                :status="file?.Status"
                :set-status="(v) => (file.Status = v)"
                :rules="[(val) => !!val || 'Status is required']"
                outlined
              />
            </div>
          </div>
        </q-form>
      </q-tab-panel>
      <q-tab-panel name="mails">
        <template v-if="file.id">
          <q-expansion-item
            expand-separator
            icon="mail"
            label="File Mails"
            caption=""
            class=""
            default-opened=""
            style="border: 1px solid"
          >
            <q-table
              dense=""
              title=""
              :rows="mails"
              :columns="mailcols"
              row-key="Title"
              flat=""
              @row-dblclick="showMail"
            />
          </q-expansion-item>
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </FormCard>
</template>

<script setup>
//import { Dialog, Notify } from "quasar";
import { useDefaultStore } from "src/stores/store";
import { onMounted, ref, watch, provide, computed } from "vue";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import { useRouter } from "vue-router";
import FormCard from "src/components/FormCard.vue";
import Clipboard from "src/utils/clipboard.js";
import StatusInput from "./StatusInput.vue";

const router = useRouter();
const store = useDefaultStore();
const db = firestore;
const form = ref(null);
const options = ref(store.locations);
const clipboard_show = ref(false);
const clipboard = new Clipboard("#copy_btn");
const file_number = ref();
const tab = ref("form");

var mails = [];

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  setEditable: Function,
});
const mailcols = [
  {
    name: "InDate",
    field: "InDate",
    label: "Date",
    align: "left",
  },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  { name: "Status", field: "Status", label: "Status", align: "left" },
];
/*const casecols = [
  { name: "Title", field: "Title", label: "Title", align: "left" },

];*/
const updateFields = [];
const SEARCH_FIELDS = ["Subject"];
//const file = ref({});
const file = computed({
  get: () => store.currentDocument || {},
  set: (v) => (store.currentDocument = v || {}),
});
const setDocument = (v) => (file.value = v || {});

function getDocument() {
  return file.value;
}
function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}
function reset() {
  form.value?.resetValidation();
  file.value = {};
}
const validate = async () => await form.value?.validate(true);

const mailsDataSource = computed(() =>
  query(
    collection(db, "Mails"),
    where("FileNumber", "==", file.value.FileNumber),
    where("Location", "==", file.value.Location)
  )
);
//var cases = useCollection(filesDataSource);

function showMail(e, data) {
  router.push("/mails/#" + data.id);
}
watch(file, (f) => {
  if (!f) return;
  file_number.value = `NAFDAC/ENFD/${file.value.Location?.toUpperCase()}/${
    file.value.FileNumber
  }/VOL${file.value.Volume || 1}`;
  if (!f.FileNumber) return;
  mails = useCollection(mailsDataSource);
});
provide("iconName", "folder");
provide("titleField", "Title");
provide("secondTitle", "CreatedAt");
provide("collection", "Files");
provide("searchFields", ["Title", "Name"]);

/*store.fn.currentCollection = "Files";
store.fn.searchFields = ["Title", "Name"];
store.fn.iconName = "folder";
store.fn.reset = reset;
store.fn.validate = validate;
store.fn.setCurrentDoc = setDocument;
store.fn.updateFields = updateFields;
store.fn.getDocument = getDocument;*/
onMounted(async () => {
  //console.log(store.currentCollection);
});

defineExpose({ validate, reset });
</script>
