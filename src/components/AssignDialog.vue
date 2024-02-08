<template>
  <q-dialog
    v-model="dialogMmodel"
    persistent=""
    position="right"
    :seamless="false"
    :maximized="false"
  >
    <q-card style="max-width: 250px">
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
            v-model="location"
            :options="store.locations"
            options-dense=""
            label="Location"
            :dark="$q.dark.isActive"
            outlined=""
            clearable=""
            clear-icon="close"
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
            v-show="isDirector || isHod || isAdmin"
          />
          <q-select
            v-model="whereTo"
            options-dense
            :options="['Division', 'Police']"
            label="Where to?"
            outlined=""
            :rules="[(val) => !!val || 'This field is required']"
            lazy-rules="ondemand"
            hide-bottom-space=""
            :color="$q.dark.isActive ? 'white' : 'grey-10'"
            v-show="isDirector || isHod || isAdmin"
          />
          <template v-if="whereTo === 'Division'">
            <unit-input
              :set-model="(v) => (unit = v)"
              :model="unit"
              dense
              outlined
              title="Unit"
              label="Unit in charge"
              placeholder=""
              :search-options="{ location: location }"
            />
            <staff-input
              :set-model="(v) => (assigned = v)"
              :model="assigned"
              dense
              outlined
              title="Minuted to who?"
              label="name"
              placeholder=""
              :search-options="{
                location: location,
                unit: unit?.Abbrev,
              }"
            />
          </template>
          <template v-else>
            <q-select
              v-model="unit"
              :options="unit_options"
              label="Unit"
              options-dense=""
              clearable=""
              clear-icon="close"
              outlined=""
              :rules="[(val) => !!val || 'This field is required']"
              lazy-rules="ondemand"
              hide-bottom-space=""
              :color="$q.dark.isActive ? 'white' : 'grey-10'"
            />
            <IpoInput
              :set-model="(v) => (assigned = v)"
              :model="assigned"
              dense
              outlined
              title="Minuted to who?"
              label="name"
              placeholder=""
              :search-options="{
                location: location,
                unit: unit,
              }"
            />
          </template>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" :vertical="$q.screen.lt.sm" class="q-pr-md">
        <q-btn
          v-if="unit && assigned"
          no-caps=""
          unelevated=""
          color="primary"
          icon="perm_identity"
          glossy=""
          :label="action"
          :icon-right="iconName"
          :loading="loading"
          @click="submitDocument"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Wait...
          </template>
        </q-btn>
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
import { useQuasar } from "quasar";
import { ref, computed, inject } from "vue";
import { useDefaultStore } from "src/stores/store";
import { useIpoList, useStaffList } from "src/composables/use-fn";
import UnitInput from "src/components/forms/UnitInput.vue";
import StaffInput from "src/components/forms/StaffInput.vue";
import IpoInput from "src/components/forms/IpoInput.vue";

const store = useDefaultStore();
const form = ref(null);
const location = ref(store.currentDocument?.Location);
const assigned = ref(getFromUser());
const whereTo = ref("Division");
const $q = useQuasar();
const unit_options = ["NAFDAC Police", "FTF Police"];
const props = defineProps({
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
  loading: Boolean,
});

const _unit = ref(store.currentDocument?.unit || store.user?.claims?.unit);

const unit = computed({
  get: () => _unit.value,
  set: (v) => (_unit.value = v),
});
const style = computed(() =>
  $q.screen.lt.sm ? "max-width:600px" : "max-width:250px"
);

const dialogMmodel = computed({
  get: () => props.model,
  set: (v) => props.setModel(v),
});
const isDirector = computed(() => store.user.claims.role === "Director");
const isAdmin = computed(() => store.user.claims.admin === true);
const isHod = computed(() => store.user.claims.role === "Head Location");

/*const units = computed(() => {
  if (whereTo.value === "Police") {
    return ["NAFDAC Police", "FTF Police"];
  }
  return location.value
    ? store.units
        .filter((u) => u.Location === location.value)
        .map((unit) => unit.Abbrev)
    : store.units.map((unit) => unit.Abbrev);
});
const staffList = computed(() => {
  if (whereTo.value === "Police") {
    const ipoList = useIpoList({ unit: unit.value });
    //console.log(unit.value, list);
    return ipoList;
  }
  const staffList = useStaffList({ unit: unit.value });
  let results = unit.value
    ? staffList.value.filter((s) => s.Unit === unit.value?.Abbrev)
    : staffList;
  let director = store.staffList.find((s) => s.Role === "Director");
  //console.log(unit.value, staffList, results);
  results.value?.unshift(director);

  return results || [];
});*/
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

async function validate() {
  return await form.value?.validate(true);
}
function reset() {
  //store.assignDialogModel = false;
  assigned.value = null;
  unit.value = null;
  form.value.resetValidation();
  props.onCancel();
}
defineExpose({
  reset,
  validate,
});
</script>
