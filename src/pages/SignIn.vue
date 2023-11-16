<template>
  <div class="window-height window-width bg-primary">
    <div class="row full-height">
      <div
        class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 bg-grey-1"
        align="center"
      >
        <q-card
          flat
          square
          class="shadow-24 q-pb-lg full-height bg-white"
          style="width: 260px; height: auto"
        >
          <q-card-section class="center">
            <h4 class="text-h5 q-my-xs">{{ title }}</h4>
          </q-card-section>
          <q-card-section class="center">
            <q-form class="q-px-sm q-pt-xs">
              <q-select
                dense
                v-model="userRole"
                :options="roles"
                outlined=""
                label="Login as"
                rounded=""
              />
              <q-separator spaced inset vertical dark />
              <q-input
                dense
                ref="_staffid"
                clearable
                v-model="username"
                type="username"
                lazy-rules
                :rules="[required, isStaffNumber]"
                :label="staffIdLabel"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                ref="_password"
                dense
                square
                clearable
                v-model="password"
                :type="passwordFieldType"
                lazy-rules
                :rules="[required, short]"
                label="Password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
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

          <q-card-actions class="text-h5 q-my-xs" align="center">
            <q-btn
              unelevated
              rounded=""
              no-caps
              color="primary"
              @click="submit"
              label="Login"
              class="text-white"
              icon="check"
              size="md"
              style="padding: 4px 16px"
            />
          </q-card-actions>
          <q-card-section>
            <div align="center">
              <a href="javascript: void 0" class="text-grey-6"
                >Forgot your password?</a
              >
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useDefaultStore } from "../stores/store.js";

const _staffid = ref(null);
const _password = ref(null);
const store = useDefaultStore();
const $q = useQuasar();
const router = useRouter();

const title = ref("Login");
const visibility = ref(false);
const passwordFieldType = ref("password");
const username = ref("");
const password = ref("");
const visibilityIcon = ref("visibility");
const userRole = ref("Staff");
const roles = ["Staff", "IPO"];
const staffIdLabel = computed({
  get: () => (userRole.value === "Staff" ? "Staff ID" : "email"),
});
function required(val) {
  return (val && val.length > 0) || "Required field";
}

function short(val) {
  return (val && val.length > 3) || "Password is too short";
}
function isStaffNumber(val) {
  const pattern = /(ss|SS|js|JS)[0-9]+/;
  return (
    pattern.test(val) ||
    "Not a valid staff number: must be in format JS### or SS###"
  );
}
function isEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || "Not a valid email";
}

async function loginUser() {
  try {
    const result = await api.post("login", {
      id: username.value,
      password: password.value,
      role: userRole.value,
    });
    if (result.data.user) {
      store.user = result.data.user;
      router.push("/mail");
    }
  } catch (e) {
    $q.notify({
      icon: "error",
      color: "red",
      message: e.response ? e.response.statusText : e.message,
    });
  }
}

function submit() {
  _staffid.value.validate();
  _password.value.validate();
  if (!_staffid.value.hasError && !_password.value.hasError) {
    loginUser();
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
onMounted(() => {});

/**
data: {
  credential: { //OAuthCredential,
    accessToken: "ya29.A0AVA9y1vV6hpfHJKc37HTJMohwtL5cJiXU8O9ut9NMozrkd_S5VGXirklJOKETFktALsABDEjHoyheif6J4vWxgH0NE3VL6EPTuYMuUSyQjSgNH1a7HI6PllT_rDh0QRJFzXU5FHIXZmH8fkwItjT6gzClCNDaCgYKATASATASFQE65dr8i4N7bO1R9RT53rIe4gn1eg0163",
    idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkYTEwNjY0NTNkYzlkYzNkZDkzM2E0MWVhNTdkYTNlZjI0MmIwZjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjkxNDM0ODgzNTc2LWZiZDZmdGY4ZHFrYm12c3I2dGxqcjQxNWw3dGIxMWl0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjkxNDM0ODgzNTc2LWZiZDZmdGY4ZHFrYm12c3I2dGxqcjQxNWw3dGIxMWl0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyOTcyNjAyMTYyNDg5NzM2NDY4IiwiZW1haWwiOiJ0b255YXJteWFiYWhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ6VzV5RURESWtTeEJpcDNkNjBEV1lBIiwiaWF0IjoxNjYwMzAyNTQ3LCJleHAiOjE2NjAzMDYxNDd9.uGwgHjo5TxXY8pUZWUS4qLPpHuXKDkFRlR471xnmn1_GPjm4LJPP3Xxu36IwFj2yJR5JaEUEIdWJCqWP46UhKj-IHTMOnf5w3LoXzkEWar_HO78_cDgIDFSmZC2Eodqc9L3g7S2WUr4fgRFR-OAWYvHv6Ut8rF9aw_OpCV_WQMRFMO0gAnRHb7zhvTmgBfZwklEb66j8K8tg215BsCJT212jWJ1Pd5Chn2Uv9NGS_J7geZXX2Wym1QyNEeebcCglJ35j9AzXYZh82-TSeXZ0w_vX3wQg-rjoxv4KusOExMViwcF1Teuw0Wv5Bwjt-m4y_ZfAlT8DY-srw-ozfX8Raw",
    pendingToken: null,
    providerId: "google.com",
    signInMethod: "google.com",
 }
  token: "ya29.A0AVA9y1vV6hpfHJKc37HTJMohwtL5cJiXU8O9ut9NMozrkd_S5VGXirklJOKETFktALsABDEjHoyheif6J4vWxgH0NE3VL6EPTuYMuUSyQjSgNH1a7HI6PllT_rDh0QRJFzXU5FHIXZmH8fkwItjT6gzClCNDaCgYKATASATASFQE65dr8i4N7bO1R9RT53rIe4gn1eg0163",
  user: // UserImpl
    {
      providerId: 'firebase', proactiveRefresh: ProactiveRefresh, reloadUserInfo: {…}, reloadListener: null, uid: 'oOIA66BnBeTmOrxYSAJKRzsnukb2', …
    },
}**/
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
