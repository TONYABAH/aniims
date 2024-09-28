<template>
  <q-form ref="form" class="q-gutter-sm" lazy-rules>
    <q-input
      v-model="raid.case_no"
      label="Case Number *"
      type="number"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />
    <q-select
      v-model="raid.type"
      label="Type of raid *"
      :options="RAID_OPTIONS"
      options-dense=""
      :rules="[(val) => !!val || 'Type of raid is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />
    <q-input
      v-model="raid.date"
      label="Date of raid *"
      type="date"
      input-class="q-mt-md q-pb-md"
      clear-icon="clear"
      :rules="[(val) => !!val || 'Date of raid is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label
    />

    <q-input
      v-model="raid.subject"
      label="Nature of offence *"
      type="text"
      :rules="[(val) => !!val || 'Offence is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />

    <q-input
      v-model="raid.address"
      label="Raid location address *"
      type="text"
      outlined
      :rules="[(val) => !!val || 'Location address is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    >
      <q-btn
        flat
        dense
        unelevated
        color="teal"
        icon="map"
        @click="onPreviewMap"
        v-if="raid.lat && raid.lng"
      />
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(raid.address)"
        v-if="raid.Address"
      />
    </q-input>
    <q-select
      v-model="raid.state"
      label="State *"
      :options="states"
      options-dense=""
      outlined
      :rules="[(val) => !!val || 'State is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-select
      v-model="raid.city"
      label="City"
      :options="cities"
      :rules="[(val) => !!val || 'City is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      options-dense=""
      outlined
    />
    <UnitInput
      label="Division"
      :model="raid.unit"
      :set-model="(v) => (raid.unit = v)"
      :rules="[(val) => !!val || 'Division is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      option-value="Abbrev"
      option-label="Name"
    />
    <StaffInput
      multiple
      :model="raid.team"
      :set-model="(v) => (raid.team = v)"
      :rules="[(val) => !!val || 'Team is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      option-value="Name"
      option-label="Name"
      emit-value
      label="Select Team"
    >
    </StaffInput>
    <q-select
      outlined
      label="Team Leader *"
      v-model="raid.team_lead"
      :options="raid.Team"
      :rules="[(val) => !!val || 'Team Leader is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      :multiple="false"
      emit-value
      map-options
      options-dense=""
      option-value="Name"
      option-label="Name"
      :use-chips="false"
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
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <IpoInput
      :model="raid.ipos"
      :set-model="(v) => (raid.ipos = v)"
      :rules="[(val) => !!val || 'Team Leader is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      multiple
      label="Select IPOs"
      option-value="Name"
      option-label="Name"
      emit-value
    />
    <q-input
      label="Number of Mopols *"
      outlined
      mask="number"
      v-model="raid.mopols"
      type="number"
      :rules="[(val) => !!val || 'Number of Mopols is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <StatusInput
      collection-name="Raids"
      :options="['Pending', 'Treated', 'Closed']"
      :documentId="raid?.id"
      :status="raid?.status"
      :set-status="(v) => (raid.status = v)"
      outlined
    />
    <template v-if="raid.id">
      <q-separator spaced inset vertical dark />
      <label class="text-"> Recommendations </label>

      <q-select
        v-model="raid.hod_approval"
        type="checkbox"
        color="secondary"
        :options="['Recommended', 'Declined']"
        options-dense=""
        label="Head of Division"
        outlined
        :disable="store.user.claims.role?.indexOf('Head') !== 0"
      >
        <template v-slot:append>
          <q-btn
            v-if="raid.hod_approval"
            flat
            color="primary"
            :label="raid.hod_approval"
            @click.stop="updateApproval('hod')"
          />
        </template>
      </q-select>
      <q-select
        v-model="raid.lod_approval"
        type="checkbox"
        color="secondary"
        :options="['Recommended', 'Declined']"
        options-dense=""
        label="LOD"
        outlined
        :disable="store.user.claims.unit !== 'LOD'"
      >
        <template v-slot:append>
          <q-btn
            v-if="raid.lod_approval"
            flat
            color="primary"
            :label="raid.lod_approval"
            @click.stop="updateApproval('lod')"
          />
        </template>
      </q-select>
      <q-select
        v-model="raid.dirctor_approval"
        type="checkbox"
        color="secondary"
        :options="['Approved', 'Declined']"
        options-dense
        label="Director"
        outlined
        :disable="store.user.claims.role !== 'Director'"
      >
        <template v-slot:append>
          <q-btn
            v-if="raid.dirctor_approval"
            flat
            color="primary"
            :label="raid.dirctor_approval"
            @click.stop="updateApproval"
          />
        </template>
      </q-select>
    </template>
  </q-form>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, provide, ref, watch } from "vue";
import TextEditor from "src/components/TextEditor.vue";
import { useStates, useCities, useGeolocation } from "src/composables/use-fn";
import { Dialog, Notify } from "quasar";
import { simpleSearch } from "src/composables/searchProvider";
import StatusInput from "./StatusInput.vue";
import { update } from "src/composables/remote";
import StaffInput from "./StaffInput.vue";
import IpoInput from "./IpoInput.vue";
import UnitInput from "./UnitInput.vue";

const RAID_OPTIONS = ["Hawkers raid", "Investigative raid", "Mop up"];
const form = ref(null);
const geo = useGeolocation();
const store = useDefaultStore();
const product = ref({});
const unitFilter = ref();
const loading = ref(false);
const previewMap = ref(false);
const geoData = ref({});

const props = defineProps({
  model: {
    type: Object,
    default: () => {},
  },
  setModel: Function,
});
const raid = computed({
  get: () => props.model || {},
  set: (v) => props.setModel(v || {}),
});
const location = ref(raid.value.location);
const states = useStates("Nigeria");
const cities = computed(() => useCities(raid.value.state));

const staffList = computed(() => {
  return store.staffList.filter((s) =>
    unitFilter.value ? s.Units?.includes(unitFilter.value.abbrev) : s
  );
});

function reset() {
  form.value?.resetValidation();
}

const validate = async () => await form.value?.validate(true);

const onPreviewMap = () => {
  const data = {
    name: raid.value.address,
    data: [
      ["lat", "lng"],
      [raid.value?.lat, raid.value?.lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = raid.value.name ? raid.value.name + ", " + address : address;
    const { addr, lat, lng, comp, country, state, city } =
      await geo.getLocation(_address);
    //console.log(Comp);
    Dialog.create({
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
          raid.value.lat = lat;
          raid.value.lng = lng;
        }
        if (data.includes("address")) {
          raid.value.Address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) raid.value.country = country.long_name;
        if (state) raid.value.state = state.long_name;
        if (city) {
          setTimeout(() => (raid.value.city = city.long_name), 100);
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
function updateApproval(level) {
  let data = { dirctor_approval: raid.value.dirctor_approval };
  if (level === "hod") {
    data = { hod_approval: raid.value.hod_approval };
  } else if (level === "lod") {
    data = { lod_approval: raid.value.lod_approval };
  }
  store.loading = true;

  update(raid.value.id, data, "Raids")
    .then((d) => {
      Notify.create({
        title: "Success",
        message: "Update succeeded",
        position: "right",
        ok: {
          color: "teal",
        },
        timeout: 1000,
      });
    })
    .catch((e) => {
      Notify.create({
        title: "Error",
        message: e.message,
        position: "right",
        ok: {
          color: "negative",
        },
        timeout: 1000,
      });
    })
    .finally(() => {
      store.loading = false;
    });
}
watch(
  () => raid.value.State,
  (val, oldVal) => {
    if (oldVal !== undefined) raid.value.City = null;
  }
);

watch(
  () => raid.value?.case_no,
  (newValue) => {
    if (newValue && !raid.value.case_id) {
      simpleSearch("Investigations", {
        whereFilters: [["CaseNumber", "==", Number(newValue)]],
      })
        .then((list) => {
          //console.log(typeof newValue);
          if (list.length > 0) {
            raid.value.CaseId = list[0].id;
          } else {
            raid.value.CaseId = null;
          }
        })
        .catch((e) => {});
    } else {
      raid.value.CaseId = null;
    }
    //update_fileNumber.value = newValue ? true : false;
  },
  { immediate: false }
);
provide("suspect", {});
provide("product", product);
provide("location", location);
provide("iconName", "hub");
provide("titleField", "subject");
provide("secondTitle", "date");
provide("collection", "Raids");
provide("searchFields", ["subject", "location"]);

defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  if (!raid.value.products_evacuated) {
    raid.value.products_evacuated = [];
  }
  if (!raid.value.products_hold) {
    raid.value.products_hold = [];
  }
  provide("product", product);
  //console.log(store.user.claims);
});
</script>
