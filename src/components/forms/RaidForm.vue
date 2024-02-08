<template>
  <q-form ref="form" class="q-gutter-sm" lazy-rules>
    <q-input
      v-model="raid.CaseNumber"
      label="Case Number *"
      type="number"
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />
    <q-select
      v-model="raid.Type"
      label="Type of raid *"
      :options="RAID_OPTIONS"
      options-dense=""
      :rules="[(val) => !!val || 'Type of raid is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />
    <q-input
      v-model="raid.Date"
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
      v-model="raid.Title"
      label="Nature of offence *"
      type="text"
      :rules="[(val) => !!val || 'Offence is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
    />

    <q-input
      v-model="raid.Address"
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
        v-if="raid.Lat && raid.Lng"
      />
      <q-btn
        unelevated
        glossy
        color="teal"
        :label="$q.screen.gt.xs ? 'Validate' : ''"
        @click="onValidateAddress(raid.Address)"
        v-if="raid.Address"
      />
    </q-input>
    <q-select
      v-model="raid.State"
      label="State *"
      :options="states"
      options-dense=""
      outlined
      :rules="[(val) => !!val || 'State is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-select
      v-model="raid.City"
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
      :model="raid.Unit"
      :set-model="(v) => (raid.Unit = v)"
      :rules="[(val) => !!val || 'Division is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      option-value="Abbrev"
      option-label="Name"
    />
    <StaffInput
      multiple
      :model="raid.Team"
      :set-model="(v) => (raid.Team = v)"
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
      v-model="raid.TeamLead"
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
      :model="raid.IPOs"
      :set-model="(v) => (raid.IPOs = v)"
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
      v-model="raid.Mopols"
      type="number"
      :rules="[(val) => !!val || 'Number of Mopols is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <StatusInput
      collection-name="Raids"
      :options="['Pending', 'Treated', 'Closed']"
      :documentId="raid?.id"
      :status="raid?.Status"
      :set-status="(v) => (raid.Status = v)"
      outlined
    />
    <!--<template v-if="raid.Status === 'Treated'">
      <q-separator spaced inset vertical dark />
      <label class="text-"> Reports </label>
      <q-input
        label="Number of arrests *"
        v-model="raid.Suspects"
        type="number"
        :rules="[(val) => !!val || 'Number of arrests is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        outlined=""
      />
      <q-separator spaced inset vertical dark />
      <label>Brief</label>
      <TextEditor
        :Text="raid.Details"
        :set-text="(v) => (raid.Details = v)"
        style="border: 2px solid orange"
        class="q-ml-xs"
      />
    </template>-->
    <template v-if="raid.id">
      <q-separator spaced inset vertical dark />
      <label class="text-"> Recommendations </label>

      <q-select
        v-model="raid.HodApproval"
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
            v-if="raid.HodApproval"
            flat
            color="primary"
            :label="raid.HodApproval"
            @click.stop="updateApproval('hod')"
          />
        </template>
      </q-select>
      <q-select
        v-model="raid.LodApproval"
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
            v-if="raid.LodApproval"
            flat
            color="primary"
            :label="raid.LodApproval"
            @click.stop="updateApproval('lod')"
          />
        </template>
      </q-select>
      <q-select
        v-model="raid.DirApproval"
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
            v-if="raid.DirApproval"
            flat
            color="primary"
            :label="raid.DirApproval"
            @click.stop="updateApproval"
          />
        </template>
      </q-select>
    </template>
  </q-form>

  <!--<q-dialog
      v-model="productPopupModel"
      class=""
      full-height=""
      style="height: 75%"
    >
      <q-card class="full-width" style="overflow: hidden">
        <q-card-section class="row items-center bg-teal text-white">
          <q-icon name="basket" color="white" />
          <q-toolbar-title> Product</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="reset" />
        </q-card-section>
        <q-card-section style="overflow: auto; height: calc(100% - 7rem)">
          <ProductForm
            ref="productFormRef"
            :data="product"
            :setProduct="setProduct"
          />
        </q-card-section>
        <q-card-actions align="center" class="bg-teal">
          <q-btn flat label="Cancel" color="grey-1" v-close-popup />
          <q-btn flat label="Add" color="grey-1" @click="addProduct(product)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="previewMap" class="full-width">
      <q-card flat class="full-width">
        <GoogleGeoViewer :data="geoData.data" />
      </q-card>
    </q-dialog>-->

  <!--<TableView
      :data="productsOnHold"
      :columns="product_columns"
      :onAddItem="() => showAddProduct(1)"
      :onRemoveItem="(p, i) => removeProduct(p, i, 1)"
      :onViewItem="(p, i) => showViewProduct(p, i, 1)"
      :deletable="true"
      :editable="false"
      title="Products on HOLD"
    />
    <TableView
      :data="productsEvacuated"
      :columns="product_columns"
      :onAddItem="() => showAddProduct(0)"
      :onRemoveItem="(p, i) => removeProduct(p, i, 0)"
      :onViewItem="(p, i) => showViewProduct(p, i, 0)"
      :deletable="true"
      :editable="false"
      title="Products Evacuated"
    />-->

  <!--<q-select
        label="Division filter"
        options-dense=""
        v-model="unitFilter"
        :options="store.units"
        option-label="Abbrev"
        option-value="Abbrev"
        outlined
        :clearable="true"
        clear-icon="close"
      />-->
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { computed, onMounted, provide, ref, watch } from "vue";
import TextEditor from "src/components/TextEditor.vue";
import { useStates, useCities, useGeolocation } from "src/composables/use-fn";
import { Dialog, Notify } from "quasar";
import { simpleSearch } from "src/composables/searchProvider";
import StatusInput from "./StatusInput.vue";
import { update, getById } from "src/composables/remote";
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
const location = ref(raid.value.Location);
const states = useStates("Nigeria");
const cities = computed(() => useCities(raid.value.State));

const staffList = computed(() => {
  return store.staffList.filter((s) =>
    unitFilter.value ? s.Units?.includes(unitFilter.value.Abbrev) : s
  );
});

function reset() {
  form.value?.resetValidation();
}

const validate = async () => await form.value?.validate(true);

const onPreviewMap = () => {
  const data = {
    name: raid.value.Address,
    data: [
      ["lat", "lng"],
      [raid.value?.Lat, raid.value?.Lng],
    ],
  };
  geoData.value = data;
  previewMap.value = true;
};
const onValidateAddress = async (address) => {
  loading.value = true;
  //const address = `${location.value.Address}, ${location.value.City}, ${location.value.State}, ${location.value.Country},`;
  try {
    let _address = raid.value.Name ? raid.value.Name + ", " + address : address;
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
          raid.value.Lat = lat;
          raid.value.Lng = lng;
        }
        if (data.includes("address")) {
          raid.value.Address = addr;
        }
        //const country = Comp.find((c) => c.types?.includes("country"));
        if (country) raid.value.Country = country.long_name;
        if (state) raid.value.State = state.long_name;
        if (city) {
          setTimeout(() => (raid.value.City = city.long_name), 100);
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
  let data = { DirApproval: raid.value.DirApproval };
  if (level === "hod") {
    data = { HodApproval: raid.value.HodApproval };
  } else if (level === "lod") {
    data = { LodApproval: raid.value.LodApproval };
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
  () => raid.value?.CaseNumber,
  (newValue) => {
    if (newValue && !raid.value.CaseId) {
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
provide("titleField", "title");
provide("secondTitle", "date");
provide("collection", "Raids");
provide("searchFields", ["Title", "Location"]);

defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  if (!raid.value.ProductsEvacuated) {
    raid.value.ProductsEvacuated = [];
  }
  if (!raid.value.ProductsOnHold) {
    raid.value.ProductsOnHold = [];
  }
  provide("product", product);
  //console.log(store.user.claims);
});
</script>
