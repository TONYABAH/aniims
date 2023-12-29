<template>
  <q-card
    flat
    :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-1'"
    style="opacity: 0.99; border-radius: 2px"
  >
    <!--<q-toolbar>
      <q-icon :name="iconName" size="sm" class="q-mr-md" />
      <span class="text-h6">
        {{ store.currentCollection }}
      </span>

      <q-toolbar-title></q-toolbar-title>
      <q-btn
        flat
        icon="close"
        style="float: right"
        @click="close"
        v-if="Object.keys(store.currentDocument || {}).length > 0"
      />
    </q-toolbar>-->
    <q-card-section>
      <slot>Form slot</slot>
    </q-card-section>
    <div align="right" class="q-pr-md q-pb-lg">
      <LoadingButton
        no-caps
        unelevated
        :color="store.theme.bg.light"
        label="Submit"
        class="text-white q-ml-xs"
        icon-right="arrow_right"
        icon=""
        :submit="onSave"
        :loading="loading"
      />
      <q-btn
        unelevated
        icon="close"
        label="Cancel"
        color=""
        flat
        @click="close"
      />
    </div>
  </q-card>
</template>
<script setup>
//import { useRoute } from "vue-router";
import { useDefaultStore } from "src/stores/store";
import { Notify, Dialog } from "quasar";
import { ref, inject, defineAsyncComponent } from "vue";
import { update, create } from "src/composables/remote";

const store = useDefaultStore();
//const collectionName = inject("collection");
const searchFields = inject("searchFields");
const iconName = inject("iconName");
const loading = ref(false);

const LoadingButton = defineAsyncComponent(() =>
  import("src/components/LoadingButton.vue")
);

const props = defineProps({
  reset: Function,
  validate: Function,
  setCurrentDoc: Function,
  getDocument: Function,
  updateFields: Array,
});

function close() {
  loading.value = false;
  //tab.value = "edit";
  store.tabModel = "search";
  store.currentDocument = {};
  props.setCurrentDoc({});
  props.reset();
}
async function onSave() {
  const result = await props.validate();
  if (result) {
    try {
      loading.value = true;
      //throw { message: "Please fill form fields correctly" };
      let data = props.getDocument();
      if (store.currentDocument?.id) {
        let dt = await update(
          store.currentDocument.id,
          data,
          //currentDocument.value,
          store.currentCollection
        );
      } else {
        let response = await create(
          data,
          store.currentCollection,
          searchFields
        );
        if (store.currentDocument) store.currentDocument.id = response;
        store.currentDocument = {};
      }
      //editForm.value = false;
      Notify.create({
        timeout: 3000,
        closeBtn: true,
        caption: "Success",
        message: "Document saved",
        icon: "check",
        iconColor: "secondary",
        position: "right",
      });
    } catch (error) {
      console.error(store.user, error);
      Dialog.create({
        title: "Error",
        timeout: 2000,
        message: error.message,
        icon: "error",
        iconColor: "warning",
        color: "red",
      });
    } finally {
      loading.value = false;
    }
  }
}
</script>
