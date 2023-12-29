<template>
  <q-toolbar
    class="text-white"
    :class="store.theme.bg.light"
    v-if="destruction?.id"
  >
    <q-tabs
      v-model="tabModel"
      :inline-label="true"
      :active-bg-color="store.theme.color.default"
      indicator-color="amber"
      narrow-indicator=""
      outside-arrows=""
      mobile-arrows=""
      active-color="white"
      active-class=""
      align="justify"
    >
      <q-tab
        tabindex="1"
        name="form"
        :label="$q.screen.lt.sm ? '' : 'Form'"
        icon="edit"
        no-caps
        exact
        v-if="!destruction.id || !destruction.Submitted"
      />
      <q-tab
        tabindex="2"
        name="inventory"
        :label="$q.screen.lt.sm ? '' : 'Inventory'"
        icon="shopping_cart"
        no-caps
        exact
        v-if="destruction.id && !destruction.Submitted"
      />
      <q-tab
        tabindex="3"
        name="attachment"
        :label="$q.screen.lt.sm ? '' : 'Attachments'"
        icon="attachment"
        no-caps
        exact
        v-if="destruction.id && !destruction.Submitted"
      />
      <q-tab
        tabindex="3"
        name="history"
        :label="$q.screen.lt.sm ? '' : 'History'"
        icon="time"
        no-caps
        exact
        v-else
      />
    </q-tabs>
  </q-toolbar>
  <q-tab-panels
    ref="tabPanelRef"
    v-model="tabModel"
    animated
    vertical=""
    transition-next="scale"
    transition-prev="scale"
    keep-alive=""
    class="full-height full-width"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'"
  >
    <q-tab-panel
      name="form"
      style="overflow: auto; height: calc(100vh - 158px); padding: 4px"
    >
      <q-card
        class="shadow-22"
        :class="$q.screen.lt.sm ? '' : 'q-mx-xl q-mb-xl'"
      >
        <q-toolbar class="q-pl-lg bg-cyan-8 text-white">
          <q-icon name="database" color="" />
          <q-toolbar-title> Application form </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <DestructionForm
            :data="destruction"
            :set-data="setDestruction"
            ref="destructionFormRef"
          />
        </q-card-section>
        <q-card-actions align="center" class="bg-">
          <q-space />
          <q-btn
            unelevated
            icon="arrow_back"
            label="Return"
            :color="store.theme.color.normal"
            @click="cancel"
          />
          <q-btn
            unelevated
            icon-right="arrow_right"
            label="Save & Continue"
            class="q-mr-xs"
            :color="store.theme.color.normal"
            :loading="loading"
            @click="save"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Saving...
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-tab-panel>
    <q-tab-panel
      name="inventory"
      style="overflow: auto; height: calc(100vh - 158px); padding: 4px"
    >
      <InventoryCard
        ref="inventoryRef"
        :items="destruction?.inventory"
        :next-tab="nextTab"
        :previous-tab="previousTab"
        :saveInventory="saveInventory"
        :loading="loading"
      />
    </q-tab-panel>
    <q-tab-panel
      name="attachment"
      style="overflow: auto; height: calc(100vh - 158px); padding: 4px"
    >
      <AttachmentCard
        :next-tab="nextTab"
        :previous-tab="previousTab"
        :attached-documents="destruction?.Attachments || []"
        :add-attachment="addAttachment"
        :set-attachments="setAttachments"
        :removeAttachment="removeAttachment"
        :documentId="destruction?.id || 0"
        :submit="submit"
      />
    </q-tab-panel>
    <q-tab-panel name="done" align="center" style="padding: 4px">
      <q-card flat :class="$q.screen.lt.sm ? '' : 'q-px-xl q-pb-xl'">
        <q-card-section>
          <q-avatar
            size="124px"
            font-size="96px"
            color="teal"
            text-color="white"
            icon="check"
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-teal">
            Thank you for submiting destruction application.
          </div>
          <div class="text-h6">
            Please check your email or text messages for feedback
          </div>
          <q-separator spaced inset vertical dark />
          <div class="text-subheading2">Aniims&trade; Team</div>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn
            unelevated
            padding="md"
            label="Back"
            to="/applications/destructions"
            :color="store.theme.color.normal"
          />
        </q-card-actions>
      </q-card>
    </q-tab-panel>
    <q-tab-panel name="history" align="center" style="padding: 4px">
      <q-card flat :class="$q.screen.lt.sm ? '' : 'q-px-xl q-pb-xl'">
        <q-card-section
          ><div class="text-h6">{{ store.currentDocument?.Title }}</div>
          <div class="text-subheading2">{{ store.company?.Name }}</div>
          <HistoryTabCard />
        </q-card-section>

        <q-card-section>
          <q-separator spaced inset vertical dark />
          <div class="text-subheading2">Aniims&trade; Team</div>
        </q-card-section>
      </q-card>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { useRoute, useRouter } from "vue-router";
import { Dialog } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { collection, query, orderBy, doc } from "firebase/firestore";
//import DestructionApplicationVue from "./DestructionApplication.vue";
import { useCollection } from "vuefire";
//import { collection, doc, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import {
  create,
  getById,
  update,
  onAddAttachment,
} from "src/composables/remote";
import DestructionForm from "src/components/forms/DestructionForm.vue";
import InventoryCard from "src/components/InventoryCard.vue";
import AttachmentCard from "src/components/AttachmentCard.vue";
import HistoryTabCard from "src/components/HistoryTabCard.vue";

const store = useDefaultStore();
const route = useRoute();
const router = useRouter();
const tabPanelRef = ref(null);
const form = ref(null);
const tabModel = ref("form");
const year_options = ref([]);
const destructionFormRef = ref(null);
const inventoryRef = ref(null);
const loading = ref(false);
let id = route.params?.id?.substring(route.params?.id?.indexOf("/") + 1) || 0;
const collectionName = "Destructions";
//if (id === 0) id = null;
/*const destructionSource = computed(() =>
  doc(collection(db, collectionName), id)
);*/
const destruction = ref({}); //useDocument(destructionSource);

function addAttachment(doc) {
  //inventoryRef
  loading.value = true;
  onAddAttachment(collectionName, destruction.value.id, doc)
    //update(destruction.value.id, data, collectionName)
    .then(() => {
      //nextTab();
      destruction.value.Attachments
        ? destruction.value.Attachments.push(doc)
        : (destruction.value.Attachments = [doc]);
    })
    .catch((e) => {
      Dialog.create({
        message: e.message,
        title: "Error",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function setAttachments(doc) {
  destruction.value.Attachments = [doc];
}
function removeAttachment(index) {
  destruction.value.Attachments.splice(index, 1);
}

function setDestruction(v) {
  destruction.value = v || {};
}
function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

async function cancel() {
  const { reset } = destructionFormRef.value;
  reset();
  router.back();
  //router.push("/applications");
}
async function save() {
  const { data, collection, searchFields, reset, validate } =
    destructionFormRef.value;
  const validated = await validate();

  if (validated) {
    loading.value = true;
    if (destruction.value?.id) {
      let d = Object.assign({}, destruction.value);
      if (d.Attachments) delete d.Attachments;
      if (d.Inventory) delete d.Inventory;
      update(destruction.value.id, d, store.currentCollection)
        .then(() => {
          //tabPanelRef.value.next();
          nextTab();
        })
        .catch((e) => {
          console.trace(e);
          Dialog.create({
            title: "Error",
            message: e.message,
            color: "red",
          });
        })
        .finally(() => (loading.value = false));
    } else {
      data.CoyId = store?.company?.id || null;
      data.ApplicationYear = new Date().getFullYear();
      create(data, store.currentCollection, searchFields)
        .then((resp) => {
          if (destruction.value) {
            destruction.value.id = resp;
            tabPanelRef.value.next();
          } else {
            //tabPanelRef.value.next();
            nextTab();
            router.push("/applications/" + resp);
          }
        })
        .catch((e) => {
          console.trace(e);
          Dialog.create({
            title: "Error",
            message: e.message,
            color: "red",
          });
        })
        .finally(() => (loading.value = false));
    }
  }
}
async function saveInventory(inventory) {
  //inventoryRef
  let data = {
    Inventory: inventory,
  };
  loading.value = true;
  update(destruction.value.id, data, store.currentCollection)
    .then(() => {
      nextTab();
    })
    .catch((e) => {
      Dialog.create({
        message: e.message,
        title: "Error",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
function submit() {
  if (destruction.value?.id) {
    let d = { Submitted: true };
    let dl = Dialog.create({
      title: "Submit application",
      html: true,
      message:
        "If you submit this application you will no longer be able to access it again. <button style='background:red;color:white;border:none'>Click CANCEL if you are not sure</button>",
      ok: {
        label: "Submit",
        color: store.theme.color.normal,
        iconRight: "arrow_right",
      },
      cancel: {
        color: "negative",
        icon: "close",
      },
    });
    dl.onOk(() => {
      loading.value = true;
      update(destruction.value.id, d, store.currentCollection)
        .then(() => {
          nextTab();
          destruction.value.Submitted = true;
        })
        .catch((e) => {
          console.trace(e);
          Dialog.create({
            title: "Error",
            message: e.message,
            color: "red",
          });
        })
        .finally(() => (loading.value = false));
    });
  }
}
function nextTab() {
  tabPanelRef.value.next();
}
function previousTab() {
  tabPanelRef.value.previous();
}
watch(
  () => route.path,
  async (p) => {
    let id = route.params?.id?.substring(route.params.id.indexOf("/") + 1) || 0;
    //alert(id);
    if (id === 0) {
      destruction.value = {};
      return;
    }
  },
  { immediate: true }
);
defineExpose({
  reset,
  validate,
});
watch(
  () => store.currentDocument,
  async (doc) => {
    //props.setCurrentDoc(Object.assign({}, store.currentDocument));
    if (doc?.id) {
      const histSource = query(
        collection(firestore, store.currentCollection, doc.id, "History"),
        orderBy("time", "asc")
      );
      store.history = useCollection(histSource);
      store.minutes = useCollection(
        query(
          collection(firestore, store.currentCollection, doc.id, "Minutes"),
          orderBy("time", "asc")
        )
      );
    }
  }
);
onBeforeMount(async () => {
  const thisYear = new Date().getFullYear();
  for (let i = 2023; i <= thisYear; i++) {
    year_options.value.push(i);
  }
  let d = await getById(id, collectionName);
  destruction.value = d || {};
  if (!d) {
    destruction.value.ContactName = store.user.displayName;
    destruction.value.ContactPhone = store.user.phoneNumber;
    destruction.value.ContactEmail = store.user.email;
  }
  store.currentCollection = collectionName;
  store.currentDocument = destruction.value;
  if (destruction.value?.Submitted) {
    tabModel.value = "history";
  }
  //destruction.value.ApplicationYear = applicationYear.value;
});

// defineExpose({ reset, save, add })
</script>
<style scoped>
.border-radius {
  border-radius: 0 0 8px 8px;
}
</style>
