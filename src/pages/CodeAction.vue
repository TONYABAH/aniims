<template>
  <q-card square flat class="my-card">
    <q-toolbar>
      <q-toolbar-title> {{ pkg.name }} v{{ pkg.version }} </q-toolbar-title>
    </q-toolbar>

    <q-card-section v-if="mode === 'verifyEmail'">
      <q-banner class="bg-secondary text-white">
        Your mail address {{ accountEmail }} has been verified, Please create
        new password using the button below
        <template v-slot:action>
          <q-btn
            color="pink-10"
            label="Reset password"
            @click="sendPasswordResetLink"
          />
          <q-space />
          <q-btn color="primary" icon="check" label="Continue" to="/" />
        </template>
      </q-banner>
    </q-card-section>

    <q-card-section v-else-if="mode === 'recoverEmail'">
      <q-banner class="bg-secondary text-white">
        You have successively recovered your account. Please reset your
        password.
        <template v-slot:action>
          <q-btn color="primary" icon="check" label="Continue" to="/" />
        </template>
      </q-banner>
    </q-card-section>

    <q-card-section v-else-if="mode === 'resetPassword'">
      <q-card>
        <q-card-section class="my-card bg-teal text-white">
          <label class="text-h6">Reset password for {{ accountEmail }}</label>
        </q-card-section>
        <q-card-section>
          Please create new password using the button below.
        </q-card-section>
        <q-card-section>
          <form action="">
            <div class="row q-col-gutter-xs">
              <div class="col col-xs-12 col-sm-4 col-md-4 col-lg-3">
                <q-input
                  ref="passwordRef"
                  name="password"
                  square
                  clear-icon="close"
                  v-model="newPassword"
                  :type="passwordFieldType"
                  :rules="[required, short]"
                  label="Enter new password"
                  outlined
                  clearable=""
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
              </div>
              <div class="col col-xs-12 col-sm-8 col-md-8 col-lg-9">
                <q-btn
                  color="primary"
                  label="Reset password"
                  icon="check"
                  size="lg"
                  no-caps=""
                  glossy=""
                  @click="resetUserPassword"
                />
              </div>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-banner rounded="" v-if="message" class="bg-grey-9 text-white">
        {{ message }}
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "../composables/firebase";
import {
  //sendSignInLinkToEmail,
  //isSignInWithEmailLink,
  //signInWithEmailLink,
  //signInWithPhoneNumber,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  checkActionCode,
  applyActionCode,
} from "firebase/auth";
//import { updateUser } from "../composables/functions";
import pkg from "../../package.json";
import { useRouter } from "vue-router";

const router = useRouter();
//const errorMessage = ref("");
const mode = ref("");
const actionCode = ref("");
const newPassword = ref("");
const accountEmail = ref("");
const continueUrl = ref("/");
const visibility = ref(false);
const passwordFieldType = ref("password");
const visibilityIcon = ref("visibility");
const message = ref("");

function getParameterByName(param) {
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  return searchParams.get(param);
}
function switchVisibility() {
  visibility.value = !visibility.value;
  passwordFieldType.value = visibility.value ? "text" : "password";
  visibilityIcon.value = visibility.value ? "visibility_off" : "visibility";
}
function required(val) {
  return (val && val.length > 0) || "Required field";
}

function short(val) {
  return (val && val.length > 3) || "Password is too short";
}

function resetUserPassword() {
  confirmPasswordReset(auth, actionCode.value, newPassword.value)
    .then(async (resp) => {
      message.value =
        "You have successfully changed your password for " + accountEmail.value;
      // Password reset has been confirmed and new password updated.
      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      try {
        await signInWithEmailAndPassword(
          auth,
          accountEmail.value,
          newPassword.value
        );
        message.value = "You have been signed in.";
        router.push("/");
      } catch (e) {
        message.value = e.message;
      }
      // router.push("/");
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    })
    .catch((error) => {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
      message.value = error.message;
      //console.log(error.message);
    });
}

function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
  applyActionCode(auth, actionCode)
    .then(async (resp) => {
      // Email address has been verified.
      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.
      //accountEmail.value = getParameterByName("email");
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    })
    .catch((error) => {
      // Code is invalid or expired. Ask the user to verify their email address again.
      message.value = error.message;
    });
}
function handleRecoverEmail(auth, actionCode, lang) {
  // Confirm the action code is valid.
  checkActionCode(auth, actionCode)
    .then((info) => {
      // Get the restored email address.
      accountEmail.value = info["data"]["email"];
      // Revert to the old email.
      return applyActionCode(auth, actionCode);
    })
    .then(async () => {
      // Account email reverted to restoredEmail
      // TODO: Display a confirmation message to the user.
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      sendPasswordResetEmail(auth, restoredEmail)
        .then(() => {
          message.value =
            "Password reset confirmation sent. Please check your email.";
        })
        .catch((error) => {
          message.value = error.message;
        });
    })
    .catch((error) => {
      // Invalid code.
      message.value = error.message;
    });
}
function handleResetPassword(auth, actionCode, continueUrl, lang) {
  // Verify the password reset code is valid.
  verifyPasswordResetCode(auth, actionCode)
    .then((email) => {
      //console.log(email);
      accountEmail.value = email;
    })
    .catch((error) => {
      // Invalid or expired action code. Ask user to try to reset the password again.
      message.value = error.message;
    });
}
async function sendPasswordResetLink() {
  await sendPasswordResetEmail(auth, accountEmail.value);
}
onMounted(() => {
  // TODO: Implement getParameterByName()
  //accountEmail.value = getParameterByName("email");
  // Get the action to complete.
  mode.value = getParameterByName("mode");
  // Get the one-time code from the query parameter.
  actionCode.value = getParameterByName("oobCode");
  // (Optional) Get the continue URL from the query parameter if available.
  continueUrl.value = getParameterByName("continueUrl");
  // (Optional) Get the language code if available.
  const lang = getParameterByName("lang") || "en";
  // Handle the user management action.
  switch (mode.value) {
    case "resetPassword":
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode.value, continueUrl.value, lang);
      break;
    case "recoverEmail":
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode.value, lang);
      break;
    case "verifyEmail":
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode.value, continueUrl.value, lang);
      break;
    default:
    // Error: invalid mode.
  }
});
</script>
