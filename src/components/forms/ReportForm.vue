<template>
  <q-form ref="formRef" class="q-pa-xs" style="overflow: hidden">
    <q-toolbar class="bg-transparent" v-if="header">
      <q-icon name="edit" />
      <q-toolbar-title> {{ header || "Write a report" }} </q-toolbar-title>
    </q-toolbar>
    <q-input
      v-model="report.subject"
      type="text"
      outlined
      label="Title"
      stack-label=""
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
    >
      <q-btn
        v-if="route.hash && !route.params.id"
        flat
        size="lg"
        color="primary"
        icon="arrow_right"
        :to="navLink"
      />
    </q-input>

    <q-separator spaced inset vertical dark />

    <TextEditor
      class="q-my-sm"
      :Text="report.body"
      :setText="setReportText"
      max-height="10rem"
      placeholder="Enter report text..."
    />

    <div class="bg-" align="left">
      <q-btn
        label="Reset"
        type="reset"
        color="negative"
        unelevated=""
        class="q-mr-sm"
        @click="reset"
        v-if="report?.id || report?.body || report?.subject"
      />
      <q-btn
        label="Submit report"
        color="secondary"
        unelevated=""
        :loading="loading"
        @click="addReport"
        v-if="loading || (!report?.id && report?.body && report?.subject)"
      >
        <template v-slot:loading>
          <q-spinner-hourglass />
          Saving...
        </template>
      </q-btn>
    </div>
  </q-form>
</template>
<script setup>
import { computed, ref } from "vue";
import { Dialog as dialog } from "quasar";
import TextEditor from "src/components/TextEditor.vue";
import { addChildDocument } from "src/composables/remote.js";
import { useDefaultStore } from "src/stores/store";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useDefaultStore();
const loading = ref(false);
const formRef = ref(null);
const props = defineProps({
  caseId: String,
  data: {
    type: Object,
  },
  setData: Function,
  header: {
    type: String,
    default: null,
  },
});
const report = computed({
  get: () => props.data || {},
  set: (v) => props.setData(v),
});
const navLink = computed(() => {
  const hash = route.hash?.substring(1);
  return `/Investigations/${hash}/Reports/#${props.data.id}`;
});
function setReportText(v) {
  report.value.Text = v;
}
function onAddReport() {
  report.value = {};
}

async function addReport() {
  const valid = await validate();
  if (!valid) return;
  if (!report.value?.Text) return;
  loading.value = true;
  const data = report.value;
  data.Date = new Date().toISOString();

  addChildDocument("Investigations", props.case_id, "Reports", data)
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
  formRef.value?.resetValidation();
}
const validate = async () => await formRef.value?.validate(true);

defineExpose({
  reset,
  validate,
  report,
});
</script>
