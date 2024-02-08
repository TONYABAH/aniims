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
          :class="$q.screen.gt.xs ? store.theme.bg.normal : ''"
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
        <q-card-section class="q-px-" style="padding: 0">
          <q-tab-panels
            v-model="tab"
            animated
            keep-alive=""
            transition-prev="scale"
            transition-next="scale"
          >
            <q-tab-panel name="user">
              <q-form class="q-pt-lg" ref="loginRef" align="left">
                <label>Please enter your user ID</label>
                <q-separator spaced inset vertical dark />
                <q-input
                  ref="idRef"
                  name="id"
                  clear-icon="close"
                  v-model="id"
                  type="text"
                  :rules="[isValid]"
                  lazy-rules="ondemand"
                  outlined=""
                  placeholder="Email, Id or phone"
                  input-class="q-px-sm"
                >
                </q-input>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="pwd">
              <q-form class="q-pt-lg" ref="loginRef" align="left">
                <label class="text-h6">{{ email }}</label>
                <q-separator spaced inset vertical dark />
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

          <q-item class="full-width">
            <q-item-section align="left">
              <q-btn
                v-if="tab === 'user'"
                rounded
                unelevated=""
                :color="store.theme.color.normal"
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
              <q-btn
                flat
                dense
                icon="arrow_left"
                label="Previous"
                @click="() => (tab = 'user')"
                class="q-my-xs"
                align="left"
                v-if="tab !== 'user'"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                v-if="tab === 'pwd'"
                dense
                no-caps
                flat
                unelevated=""
                color="teal"
                to="password_reset"
                >Forgot your password?</q-btn
              >
              <q-btn v-else dense no-caps flat unelevated="" to="register"
                >Not registered? Create an account</q-btn
              >
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
//import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  //signIn,
  loginUserWithEmailAndPassword,
  getAuthUser,
  signIn,
} from "../composables/authentication.js";
import { useDefaultStore } from "src/stores/store.js";
import { Notify } from "quasar";

const store = useDefaultStore();
const router = useRouter();
const route = useRoute();
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
        error.value = "Wrong password";
      } else {
        window.user = user;
        if (!route.query.redirect) {
          router.push("/");
        } else {
          router.push(route.query.redirect);
        }
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
