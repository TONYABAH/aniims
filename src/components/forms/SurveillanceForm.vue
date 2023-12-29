<template>
  <FormCard
    :reset="reset"
    :validate="validate"
    :set-current-doc="setDocument"
    :updateFields="updateFields"
    :getDocument="getDocument"
  >
    <q-form ref="form" class="q-gutter-sm" autofocus>
      <q-input
        v-model="surveillance.CaseNumber"
        type="text"
        label="Case Number *"
        color=""
        name="caseNumber"
        dense
        :rules="[(val) => !!val || 'This field is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        style="max-width: 50%"
      >
        <template v-slot:append>
          <q-btn
            v-if="update_caseNumber"
            flat
            color="primary"
            label="Update"
            @click="updateCaseNumber"
          />
        </template>
      </q-input>

      <q-input
        v-model="surveillance.Date"
        label="Surveillance date"
        type="date"
        input-class="q-mt-md q-pb-md"
        clearable=""
        clear-icon="clear"
        :rules="[(val) => !!val || 'Date is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
      />
      <q-input
        v-model="surveillance.Address"
        type="text"
        label="Address *"
        dense
        :rules="[(val) => !!val || 'This field is required']"
        hide-bottom-space=""
      />
      <q-select
        v-model="surveillance.State"
        :options="states"
        options-dense=""
        label="State *"
        dense
        :rules="[(val) => !!val || 'This field is required']"
        hide-bottom-space=""
      />
      <q-select
        v-model="surveillance.City"
        :options="cities"
        options-dense=""
        label="City *"
        dense
        :rules="[(val) => !!val || 'This field is required']"
        hide-bottom-space=""
      />
      <q-input
        v-model="surveillance.Title"
        type="Title *"
        label="Description of offence"
        :rules="[(val) => !!val || 'Title is required']"
        lazy-rules="ondemand"
        hide-bottom-space=""
        dense=""
      />
      <label>Details</label>
      <TextEditor
        :Text="surveillance.Details"
        :set-text="(v) => (surveillance.Details = v)"
        style="border: 4px solid orange"
      />
    </q-form>
  </FormCard>
</template>
<script setup>
import { onMounted, ref, computed, provide, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import TextEditor from "src/components/TextEditor.vue";
import FormCard from "src/components/FormCard.vue";
import { useStates, useCities } from "src/composables/address-use";

const store = useDefaultStore();
const product = ref({});
const products = ref([]);
const locations = ref([]);
const form = ref(null);
const updateFields = [];
const surveillance = ref({});
const update_caseNumber = ref(false);
const states = useStates("Nigeria");
const cities = computed(() => useCities(surveillance.value.State));
const location = ref(surveillance.value?.Location || {});
const setDocument = (v) => (surveillance.value = v);

function getDocument() {
  return surveillance.value;
}
function reset() {
  form.value?.resetValidation();
}

const validate = async () => await form.value?.validate(true);
watch(
  () => surveillance.value.CaseNumber,
  (newValue) => {
    update_caseNumber.value = newValue ? true : false;
  }
);
watch(
  () => surveillance.value.State,
  (val) => {
    surveillance.value.City = null;
  }
);

provide("products", products);
provide("product", product);
provide("location", location);
provide("locations", locations);
provide("iconName", "hearing");
provide("titleField", "Title");
provide("secondTitle", "Date");
provide("collection", "Surveillances");
provide("searchFields", ["Title", "Address"]);
defineExpose({
  reset,
  validate,
});
</script>
