<template>
  <q-card flat class="my-card">
    <q-toolbar>
      <q-icon name="comment" size="sm" class="q-mr-md" />
      <span class="text-h6"> {{ store.currentCollection }} / minutes</span>
    </q-toolbar>
    <q-card-section>
      <CommentsPanel />
      <q-separator spaced inset vertical dark />

      <q-form autofocus="" class="text-teal">
        <label for="" class="">Write minutes</label>
        <TextEditor :Text="comment" :setText="(text) => (comment = text)" />
        <q-toolbar class="bg-transparent" style="padding: 0">
          <q-toolbar-title> </q-toolbar-title>
          <FloatingEditorButtons
            :assign="assignDocument"
            :submit="submitDocument"
            :isDirector="isDirector"
            :returnable="returnable"
            :returnDocument="returnDocument"
            :assignable="assignable"
            :submitable="submitable"
            :glossy="true"
            :loading="loading"
            padding="sm"
            color="red"
            direction="left"
            v-if="comment"
          />
          <q-btn-dropdown
            unelevated=""
            glossy
            label="Minute"
            class="q-ml-xs"
            :color="store.theme.color.light"
            :loading="loading"
            v-if="comment"
          >
            <q-list dense>
              <q-item
                clickable
                v-close-popup
                v-if="assignable"
                @click="assignDocument"
              >
                <q-item-section>
                  <q-item-label>Assign</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="arrow_right" />
                </q-item-section>
              </q-item>
              <q-item
                v-show="submitable"
                clickable
                v-close-popup
                @click="submitDocument"
              >
                <q-item-section>
                  <q-item-label>Submit</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="check" />
                </q-item-section>
              </q-item>
              <q-item
                v-if="returnable"
                v-show="isDocumentAssignedToUser"
                clickable
                v-close-popup
                @click="returnDocument"
              >
                <q-item-section>
                  <q-item-label>Return</q-item-label>
                </q-item-section>
                <q-item-section side>
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
      :loading="loading"
      ref="dialogRef"
    />
  </q-card>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from "vue";
//import { useRouter } from "vue-router";
import { useDefaultStore } from "src/stores/store";
import { Notify, Dialog } from "quasar";
import { onSubmit } from "src/composables/remote";
import AssignDialog from "src/components/AssignDialog.vue";
import TextEditor from "src/components/TextEditor.vue";
import FloatingEditorButtons from "./FloatingEditorButtons.vue";

const store = useDefaultStore();
//const router = useRouter();
const comment = ref("");
const assignDialogModel = ref(false);
const iconName = ref("");
const dialogRef = ref(null);
const loading = ref(false);
const dialogAction = ref("");

const props = defineProps({
  onMinuted: Function,
});
const isDirector = computed(() => store.user.claims.role === "Director");
const isHod = computed(
  () =>
    store.user.claims.role === "Head Division" ||
    store.user.claims.role === "Head Location"
);
const isHou = computed(() => store.user.claims.role === "Head Unit");
/*const isFromHead = computed(() => {
  let user = store.staffList.find(
    (s) => s.uid === currentDocument.value?.meta?.From
  );
  return user.Heads !== undefined && user.Heads.length > 0;
});*/
const isDocumentAssignedToUser = computed(() => {
  return (
    store.currentDocument?.meta?.To === store.user.uid &&
    store.currentDocument?.meta?.From !== undefined
  );
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
  //console.log(assigned, unit);
  submit(assigned, unit);
}

async function submit(assigned, unit) {
  loading.value = true;
  let action = dialogAction.value;
  onSubmit(comment.value, assigned, unit, store.currentDocument.id, action)
    .then(() => {
      assignDialogModel.value = false;
      //dialogRef.value.reset();
      comment.value = "";
      store.tabModel = "search";
      props.onMinuted();
    })
    .catch((error) => {
      console.trace(error);
      Dialog.create({
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
async function returnDocument() {
  dialogAction.value = "Return";
  const doc = store.currentDocument;
  const unit = doc.meta.unit || null;
  const user = store.staffList.find((s) => s.uid === doc.meta.From);
  if (!user) {
    Notify.create({
      timeout: 3000,
      textColor: "white",
      message: "User not found: " + doc.meta.From,
      icon: "error",
      iconColor: "white",
      color: "red",
      position: "right",
    });
    return;
  }
  submit(user, unit);
}
function submitDocument() {
  dialogAction.value = "Submit";
  iconName.value = "check";
  assignDialogModel.value = true;
  /*if (isHod.value) {
    let dir = store.staffList.find((s) => s.Role === "Director");
    if (dir) {
      // Submit to director
      submit(dir, store.currentDocument?.meta?.unit || null);
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
      submit(oldUser, store.currentDocument?.meta?.unit || null);
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
  }*/
}
function assignDocument() {
  dialogAction.value = "Assign";
  iconName.value = "arrow_right";
  assignDialogModel.value = true;
}

const currentDocument = computed({
  get: () => store.currentDocument || {},
  set: (v) => {
    store.currentDocument = v;
  },
});
const returnable = computed(() => {
  return (
    currentDocument.value?.meta?.From !== undefined &&
    store.user?.uid === currentDocument.value?.meta?.To
  );
});
const assignable = computed(() => {
  return isHou.value || isHod.value || isDirector.value;
});
const submitable = computed(() => {
  return !isDirector.value; // && !isFromHead.value;
});
</script>
