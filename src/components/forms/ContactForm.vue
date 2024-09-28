<template>
  <q-banner
    v-if="submitted"
    class="bg-secondary text-white text-h6"
    style="border-radius: 6px"
  >
    <q-avatar
      size="32px"
      font-size="28px"
      color="white"
      text-color="teal"
      icon="check"
      class="q-mr-sm"
    />
    <span style="font-size: 16px">Thank you for your submission</span>
    <template v-slot:action>
      <q-btn flat color="white" label="Dismiss" @click="resetForm" />
    </template>
  </q-banner>

  <q-form
    ref="formRef"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    class="q-gutter-sm"
<<<<<<< Updated upstream
=======
    v-else
>>>>>>> Stashed changes
  >
    <q-banner
      v-if="errorMessage"
      class="bg-negative text-white text-h6"
      style="border-radius: 6px"
    >
      <q-avatar
        size="32px"
        font-size="28px"
        color="white"
        text-color="red"
        icon="error"
        class="q-mr-sm"
      />
      <span style="font-size: 16px">
        {{ errorMessage }}
      </span>
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="resetForm" />
      </template>
    </q-banner>
    <q-input
      dense
      filled
<<<<<<< Updated upstream
      v-model="Message.Name"
=======
      v-model="Form.name"
>>>>>>> Stashed changes
      type="text"
      label="Full name"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
      dense
      filled
<<<<<<< Updated upstream
      v-model="Message.Email"
=======
      v-model="Form.email"
>>>>>>> Stashed changes
      type="text"
      label="Email address"
      :rules="[required, isEmail]"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
<<<<<<< Updated upstream
      v-model="Message.Phone"
=======
      v-model="Form.phone"
>>>>>>> Stashed changes
      dense
      filled
      type="text"
      label="Phone number"
      :rules="[required, isPhoneNumber]"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-input
      dense
      filled
<<<<<<< Updated upstream
      v-model="Message.Subject"
=======
      v-model="Form.subject"
>>>>>>> Stashed changes
      type="text"
      label="Subject"
      :rules="[required]"
      lazy-rules="ondemand"
      hide-bottom-space=""
    />
    <q-separator spaced inset vertical dark />
    <div class="text-subtitle2 text-left">
      <label for="message_input">Message</label>
      <textarea
        id="message_input"
        rows="4"
        :rules="[required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
        class="full-width qml-md"
        :class="$q.dark.isActive ? 'bg-grey-8 text-grey-2' : 'bg-grey-1'"
<<<<<<< Updated upstream
        v-model="Message.Message"
=======
        v-model="Form.message"
>>>>>>> Stashed changes
      />
    </div>

    <div>
      <q-btn
        flat
        label="Submit"
        :color="buttonColor"
        :loading="loading"
        @click="submit"
      />
      <q-btn label="Reset" color="" flat class="q-ml-sm" @click="resetForm" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { submitForm } from "src/composables/remote";

<<<<<<< Updated upstream
const Message = ref({
  Title: "Form submission",
  To: "support@aniims.net",
  Email: "",
  Phone: "",
  Name: "",
  Subject: "",
  Message: "",
=======
const Form = ref({
  subject: "Form submission",
  to: "admin@aniims.net",
>>>>>>> Stashed changes
});

defineProps({
  buttonColor: {
    type: String,
    default: "",
  },
});
const formRef = ref(null);
const loading = ref(false);
const submitted = ref(false);
const errorMessage = ref("");

const emailPattern =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

const validate = async () => await formRef.value?.validate(true);

function required(val) {
  return (val && val.length > 0) || "This field is required";
}

function isEmail(val) {
  //const val =  Message.value.Email
  return (val && emailPattern.test(val)) || "Not a valid email address";
}
function isPhoneNumber(val) {
  //const val = Message.value.Phone
  const numberPattern = /^[0-9]+$/;
  return (val && numberPattern.test(val)) || "Not a valid email address";
}
function isValid(val) {
  //const val = Message.value;
  return (
    (val &&
      (emailPattern.test(val) ||
        numberPattern.test(val) ||
        staffNumberPattern.test(val))) ||
    "Not a valid email address"
  );
}
async function resetForm() {
  loading.value = false;
  /* Message.value = {
    Title: "Form submission",
    To: "admin@aniims.net",
  };*/
  submitted.value = false;
  errorMessage.value = "";
  //await formRef.value?.reset();
<<<<<<< Updated upstream
  formRef.value?.resetValidation();
=======
  formRef.value.resetValidation();
>>>>>>> Stashed changes
}
async function submit() {
  const validated = await validate();
  //console.log({ validated });
  if (validated) {
    loading.value = true;
<<<<<<< Updated upstream
    submitForm(Message.value)
=======
    submitForm(Form.value)
>>>>>>> Stashed changes
      .then(async () => {
        submitted.value = true;
      })
      .catch((e) => {
        errorMessage.value = e.message || e;
      })
      .finally(() => (loading.value = false));
  }
}
</script>
