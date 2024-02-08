<template>
  <q-form ref="form" class="q-gutter-md q-my-md">
    <q-input
      v-model="destruction.id"
      outlined
      stack-label
      label="Destruction ID"
      type="number"
      color=""
      name="applicationNumber"
      :readonly="true"
    >
      <template v-slot:append>
        <!-- <q-btn
          flat
          color=""
          icon="search"
          @click.stop="search"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
          </template>
        </q-btn>-->
        <q-btn
          flat
          dense
          no-caps
          unelevated
          color=""
          id="copy_btn"
          icon="content_copy"
          @click.stop="copyToClipboard(destruction.ApplicationNumber)"
        >
        </q-btn>
      </template>
    </q-input>

    <q-select
      label="Type of destruction *"
      outlined
      stack-label
      options-dense=""
      v-model="destruction.Type"
      :options="destructionOptions"
      :rules="[(val) => !!val || 'Type of destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-input
      label="Destruction site address*"
      v-model="destruction.Site"
      type="text"
      :rules="[(val) => !!val || 'Type of destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      outlined
      stack-label
    />

    <StateInput
      label="State *"
      v-model="destruction.State"
      options-dense=""
      outlined
      stack-label
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <CityInput
      label="City *"
      v-model="destruction.City"
      :state="destruction.State || ''"
      options-dense=""
      outlined
      stack-label
      :rules="[(val) => !!val || 'This field is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />

    <q-select
      label="Reason(s) for description *"
      v-model="destruction.Reasons"
      options-dense=""
      :options="[
        'Expired items',
        'Damaged items',
        'Defective items',
        'Counterfeit items',
        'Other reasons',
      ]"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      multiple=""
      outlined
      stack-label
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
    <q-input
      v-model="destruction.OtherReasons"
      type="text"
      :rules="[(val) => !!val || 'Reason for destruction is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      label="Other reasons for destroying items *"
      v-if="destruction?.Reasons?.includes('Other reasons')"
    />

    <q-select
      label="Product types *"
      v-model="destruction.ProductCategories"
      :options="store.productCategories"
      :rules="[(val) => !!val || 'Product type is required']"
      lazy-rules="ondemand"
      hide-bottom-space=""
      multiple
      emit-value
      map-options
      options-dense=""
      :use-chips="false"
      outlined
      stack-label
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

    <q-select
      label="Destruction methods *"
      v-model="destruction.Methods"
      :options="store.destructionMetods"
      multiple
      emit-value
      map-options
      options-=""
      options-dense=""
      :use-chips="false"
      outlined
      stack-label
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

    <q-input
      label="Destruction date *"
      v-model="destruction.ProposedDate"
      type="date"
      input-class="q-mt-sm"
      clearable=""
      clear-icon="clear"
      outlined
      stack-label
    />
  </q-form>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import Clipboard from "src/utils/clipboard.js";
import StateInput from "src/components/forms/StateInput.vue";
import CityInput from "src/components/forms/CityInput.vue";
//import { useStates, useCities, useGeolocation } from "src/composables/use-fn";
//import { simpleSearch } from "src/composables/searchProvider";
const props = defineProps({
  data: Object,
  setData: Function,
  //search: Function,
});

const searchFields = ["Title", "Site"];
const store = useDefaultStore();
const destructionOptions = ["Private", "Special", "General"];
const collection = "Destructions";
const form = ref(null);
const clipboard = new Clipboard("#copy_btn");

const destruction = computed({
  get: () => props.data || {},
  set: (val) => props.setData(val),
});

function copyToClipboard(val) {
  clipboard.copyToClipboard(val);
  setTimeout(() => {
    clipboard_show.value = false;
  }, 1000);
}

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

watch(
  () => destruction.value.State,
  (val) => {
    destruction.value.City = null;
  }
);

defineExpose({
  reset,
  validate,
  data: destruction,
  searchFields,
  collection,
});
// accept=".xls, .xlsx, .jpg, .png, .pdf, image/jpeg"
</script>
