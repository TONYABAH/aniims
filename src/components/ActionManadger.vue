
<template>
  <div v-if="uiMode === 'verifyEmail'">
    <q-banner class="bg-secondary text-white">
      Email address has been verified, Please create new password using the
      button below
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Reset password"
          @click="sendPasswordResetEmail(auth, email)"
        />
        <q-space />
        <q-btn
          v-if="continueUrl"
          color="primary"
          icon="check"
          label="Enter"
          :to="continueUrl"
        />
      </template>
    </q-banner>
  </div>
  <div v-else-if="uiMode === 'recoverEmail'">
    <q-banner class="bg-secondary text-white">
      You have successively verified your account email, Please create new
      password using the button below
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Reset password"
          @click="sendPasswordResetEmail(auth, email)"
        />
      </template>
    </q-banner>
  </div>
  <div v-else-if="uiMode === 'resetPassword'">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Reset password</div>
      </q-card-section>
      <q-card-section>
        You have successively verified your account email, Please create new
        password using the button below.
      </q-card-section>
      <q-card-section>
        <form action="">
          <q-input v-model="newPassword" type="text" label="New password" />
        </form>
      </q-card-section>
      <q-card-actions vertical align="center">
        <q-btn
          flat
          color="white"
          label="Reset password"
          @click="resetUserPassword"
        />
      </q-card-actions>
    </q-card>
  </div>
  <div v-else>
    <q-banner class="bg-negative text-white">
      Unknown action.
      <template v-slot:action>
        <q-btn flat color="white" label="Login" />
      </template>
    </q-banner>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "../composables/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import {
  checkActionCode,
  applyActionCode,
  sendPasswordResetEmail,
} from "firebase/auth";
import { resetPassword } from "../composables/functions";

const uiMode = ref("");
const errorMessage = ref("");
const mode = ref("");
const actionCode = ref("");
const continueUrl = ref("");
const lang = ref("en");
const newPassword = ref("");
const accountEmail = ref("");
const email = ref("");
const restoredEmail = ref();

function getParameterByName(param) {
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  return searchParams.get(param);
}
function resetUserPassword() {
  // TODO: Show the reset screen with the user's email and ask the user for
  // the new password.
  // Save the new password.
  confirmPasswordReset(auth, actionCode, newPassword.value)
    .then((resp) => {
      // Password reset has been confirmed and new password updated.
      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:

      auth.signInWithEmailAndPassword(accountEmail, newPassword.value);
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    })
    .catch((error) => {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
      errorMessage.value = error.message;
    });
}

function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  // Try to apply the email verification code.
  applyActionCode(auth, actionCode)
    .then(async (resp) => {
      // Email address has been verified.
      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.
      email.value = getParameterByName("email");
      // await resetPassword({ email: getParameterByName("email") });
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    })
    .catch((error) => {
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
      errorMessage.value = error.message;
    });
}
function handleRecoverEmail(auth, actionCode, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  //let restoredEmail = null;
  // Confirm the action code is valid.
  checkActionCode(auth, actionCode)
    .then((info) => {
      // Get the restored email address.
      restoredEmail.value = info["data"]["email"];

      // Revert to the old email.
      return applyActionCode(auth, actionCode);
    })
    .then(async () => {
      // Account email reverted to restoredEmail

      // TODO: Display a confirmation message to the user.

      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      email.value = getParameterByName("email");
      //await resetPassword({ email: getParameterByName("email") });
    })
    .catch((error) => {
      // Invalid code.
      errorMessage.value = error.message;
    });
}
function handleResetPassword(auth, actionCode, continueUrl, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  // Verify the password reset code is valid.
  verifyPasswordResetCode(auth, actionCode)
    .then((email) => {
      accountEmail.value = email;
    })
    .catch((error) => {
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
      errorMessage.value = error.message;
    });
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // TODO: Implement getParameterByName()

    // Get the action to complete.
    const _mode = getParameterByName("mode");
    // Get the one-time code from the query parameter.
    actionCode.value = getParameterByName("oobCode");
    // (Optional) Get the continue URL from the query parameter if available.
    continueUrl.value = getParameterByName("continueUrl");
    // (Optional) Get the language code if available.
    lang.value = getParameterByName("lang") || "en";

    uiMode.value = mode.value = _mode;
    // Handle the user management action.
    switch (_mode) {
      case "resetPassword":
        // Display reset password handler and UI.
        handleResetPassword(auth, actionCode, continueUrl, lang);
        break;
      case "recoverEmail":
        // Display email recovery handler and UI.
        handleRecoverEmail(auth, actionCode, lang);
        break;
      case "verifyEmail":
        // Display email verification handler and UI.
        handleVerifyEmail(auth, actionCode, continueUrl, lang);
        break;
      default:
      // Error: invalid mode.
    }
  },
  false
);
</script>
