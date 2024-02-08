<template>
  <div
    id="q-app"
    class="window-height window-width row justify-center items-center bg-blue-grey-1"
  >
    <q-card
      v-if="success"
      class="my-card text-white q-pa-md"
      :class="store.theme.bg.normal"
      style="width: 450px; height: auto; border-radius: 8px"
      square=""
    >
      <q-card-section class="bg-blue-grey-9" align="center">
        <q-avatar
          size="60px"
          font-size="42px"
          color="teal-5"
          text-color="white"
          icon="check"
        />
        <div class="text-subheading2 text-grey-4 q-my-lg">
          Password reset email has been sent to your mailbox. Follow the
          instructions to reset your password.
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          rounded=""
          :color="store.theme.color.normal"
          label="Login"
          glossy=""
          size="md"
          to="login"
          icon=""
          icon-right=""
        />
      </q-card-actions>
    </q-card>
    <q-card v-else square class="shadow-24" style="width: 380px; height: auto">
      <q-card-section :class="store.theme.bg.normal">
        <q-avatar
          size="44px"
          font-size="36px"
          color=""
          text-color="white"
          icon="key"
        />
        <span class="text-h6 text-white q-ml-md">Reset password</span>
      </q-card-section>
      <q-card-section>
        <q-form
          ref="form"
          class="q-px-sm q-pt-xs q-gutter-sm"
          :autofocus="false"
          :greedy="false"
        >
          <label>Enter your account email</label>
          <q-input
            outlined=""
            v-model="email"
            lazy-rules="ondemand"
            :rules="[required, isEmail]"
            type="email"
            label="Email"
            placeholder=""
            hide-bottom-space=""
            clear-icon="close"
          >
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions class="q-px-" align="center">
        <q-btn
          unelevated
          no-caps
          size="md"
          :color="store.theme.color.normal"
          icon=""
          icon-right=""
          label="Submit"
          :loading="loading"
          class="text-white q-my-xs"
          @click="submit"
        />
        &nbsp;
        <q-btn
          no-caps
          unelevated
          flat
          icon=""
          icon-right=""
          size="md"
          to="login"
          color="grey-8"
          >or Login</q-btn
        >
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { resetPassword } from "src/composables/functions";
import { useDefaultStore } from "src/stores/store";
//import { createUser } from "../composables/functions";
//import { decodeMessage } from "../composables/decodeErrorMessage";
const $q = useQuasar();
const store = useDefaultStore();
const loading = ref(false);
const form = ref(null);
const success = ref(false);
const email = ref("");

function required(val) {
  return (val && val.length > 0) || "Required field";
}
function isEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || "Not a valid email";
}
async function sendPasswordReset() {
  loading.value = true;
  resetPassword({ email: email.value })
    .then((info) => {
      success.value = true;
      /*$q.dialog({
          title: "Success",
          message:
            "Password reset email has been sent to your mailbox. Follow the instructions to reset your password.",
          color: "teal",
        });*/
    })
    .catch((e) => {
      $q.dialog({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
  /*$q.dialog({
    title: "Send password reset email?",
    message: "Password reset email will be sent to your mailbox",
    color: "primary",
    ok: true,
    cancel: true,
  }).onOk(() => {
    store.loading = true;
  });*/
}
const validate = async () => await form.value?.validate(true);
async function submit() {
  //const v = await _staffid.value.validate();
  if (validate()) {
    sendPasswordReset();
  }
}

onMounted(() => {
  form.value?.resetValidation();
});
</script>

<style scoped>
#fbButton {
  background-image: url("../assets/images/facebook_signin.png");
  background-repeat: no-repeat;
  background-size: contain;
}

#googleButton {
  background-image: url("../assets/images/google_signin.png");
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
