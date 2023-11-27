<template>
  <div
    class="window-height window-width justify-center items-center bg-blue-grey-10"
    :class="$q.screen.gt.xs ? 'row' : ''"
    style="padding: 0px"
  >
    <div class="col col-sm-6 col-md-5 col-lg-4 col-xl-3 q-px-xs">
      <q-card
        :flat="$q.screen.lt.sm"
        square=""
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-'"
        :style="$q.screen.lt.sm ? 'width: calc(100vw + 10px);' : ''"
        style="height: calc(100vh - 0px);margin-left:-10px;padding:0; border 2px solid red"
      >
        <q-card-section align="center" class="bg-blue-8 text-grey-1">
          <q-avatar size="76px" font-size="76px" icon="lock" />
        </q-card-section>
        <q-card-section align="center">
          <!--<q-btn
            rounded
            unelevated=""
            color="primary"
            to="register"
            icon="add"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
          >
            <q-tooltip> Register new user </q-tooltip>
            Register
          </q-btn>-->
          <q-form
            class="q-px-sm q-pt-lg q-gutter-sm"
            ref="loginRef"
            align="left"
          >
            <label>User ID</label>
            <q-input
              name="id"
              clear-icon="close"
              v-model="id"
              type="text"
              :rules="[isValid]"
              lazy-rules="ondemand"
              hide-bottom-space=""
              outlined=""
              square=""
              placeholder="Your email, Id or phone"
              input-class="q-px-sm"
            >
              <template v-slot:prepend>
                <q-icon name="perm_identity" />
              </template>
            </q-input>
            <q-separator spaced inset vertical dark />
            <label for="pwd">Password</label>
            <q-input
              id="pwd"
              name="password"
              clear-icon="close"
              v-model="password"
              :type="passwordFieldType"
              :rules="[short]"
              lazy-rules="ondemand"
              hide-bottom-space=""
              outlined=""
              square=""
              placeholder="Your password..."
            >
              <template v-slot:prepend>
                <q-icon name="key" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="visibilityIcon"
                  @click="switchVisibility"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-section align="center">
          <q-spinner
            color="lime"
            size="2em"
            class="bg-"
            style="border-radius: 50%"
            v-if="loading"
          />
          <q-btn
            no-caps
            glossy
            unelevated
            color="primary"
            @click="submit"
            label="Login"
            class="text-white q-ml-xs"
            icon-right="arrow_right"
            icon=""
            rounded
          >
          </q-btn>
        </q-card-section>

        <q-card-actions class="" align="center" vertical="">
          <q-btn dense no-caps flat unelevated="" to="password_reset"
            >Forgot your password?</q-btn
          >
          <q-btn dense no-caps flat unelevated="" to="register"
            >Not registered? Create an account</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="dialogModel">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name=",error" color="primary" text-color="white" />
          <span class="q-ml-sm">Error</span>
        </q-card-section>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ errorMessage }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
//import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
//import { useDefaultStore } from "../stores/store.js";
import { signIn } from "../composables/auth.js";

const dialogModel = ref(false);
const errorMessage = ref("Error");
const router = useRouter();
const loading = ref(false);
const title = ref("Login");
const visibility = ref(false);
const passwordFieldType = ref("password");
// const email = ref("abah.a@nafdac.gov.ng");
const id = ref("");
const password = ref("");
const visibilityIcon = ref("visibility");
//const userRole = ref("");
const loginRef = ref(null);

const emailPattern =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

const staffIdLabel = "Your Email";

function short(val) {
  return (val && val.length > 3) || "Password is too short";
}

function isValid(val) {
  const staffNumberPattern = /^(ss|SS|js|JS)[0-9]+$/i;
  const numberPattern = /^[0-9]+$/;
  return (
    (val && emailPattern.test(val)) ||
    numberPattern.test(val) ||
    staffNumberPattern.test(val) ||
    "Not a valid email address"
  );
}
async function loginUser(id, password) {
  //let email = "";
  loading.value = true;
  try {
    //if (emailPattern.test(email)) {
    const res = await signIn(id, password);
    if (!res?.user) throw new Error({ message: "User nat found among staff" });
    //store.user = res?.user;
    //store.currentStaff = store.staffList.find((s) => s.Email === store.user.email);
    //if (res?.user) router.push("/");
    //}
  } catch (e) {
    const error = e;
    errorMessage.value = error.message;
    if (error.message === "Firebase: Error (auth/user-not-found).") {
      errorMessage.value = "Unknown user or wrong password.";
    }
    dialogModel.value = true;
  } finally {
    loading.value = false;
  }
}
const validate = async () => await loginRef.value?.validate(true);

async function submit() {
  const validated = await validate();
  // (await idRef.value.validate()) && (await passwordRef.value.validate());
  if (validated) {
    loginUser(id.value, password.value);
  }
}
function switchTypeForm() {
  router.push("/register");
}
function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility_off" : "visibility";
}
</script>
<style scoped>
/*#fbButton {
  background-image: url("../assets/images/facebook_signin.png");
  background-repeat: no-repeat;
  background-size: contain;
}

#googleButton {
  background-image: url("../assets/images/google_signin.png");
  background-repeat: no-repeat;
  background-size: contain;
}*/
</style>
