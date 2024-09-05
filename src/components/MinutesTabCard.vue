<template>
  <q-card flat class="my-card">
    <q-bar>
      <q-icon name="comment" size="sm" class="q-mr-md" />
      <span class="text-h6"> {{ store.currentCollection }} / minutes</span>
    </q-bar>
    <q-bar>
      <div class="text-h6">{{ store.currentDocument.Title }}</div>
    </q-bar>

    <q-card-section style="padding: 0">
      <CommentsPanel />
      <q-separator spaced inset vertical dark />
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
  <q-page-sticky position="bottom" :offset="[0, 0]" expand>
    <q-form
      autofocus=""
      class="q-pa-sm q-mb-xs q-mt-md full-width"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-12'"
      style="border-radius: 0px; opacity: 1"
      v-if="
        isDocumentUnassignedByUser || isDocumentAssignedToUser || ressignable
      "
    >
      <q-bar class="bg-transparent" style="padding: 0px; padding-bottom: 6px">
        <q-toolbar-title>
          <label for="" class="text-">Write minutes</label>
        </q-toolbar-title>
        <FloatingEditorButtons
          label=""
          padding="sm"
          unelevated
          flat
          :color="$q.dark.isActive ? 'white' : 'pink'"
          vertical-actions-align="right"
          :assign="showAssignDialog"
          :submit="showSubmitDialog"
          :isDirector="isDirector"
          :returnable="returnable"
          :returnDocument="returnDocument"
          :assignable="assignable"
          :submitable="submitable"
          :glossy="false"
          :loading="loading"
          :direction="$q.screen.gt.xs ? 'left' : 'down'"
          v-if="comment"
        />
      </q-bar>
      <!--<TextEditor :Text="comment" :setText="(text) => (comment = text)" />-->
      <CommentsForm :text="comment" :setText="(text) => (comment = text)" />
      <q-bar class="bg-transparent" style="padding: 0">
        <FloatingEditorButtons
          :assign="showAssignDialog"
          :submit="showSubmitDialog"
          :isDirector="isDirector"
          :returnable="returnable"
          :returnDocument="returnDocument"
          :assignable="assignable"
          :submitable="submitable"
          :glossy="false"
          :loading="loading"
          :direction="$q.screen.gt.xs ? 'right' : 'up'"
          unelevated
          vertical-actions-align="right"
          square
          :flat="$q.dark.isActive"
          :outline="!$q.dark.isActive"
          label="Comment"
          padding="sm"
          :color="$q.dark.isActive ? 'white' : 'teal'"
          :disable="!comment"
        />
        <q-space />
        <q-btn
          flat
          color=""
          icon="undo"
          label="Cancel"
          :disable="!comment"
          @click="comment = ''"
        />
      </q-bar>
    </q-form>
  </q-page-sticky>
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
import CommentsForm from "./CommentsForm.vue";

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
const isAdmin = computed(() => store.user.claims.admin);
const getUser = (uid) => {
  let user = store.staffList.find((s) => s.uid === uid);
  return user?.Role;
};

const isDocumentAssignedToUser = computed(() => {
  return (
    store.currentDocument?.meta?.To === store.user.uid &&
    store.currentDocument?.meta?.From !== undefined
  );
});
const isDocumentUnassignedByUser = computed(() => {
  return (
    store.currentDocument?.meta?.Status === "Created" &&
    store.currentDocument?.meta?.CreatedBy === store.user.uid
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
async function onDialogOk(assigned) {
  //console.log(assigned);
  submit(assigned);
}

async function submit(assigned) {
  loading.value = true;
  let action = dialogAction.value;
  let title =
    store.currentDocument.Title ||
    store.currentDocument.Subject ||
    store.currentDocument.Name ||
    store.currentDocument.displayName;
  onSubmit(title, comment.value, assigned, store.currentDocument.id, action)
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
  submit(user);
}
function showSubmitDialog() {
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
function showAssignDialog() {
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
const ressignable = computed(() => {
  let fromUid = currentDocument.value?.meta?.From;
  let toUid = currentDocument.value?.meta?.To;
  let fromUser = getUser(fromUid);
  let toUser = getUser(toUid);

  return (
    isAdmin.value ||
    (fromUid === store.user.uid &&
      (isDirector.value ||
        (isHod.value &&
          (toUser.Unit === fromUser.Unit ||
            toUser.Location === fromUser.Location)) ||
        (isHou.value &&
          toUser.Unit === fromUser.Unit &&
          toUser.Role !== "Head Location" &&
          toUser.Role !== "Head Division")))
  );
});
</script>
