<template>
  <q-dialog
    v-model="dialogMmodel"
    persistent=""
    position="right"
    :seamless="false"
    :maximized="false"
  >
    <q-card :style="style">
      <q-toolbar class="bg-transparent">
        <q-avatar
          :icon="iconName"
          color="primary"
          text-color="white"
          size="32px"
          font-size="22px"
        />
        <span class="q-ml-sm">{{ action }}</span>
        <q-space />
        <q-btn flat color="" icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-form ref="form" class="q-gutter-sm">
          <q-select
            v-model="whereTo"
            options-dense
            :options="['Division', 'Police', 'Legal', 'Account']"
            label="Where to?"
            outlined=""
            :rules="[(val) => !!val || 'This field is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
            v-show="isDirector"
          />
          <q-select
            v-model="location"
            :options="store.locations"
            options-dense=""
            label="Location"
            :dark="$q.dark.isActive"
            outlined=""
            clearable=""
            clear-icon="close"
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
            v-show="isDirector"
          />

          <q-select
            v-model="unit"
            :options="units"
            label="Unit"
            options-dense=""
            option-label="Abbrev"
            option-value="Abbrev"
            clearable=""
            clear-icon="close"
            outlined=""
            :rules="[(val) => !!val || 'This field is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
          />
          <q-select
            v-model="assigned"
            :options="staffList"
            label="Staff"
            options-dense=""
            option-label="Name"
            option-value="uid"
            clearable=""
            clear-icon="close"
            outlined=""
            :rules="[(val) => !!val || 'This field is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right" :vertical="$q.screen.lt.sm" class="q-pr-md">
        <!--<q-btn
          v-if="unit && assigned && action === 'Assign'"
          no-caps=""
          unelevated=""
          label="Assign"
          color="purple"
          icon="arrow_right"
          icon-right="person"
          @click="assignDocument"
          glossy=""
        />
        <q-btn
          v-if="unit && assigned && action === 'Submit'"
          no-caps=""
          unelevated=""
          label="Submit"
          color="cyan"
          icon-right="arrow_right"
          icon="perm_identity"
          @click="submitDocument"
          glossy=""
        />-->
        <q-btn
          v-if="unit && assigned"
          no-caps=""
          unelevated=""
          color="primary"
          :label="action"
          :icon-right="iconName"
          icon="perm_identity"
          @click="submitDocument"
          glossy=""
        />
        <q-btn
          no-caps=""
          unelevated=""
          label="Cancel"
          color="negative"
          v-close-popup
          icon=""
          icon-right="close"
          @click="reset"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useQuasar, Notify, Dialog } from "quasar";
import { onAssign, onSubmit } from "src/composables/remote";
//const comment = inject("comment");
//const onAssign = inject("on-assign");
const store = useDefaultStore();
const form = ref(null);
const unit = ref(store.currentDocument?.meta?.Unit);
const location = ref(store.currentDocument?.Location);
const assigned = ref(getFromUser());
const whereTo = ref("Division");
const $q = useQuasar();

const props = defineProps({
  /*comment: String,
  onSuccess: {
    type: Function,
    required: false,
  },*/
  onOk: {
    type: Function,
    required: false,
  },
  onCancel: {
    type: Function,
    default: () => console.log("Assign document cancelled"),
  },
  model: {
    type: Boolean,
    default: false,
  },
  setModel: {
    type: Function,
    required: true,
  },
  action: String,
  iconName: String,
});
const style = computed(() => ($q.screen.lt.sm ? "width:600px" : "width:350px"));

const dialogMmodel = computed({
  get: () => props.model,
  set: (v) => props.setModel(v),
});
const isDirector = computed(() => store.user.claims.role === "Director");

const units = computed(() => {
  return location.value
    ? store.units
        .filter((u) => u.Location === location.value)
        .map((unit) => unit.Abbrev)
    : store.units.map((unit) => unit.Abbrev);
});
const staffList = computed(() => {
  return unit.value
    ? store.staffList.filter((s) => s.Units?.includes(unit.value))
    : store.staffList;
});
function getFromUser() {
  return (
    store.staffList.find((s) => s.uid === store.currentDocument?.meta?.From) ||
    null
  );
}

async function submitDocument() {
  if (!form.value.validate()) return;
  props.onOk(assigned.value, unit.value);
}
/*async function returnDocument(comment) {
  const doc = store.currentDocument;
  const unit = doc.meta.unit;
  const user = doc.meta.From;
  const id = doc.id;
  return await onSubmit(comment, user, unit, id, "Return");
}*/
async function validate() {
  return await form.value?.validate(true);
}
function reset() {
  //store.assignDialogModel = false;
  assigned.value = null;
  unit.value = null;
  form.value.resetValidation();
  props.onCancel()
}
defineExpose({
  reset,
  validate,
});
</script>
