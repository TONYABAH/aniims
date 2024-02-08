<template>
  <div
    id="q-app"
    class="window-height window-width justify-center items-center modern-bg"
    style="height: 100vh; overflow: auto"
  >
    <div class="row justify-center align-items-center" v-if="success">
      <q-card
        class="my-card q-mt-xl bg-blue-grey-9 text-grey-1"
        style="width: 480px; height: auto"
        align="center"
      >
        <q-card-section>
          <div class="text-h6 text-lime">
            Thank you for signing up with NAFDAC Investigation Information
            Management System (ANIIMS).
          </div>
          <div class="text-h6">
            A confirmation email has been sent to your provided email address.
            Open your email and change your password, then you may login.
          </div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn
            color="teal-8"
            label="Login"
            to="/login"
            size="lg"
            style="padding-left: 18px; padding-right: 18px"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div class="row justify-center full-height" style="opacity: 0.9" v-else>
      <q-card
        style="width: 528px; height: 100vh"
        class="full-height shadow-2"
        align="center"
      >
        <q-card-section
          :align="$q.screen.lt.sm ? 'center' : ''"
          class="text-white"
          :class="$q.screen.gt.xs ? store.theme.bg.normal : ''"
        >
          <q-toolbar class="q-mb-md">
            <q-avatar
              size="56px"
              font-size="48px"
              color=""
              text-color="grey-2"
              icon="perm_identity"
            />
            <q-toolbar-title class="text-left"> Register </q-toolbar-title>
          </q-toolbar>
        </q-card-section>
        <q-card-section
          :align="$q.screen.lt.sm ? 'center' : ''"
          class="q-px-xl"
        >
          <q-form ref="form" class="q-gutter-sm q-mb-md q-pb-sm" align="left">
            <q-input
              v-model="user.Name"
              label="Full name *"
              type="text"
              color=""
              name="contact_name"
              outlined=""
              :rules="[required]"
              lazy-rules="ondemand"
              hide-bottom-space=""
            />
            <q-input
              label="Email address *"
              outlined=""
              v-model="user.Email"
              type="text"
              name="contact_email"
              :rules="[isEmail]"
              lazy-rules="ondemand"
              hide-bottom-space=""
            />
            <q-input
              outlined
              v-model="user.Phone"
              label="Phone number *"
              type="text"
              name="contact_phone"
              :rules="[isPhoneNumber]"
              lazy-rules="ondemand"
              hide-bottom-space=""
            />
            <!-- <label>Full name *</label>
            <q-input

              v-model="user.CoyRegNumber"
              type="text"
              label="Company registration number *"
            />
           <q-input

              v-model="user.CoyName"
              type="text"
              label="Company name *"
            />
            <q-input

              v-model="user.CoyAddress"
              type="text"
              label="Company address *"
            />
            <q-input

              v-model="user.CoyEmail"
              type="text"
              label="Company email *"
            />
            <q-input

              v-model="user.CoyPhone"
              type="text"
              label="Company phone *"
            />-->
            <q-btn
              unelevated=""
              rounded
              :color="store.theme.color.normal"
              icon-right="arrow_right"
              label="Continue"
              padding="md"
              :loading="loading"
              @click="submit"
              class="full-width q-mt-md"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Wait...
              </template>
            </q-btn>
          </q-form>

          <q-separator spaced inset vertical dark />
          <q-btn no-caps flat unelevated to="login"
            >Already registered? Login</q-btn
          >
        </q-card-section>
        <q-card-actions class="q-px-lg" align="right"> </q-card-actions>
        <q-card-section class="text-center q-pa-sm"> </q-card-section>
        <q-card-actions class="q-px-lg"> </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
//import { useRouter } from "vue-router";
import { addUser } from "../composables/functions";
import { useDefaultStore } from "src/stores/store.js";

const store = useDefaultStore();
const $q = useQuasar();
//const router = useRouter();
const loading = ref(false);
const role = ref("");
const form = ref(null);
const user = ref({});
const success = ref(false);

function required(val) {
  return (val && val.length > 0) || "Required field";
}

function short(val) {
  return (val && val.length > 3) || "Entry is too short";
}
function isPhoneNumber(val) {
  const pattern = /((234)|0)[1-9]+/;
  return pattern.test(val) || "Not a valid phone number.";
}
function isEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || "Not a valid email";
}
const validate = async () => await form.value?.validate(true);

async function registerUser() {
  const valid = await validate();
  if (!valid) return;
  loading.value = true;
  addUser({
    ...user.value,
  })
    .then((result) => {
      //const data = result.data;
      //const id = data.id;
      //store.user = data;
      success.value = true;
      //router.push("/");
    })
    .catch((error) => {
      console.log(error);
      //const [status, message] = String(error).split(":");
      //errorMessage.value = message; //+ " " + details ? details : ""; // || e.response.statusText;
      //statusMessage.value = status;
      //modal.value = true;
      $q.dialog({
        title: "Error",
        message: error.message,
        color: "red",
      });
    })
    .finally(() => (loading.value = false));
}

async function submit() {
  //const v = await _staffid.value.validate();
  const validated = await form.value.validate();
  if (validated) await registerUser();
}
onMounted(() => {});
</script>

<style>
.blue-bg {
  background: #000;
}
.pink-bg {
  background: linear-gradient(#827, #827);
}
.modern-bg {
  background: url(../assets/modernbg.jpg);
}
.design-bg {
  background: url(../assets/designbg.jpg);
}
.exortic-bg {
  background: url(../assets/exorticbg.jpg);
}
.patterns-bg {
  background: url(../assets/patterns.jpg);
}
.modern-bg,
.exortic-bg,
.design-bg,
.patterns-bg {
  background-repeat: no-repeat;
  background-position-y: top;
  background-size: cover;
  background-attachment: scroll;
}
</style>
