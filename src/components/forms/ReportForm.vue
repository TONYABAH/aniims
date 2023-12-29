<template>
  <q-form ref="reportFormRef" class="q-pa-xs">
    <q-toolbar class="bg-transparent">
      <q-icon name="edit" />
      <q-toolbar-title> Write a report </q-toolbar-title>
    </q-toolbar>
    <q-input
      v-model="report.Title"
      type="text"
      outlined=""
      borderless=""
      square=""
      :color="$q.dark.isActive ? store.theme.color.normal : 'text-grey-9'"
      :class="
        $q.dark.isActive
          ? store.theme.bg.dark + ' text-grey-1'
          : 'bg-white text-grey-10'
      "
      :rules="[(val) => !!val || 'Title is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      placeholder="Enter report title..."
    />

    <TextEditor
      class="q-mb-sm"
      :Text="report.Text"
      :setText="setReportText"
      placeholder="Enter report text..."
    />
    <div class="bg-" align="left">
      <q-btn
        label="Submit report"
        color="secondary"
        unelevated=""
        :loading="loading"
        @click="addReport"
        v-if="loading || (!report?.id && report?.Text && report?.Title)"
      >
        <template v-slot:loading>
          <q-spinner-hourglass />
          Saving...
        </template>
      </q-btn>
      <q-btn
        label="Reset"
        type="reset"
        color="negative"
        unelevated=""
        class="q-ml-sm"
        @click="reset"
        v-if="report?.id || report?.Text || report?.Title"
      />
    </div>
  </q-form>
</template>
<script setup>
import { computed, ref } from "vue";
import { Dialog as dialog } from "quasar";
import TextEditor from "src/components/TextEditor.vue";
import { addChildDocument } from "src/composables/remote.js";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const props = defineProps({
  caseId: String,
  data: {
    type: Object,
    default: () => {},
  },
  setData: Function,
});
const report = computed({
  get: () => props.data || {},
  set: (v) => props.setData(v),
});
const reportFormRef = ref(null);
const loading = ref(false);

function setReportText(v) {
  report.value.Text = v;
}
function onAddReport() {
  report.value = {};
}
async function validateReport() {
  return await reportFormRef.value?.validate(true);
}
async function addReport() {
  const valid = await validateReport();
  if (!valid) return;
  if (!report.value?.Text) return;
  loading.value = true;
  const data = report.value;
  data.Date = new Date().toISOString();
  addChildDocument("Cases", props.caseId, "Reports", data)
    .then((id) => {
      report.value.id = id;
      onAddReport();
    })
    .catch((e) => {
      dialog.create({
        message: e.message,
        title: "Error",
      });
    })
    .finally(() => (loading.value = false));
}

function reset() {
  props.setData({});
  reportFormRef.value?.resetValidation();
}
const validate = async () => await reportFormRef.value?.validate(true);

defineExpose({
  reset,
  validate,
});
</script>
