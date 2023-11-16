<template>
  <q-toolbar class="bg-orange" style="padding: 0" v-if="comment">
    <q-space />
    <!--<q-btn
      v-if="isDocumentSubmitted"
      color="orange"
      icon="undo"
      class="q-mx-xs"
      size="md"
      label="Return"
      unelevated=""
      @click="returnDocument()"
    />-->
    <q-btn
      color=""
      icon="check"
      class="q-mx-xs"
      size="md"
      label="Submit"
      unelevated=""
    >
      <q-menu persistent="">
        <SubmitDialog />
      </q-menu>
    </q-btn>
    <!--<q-btn
      color=""
      icon="check"
      class="q-mx-xs"
      size="md"
      label="Submit"
      unelevated=""
      @click="submitDocument"
    />-->
    <q-btn
      v-if="showAssignDialog"
      color=""
      icon="person"
      class="q-mx-xs"
      size="md"
      label="Assign"
      unelevated=""
    >
      <q-menu persistent="">
        <AssignDialog />
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<script setup>
import { ref, computed, inject } from "vue";

import AssignDialog from "./AssignDialog.vue";
import { useDefaultStore } from "src/stores/store";
import SubmitDialog from "./SubmitDialog.vue";
//import { Notify, Dialog } from "quasar";
const store = useDefaultStore();
const comment = inject("comment");

/*const isDocumentSubmitted = computed(() => {
  return (
    store.currentDocument?.Status === "Assigned" ||
    store.currentDocument?.Status === "Submitted" ||
    store.currentDocument?.Status === "Returned"
  );
});
const isDirector = computed(() => {
  return store.user?.claims?.role === "Director";
});
const isHead = computed(() => {
  return store.user?.claims?.role === "Director" || store.user?.claims?.heads;
});

const isUnitAssigned = computed(() => {
  return store.currentDocument.Unit !== undefined;
});*/

const showAssignDialog = computed(() => {
  return (
    store.user?.claims?.role === "Director" ||
    store.user?.claims?.role === "Head"
  );
});
/*async function returnDocument() {
  try {
    //const staff = store.staffList.find((s) => s.uid === store.user.uid);
    await onReturnDocument(comment.value);
    comment.value = "";
  } catch (error) {
    console.log(error);
    Notify.create({
      timeout: 3000,
      closeBtn: true,
      caption: "Error",
      message: error.message,
      icon: "error",
      iconColor: "white",
      position: "right",
      color: "negative",
      badgeTextColor: "white",
    });
  }
}*/
/*async function submitDocument() {
  try {
    //const staff = store.staffList.find((s) => s.uid === store.user.uid);
    let superior = await getSuperior(store.user.claims.units[0]);
    if (!superior) {
      if (store.user.claims.heads)
        throw {
          message:
            "Director is not assigned. Please contact admin to assign Director.",
        };
      else
        throw {
          message:
            "No superior or unit head assigned. Please contact admin to assign unit head",
        };
    }

    await onSubmit(
      comment.value,
      superior,
      store.currentDocument.Unit || store.currentStaff?.Units[0],
      "Submitted"
    );
    comment.value = "";
  } catch (error) {
    console.log(error);
    Notify.create({
      timeout: 3000,
      closeBtn: true,
      caption: "Error",
      message: error.message,
      icon: "error",
      iconColor: "white",
      position: "right",
      color: "negative",
      badgeTextColor: "white",
    });
  }
}*/
</script>
