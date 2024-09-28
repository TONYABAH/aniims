<template>
  <q-dialog seamless v-model="dialogModel" persistent :position="position">
    <q-card class="q-ma-md">
      <q-bar class="items-center bg-primary text-white">
        <q-avatar icon="folder_open" color="red" text-color="white" />
        <q-toolbar-title>Upload Document</q-toolbar-title>
        <q-btn
          dense
          noCaps=""
          unelevated=""
          icon="close"
          color="primary"
          class="float-right"
          @click="handleCancel"
        />
      </q-bar>

      <q-card-section class="items-center">
        <q-input
          v-model="doc_title"
          name="docTitle"
          type="text"
          label="Document title"
          outlined=""
        />
        <q-separator spaced inset vertical dark />
        <q-file
          ref="fileRef"
          label="Attach file"
          bottom-slots
          counter
          outlined=""
          v-model="fileModel"
          :accept="accept"
          :max-file-size="maxFileSize"
          :multiple="false"
        >
          <template v-slot:prepend>
            <q-icon name="attachment" @click.stop.prevent />
          </template>
          <template v-slot:append v-if="fileModel">
            <q-icon
              name="close"
              @click.stop.prevent="fileModel = null"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:hint> File size </template>
        </q-file>
      </q-card-section>

      <q-toolbar class="bg-grey-8">
        <q-btn
          noCaps=""
          unelevated=""
          label="Upload"
          icon="cloud_upload"
          color="cyan"
          glossy
          :loading="loading"
          :percentage="progress"
          class="full-width"
          @click="handleUpload"
          :disable="!fileModel || !doc_title"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Uploading...
          </template>
        </q-btn>
        <q-btn
          noCaps=""
          unelevated=""
          label="Cancel"
          color="primary"
          class="float-right q-ml-xs"
          @click="handleCancel"
        />
      </q-toolbar>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
//import { useDefaultStore } from "src/stores/store";
import { Notify } from "quasar";
import { uploadFile } from "../composables/remote";

const emits = defineEmits(["doc-uploaded"]);

const fileRef = ref(null);
//const store = useDefaultStore();
const fileModel = ref(null);
const progress = ref(0);
var uploadTask = null;
const _maxsize = ref(2113568); // 2MB
const loading = ref(false);

const props = defineProps({
  accept: {
    type: String,
    default: () => [".pdf", ".jpg", ".png", ".jpeg"].join(","),
  },
  title: {
    type: String,
    default: "Attachment",
  },
  maxSize: {
    type: Number,
    default: 2113568 * 10, // 20MB
  },
  position: {
    type: String,
    default: "right",
  },
  model: Boolean,
  setModel: Function,
});
const maxFileSize = computed({
  get: () => _maxsize.value,
  set: (v) => (_maxsize.value = v),
});
const dialogModel = computed({
  get: () => props.model,
  set: (v) => props.setModel(v),
});
const docTitle = ref(props.title);

const handleCancel = () => {
  uploadTask && uploadTask.cancel();
  //store.documentDialogModel = false;
  props.setModel(false);
  fileModel.value = false;
};

function handleUpload() {
  loading.value = true;
  const file = fileModel.value;
  //store.downloadURL = null;
  uploadFile(file, uploadTask, progress, (error, downloadURL, id) => {
    if (error) {
      //console.log(error);
      loading.value = false;
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Upload Error",
        message: error.message,
        icon: "error",
        iconColor: "negative",
        position: "right",
      });
    } else {
      emits("doc-uploaded", {
        Title: doc_title.value,
        Name: file.name,
        Type: file.type,
        id,
        downloadURL,
      });
      //store.downloadURL = downloadURL;
      //store.documentDialogModel = false;
      loading.value = false;
      fileModel.value = null;
      docTitle.value = null;
      props.setModel(false);
    }
  });
}

onBeforeMount(() => {
  fileModel.value = null;
  //maxFileSize.value = props.maxSize
  if (props.accept.includes(".mp4")) {
    maxFileSize.value = 21135680; //20MB
  }
});
</script>
