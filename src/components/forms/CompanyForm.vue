<template>
  <q-form ref="formRef" class="q-gutter-sm q-mb-md">
    <q-input
      filled
      v-model="company.reg_number"
      type="text"
      label="CAC registration number *"
      :rules="[(val) => !!val || 'Title is required']"
      lazyRules="ondemand"
    />
    <q-input
      filled
      v-model="company.name"
      type="text"
      label="Company name *"
      :rules="[(val) => !!val || 'Title is required']"
      lazyRules="ondemand"
    />

    <q-input
      filled
      v-model="company.email"
      type="text"
      label="Company email *"
      :rules="[isEmail]"
      lazyRules="ondemand"
    />
    <q-input
      filled
      v-model="company.phone"
      type="text"
      label="Company phone *"
      :rules="[isPhoneNumber]"
      lazyRules="ondemand"
    />
    <q-input
      filled
      v-model="company.address"
      type="text"
      label="Company address *"
      :rules="[(val) => !!val || 'Title is required']"
      lazyRules="ondemand"
    />

    <q-select
      optionsDense=""
      v-model="company.state"
      :options="states"
      label="State *"
      filled
      :rules="[(val) => !!val || 'Title is required']"
      lazyRules="ondemand"
    />
    <q-select
      optionsDense=""
      v-model="company.city"
      :options="cities"
      label="City *"
      filled
      :rules="[(val) => !!val || 'Title is required']"
      lazyRules="ondemand"
    />
  </q-form>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStates, useCities } from "src/composables/use-fn";

const formRef = ref(null);
const states = useStates("Nigeria");
const cities = computed(() => useCities(company.value.state));
const company = ref(Object.assign({}, props.data || {}));
const props = defineProps({
  data: Object,
});
const emailPattern =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

function short(val) {
  return (val && val.length > 3) || "Password is too short";
}

function isEmail(val) {
  return (val && emailPattern.test(val)) || "Not a valid email address";
}
function isPhoneNumber(val) {
  const numberPattern = /^[0-9]+$/;
  return (val && numberPattern.test(val)) || "Not a valid phone number";
}
const validate = async () => await formRef.value?.validate(true);
function reset() {
  formRef.value?.resetValidation();
}
defineExpose({
  data: company,
  reset,
  validate,
});
</script>
