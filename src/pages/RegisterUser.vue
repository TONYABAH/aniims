<template>
  <div
    id="q-app"
    class="window-height window-width justify-center items-center bg-blue-grey-10"
    style="
      background: linear-gradient(#827, #827);
      height: 100vh;
      overflow: auto;
    "
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
    <div class="row justify-center align-items-center items-center" v-else>
      <q-card flat style="width: 400px; height: auto" class="q-mt-sm bg-">
        <q-card-section :align="$q.screen.lt.sm ? 'center' : ''">
          <q-toolbar class="q-mb-md">
            <q-avatar
              size="56px"
              font-size="48px"
              color="deep-purple-10"
              text-color="grey-2"
              icon="perm_identity"
            />
            <q-toolbar-title> Register </q-toolbar-title>
          </q-toolbar>
        </q-card-section>
        <q-card-section :align="$q.screen.lt.sm ? 'center' : ''">
          <q-form ref="form" class="q-gutter-sm q-mb-md">
            <label>Full name *</label>
            <q-input
              v-model="user.Name"
              type="text"
              color=""
              name="contact_name"
              outlined=""
              square
            />
            <q-separator spaced inset vertical dark />
            <label>Email address *</label>
            <q-input
              outlined=""
              v-model="user.Email"
              type="text"
              name="contact_email"
              square
            />
            <q-separator spaced inset vertical dark />
            <label>Phone number *</label>
            <q-input
              outlined
              v-model="user.Phone"
              type="text"
              name="contact_phone"
              square
            />
            <!-- <label>Full name *</label>
            <q-input
              filled
              v-model="user.CoyRegNumber"
              type="text"
              label="Company registration number *"
            />
           <q-input
              filled
              v-model="user.CoyName"
              type="text"
              label="Company name *"
            />
            <q-input
              filled
              v-model="user.CoyAddress"
              type="text"
              label="Company address *"
            />
            <q-input
              filled
              v-model="user.CoyEmail"
              type="text"
              label="Company email *"
            />
            <q-input
              filled
              v-model="user.CoyPhone"
              type="text"
              label="Company phone *"
            />-->
          </q-form>
          <q-spinner
            color="primary"
            size="1.5rem"
            :thickness="5"
            v-if="loading"
          />
          <q-btn
            unelevated
            no-caps
            color="pink-8"
            label="Register"
            icon-right="arrow_right"
            class="text-white"
            icon="check"
            @click="submit"
            v-else
          >
          </q-btn>
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
import { useRouter } from "vue-router";
import { addUser } from "../composables/functions";

//import { decodeMessage } from "../composables/decodeErrorMessage";
const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
//const modal = ref(false);
const errorMessage = ref("There were errors!");
const statusMessage = ref("Error");
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

async function registerUser() {
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

/*function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility_off" : "visibility";
}*/
onMounted(() => {});
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
