<template>
  <div
    class="window-height window-width justify-center items-center modern-bg"
    :class="$q.screen.gt.xs ? 'row' : ''"
    style="padding: 0px"
  >
    <div class="col col-sm-6 col-md-5 col-lg-4 col-xl-3 q-px-xs">
      <q-card
        square
        :flat="true"
        :style="$q.screen.lt.sm ? 'width: calc(100vw + 10px);' : ''"
        style="height: calc(100vh - 0px);margin-left:-10px;padding:0; border 2px solid red"
        class="my-card"
      >
        <q-banner class="bg-negative text-white" v-if="error">
          {{ error }}
          <template v-slot:action>
            <q-btn flat color="grey-1" label="Dissmiss" @click="error = null" />
          </template>
        </q-banner>
        <q-card-section
          v-else
          align="center"
          class=""
          :class="$q.screen.gt.xs ? 'bg-teal-8 text-grey-1' : ''"
        >
          <q-avatar
            flat
            size="74px"
            font-size="56px"
            icon="lock"
            :text-color="$q.screen.gt.xs ? 'white' : 'teal-8'"
            :color="$q.screen.gt.xs ? '' : ''"
          />
        </q-card-section>
        <q-card-section>
          <q-tab-panels
            v-model="tab"
            animated
            keep-alive=""
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="user">
              <q-form
                class="q-px-sm q-pt-lg q-gutter-sm"
                ref="loginRef"
                align="left"
              >
                <label>Please enter your user email or staff number.</label>
                <q-input
                  ref="idRef"
                  name="id"
                  clear-icon="close"
                  v-model="id"
                  type="text"
                  :rules="[isValid]"
                  lazy-rules="ondemand"
                  outlined=""
                  placeholder="Your email, Id or phone"
                  input-class="q-px-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="perm_identity" />
                  </template>
                </q-input>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="pwd">
              <q-form
                class="q-px-sm q-pt-lg q-gutter-sm"
                ref="loginRef"
                align="left"
              >
                <label>Please enter your password.</label>
                <q-input
                  ref="passwordRef"
                  id="pwd"
                  name="password"
                  clear-icon="close"
                  v-model="password"
                  :type="passwordFieldType"
                  :rules="[short]"
                  lazy-rules="ondemand"
                  outlined=""
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
            </q-tab-panel>
          </q-tab-panels>
          <q-toolbar>
            <q-item>
              <q-item-section avatar>
                <q-btn
                  flat
                  icon="arrow_left"
                  label="Register"
                  to="/register"
                  v-if="tab === 'user'"
                />
                <q-btn
                  v-else
                  flat
                  icon="arrow_left"
                  label="Previous"
                  @click="() => (tab = 'user')"
                />
              </q-item-section>
              <q-item-section>
                <q-btn
                  v-if="tab === 'user'"
                  unelevated=""
                  color="teal-8"
                  icon-right="arrow_right"
                  label="Continue"
                  padding="md"
                  :loading="loading"
                  @click="getUser"
                >
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Wait...
                  </template>
                </q-btn>
                <q-btn
                  v-else
                  unelevated=""
                  color="teal-8"
                  icon-right="arrow_right"
                  label="Login"
                  padding="md"
                  :loading="loading"
                  @click="submit"
                >
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Wait...
                  </template>
                </q-btn>
              </q-item-section>
              <q-item-section side top> </q-item-section>
            </q-item>
          </q-toolbar>
        </q-card-section>
        <q-card-actions class="" align="center" vertical="">
          <q-btn
            v-if="tab === 'pwd'"
            dense
            no-caps
            flat
            unelevated=""
            to="password_reset"
            >Forgot your password?</q-btn
          >
          <q-btn v-else dense no-caps flat unelevated="" to="register"
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
import {
  //signIn,
  loginUserWithEmailAndPassword,
  getAuthUser,
  signIn,
} from "../composables/authentication.js";
//import * as auth from "../composables/auth.js";
//import LoadingButton from "src/components/LoadingButton.vue";
import { Notify } from "quasar";

const dialogModel = ref(false);
const errorMessage = ref("Error");
//const router = useRouter();
const loading = ref(false);
const tab = ref("user");
const visibility = ref(false);
const passwordFieldType = ref("password");
const error = ref(null);
const id = ref("");
const password = ref("");
const visibilityIcon = ref("visibility");
const email = ref("");
const loginRef = ref(null);
const idRef = ref(null);
const passwordRef = ref(null);

const emailPattern =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

function short(val) {
  return (val && val.length > 3) || "Password is too short";
}

function isValid() {
  const val = id.value;
  const staffNumberPattern = /^(ss|SS|js|JS)[0-9]+$/i;
  const numberPattern = /^[0-9]+$/;
  return (
    (val &&
      (emailPattern.test(val) ||
        numberPattern.test(val) ||
        staffNumberPattern.test(val))) ||
    "Not a valid email address"
  );
}
async function loginUser() {
  loading.value = true;
  loginUserWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      if (!user) {
        return (error.value = "Wrong password");
      } else {
        //guest.value = user;
      }
    })
    .catch((e) => {
      error.value = e.message;
      if (e.message === "Firebase: Error (auth/wrong-password).") {
        error.value = "Wrong password.";
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

async function getUser() {
  const validated = await idRef.value?.validate(true);
  if (!validated) return;
  loading.value = true;
  email.value = null;

  getAuthUser(id.value)
    .then((userEmail) => {
      if (!userEmail) {
        Notify.create({
          position: "top",
          message: "User not found",
          timeout: 2000,
        });
      } else {
        email.value = userEmail;
        tab.value = "pwd";
      }
    })
    .catch((e) => {
      error.value = e.message;
      Notify.create({
        position: "bottom",
        message: e.message,
        timeout: 2000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
const validate = async () => await loginRef.value?.validate(true);

async function submit() {
  const validated = await validate();
  if (validated) {
    loginUser(id.value, password.value);
  }
}
function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility_off" : "visibility";
}
</script>
<style scoped>
.modern-bg {
  background: url(../assets/modernbg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: top;
}
.my-card {
  opacity: 0.8;
}
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
