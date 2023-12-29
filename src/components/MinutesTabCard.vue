<template>
  <q-card flat class="my-card bg-transparent">
    <q-toolbar>
      <q-icon name="comment" size="sm" class="q-mr-md" />
      <span class="text-h6"> {{ store.currentCollection }} / minutes</span>
    </q-toolbar>
    <q-card-section>
      <CommentsPanel />
      <q-separator spaced inset vertical dark />
      <q-form autofocus="" class="text-teal">
        <label for="" class="">Write minutes</label>
        <textarea
          v-model="comment"
          autofocus
          rows="5"
          class="full-width q-px-sm"
          :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'"
          :disabled="!commentable"
        ></textarea>
        <q-toolbar class="bg-transparent" style="padding: 0">
          <q-toolbar-title> </q-toolbar-title>
          <q-btn-dropdown
            unelevated=""
            glossy
            label="Send Minute"
            :color="store.theme.color.light"
          >
            <q-list dense>
              <q-item
                clickable
                v-close-popup
                :disable="!comment"
                @click="assign"
              >
                <q-item-section>
                  <q-item-label>Assign</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="arrow_right" />
                </q-item-section>
              </q-item>
              <q-item
                v-show="!isDirector"
                clickable
                v-close-popup
                :disable="!comment"
                @click="submit"
              >
                <q-item-section>
                  <q-item-label>Submit</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="check" />
                </q-item-section>
              </q-item>
              <q-item
                v-show="isDocumentAssignedToUser"
                clickable
                v-close-popup
                :disable="!comment"
                @click="returnDocument"
              >
                <q-item-section>
                  <q-item-label>Return</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="undo" />
                </q-item-section>
              </q-item>
            </q-list>
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Wait...
            </template>
          </q-btn-dropdown>
        </q-toolbar>
      </q-form>
    </q-card-section>
    <AssignDialog
      :model="assignDialogModel"
      :setModel="setAssignDialogModel"
      :onOk="onDialogOk"
      :onCancel="onDialogCancel"
      :action="dialogAction"
      :iconName="iconName"
      ref="dialogRef"
    />
  </q-card>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, provide } from "vue";
import { useDefaultStore } from "src/stores/store";
import { Dialog, Notify } from "quasar";
import { onAssign, onSubmit } from "src/composables/remote";
import AssignDialog from "src/components/AssignDialog.vue";

const store = useDefaultStore();
const comment = ref("");
const assignDialogModel = ref(false);
const iconName = ref("");
const dialogRef = ref(null);
const loading = ref(false);
const dialogAction = ref("");

const isDirector = computed(() => store.user.claims.role === "Director");
const isHod = computed(
  () =>
    store.user.claims.role === "Head Division" ||
    store.user.claims.role === "Head Location"
);
const isDocumentAssignedToUser = computed(() => {
  return store.currentDocument?.meta?.To === store.user.uid;
});

const CommentsPanel = defineAsyncComponent(() =>
  import("src/components/CommentsPanel.vue")
);
function setAssignDialogModel(v) {
  assignDialogModel.value = v;
}

function onDialogCancel() {
  console.log("Action cancelled by user");
}
async function onDialogOk(assigned, unit) {
  submitDocument(assigned, unit);
}

async function submitDocument(assigned, unit) {
  loading.value = true;
  let action = dialogAction.value;
  onSubmit(comment.value, assigned, unit, store.currentDocument.id, action)
    .then(() => {
      assignDialogModel.value = false;
      dialogRef.value.reset();
      comment.value = "";
    })
    .catch(() => {
      Notify.create({
        timeout: 3000,
        textColor: "white",
        message: error.message,
        icon: "error",
        iconColor: "white",
        color: "red",
        position: "right",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function submit() {
  dialogAction.value = "Submit";
  iconName.value = "check";

  if (isHod.value) {
    let dir = store.staffList.find((s) => s.Role === "Director");
    if (dir) {
      // Submit to director
      submitDocument(dir, store.currentDocument?.meta?.unit || "");
    } else {
      Notify.create({
        timeout: 3000,
        textColor: "white",
        message: "Director is not assigned",
        icon: "error",
        iconColor: "white",
        color: "red",
        position: "right",
      });
    }
  } else if (store.currentDocument.meta.From) {
    let oldUser = store.staffList.find(
      (s) => s.uid === store.currentDocument?.meta?.From
    );
    if (oldUser) {
      // submit to old user (HOU or HOD or Director)
      submitDocument(oldUser, store.currentDocument?.meta?.unit);
    } else {
      Notify.create({
        timeout: 3000,
        textColor: "white",
        message: "User not found: " + store.currentDocument.meta.From,
        icon: "error",
        iconColor: "white",
        color: "red",
        position: "right",
      });
      assignDialogModel.value = true;
    }
  } else {
    // Show dialog
    assignDialogModel.value = true;
  }
}
function assign() {
  dialogAction.value = "Assign";
  iconName.value = "arrow_right";
  assignDialogModel.value = true;
}
async function returnDocument() {
  dialogAction.value = "Return";
  const doc = store.currentDocument;
  const unit = doc.meta.unit;
  const user = doc.meta.From;
  //const id = doc.id;
  submitDocument(user, unit);
}

const currentDocument = computed({
  get: () => store.currentDocument || {},
  set: (v) => {
    store.currentDocument = v;
  },
});
const commentable = computed(() => {
  /*console.log(
    currentDocument.value?.meta?.Status === "Created" &&
      store.user?.uid === currentDocument.value?.meta?.CreatedBy
  );*/
  return (
    currentDocument.value?.id &&
    (store.user?.claims?.admin ||
      store.user?.uid === currentDocument.value?.meta?.To ||
      (currentDocument.value?.meta?.Status === "Created" &&
        store.user?.uid === currentDocument.value?.meta?.CreatedBy))
  );
});
</script>
