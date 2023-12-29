<template>
  <q-card flat class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : ''">
    <q-toolbar
      class="bg-teal"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <q-icon name="edit" color="" />
      <q-toolbar-title class="text-bold">
        {{ store.user.displayName }} | petitions
      </q-toolbar-title>

      <q-select
        v-model="applicationYear"
        :options="year_options"
        clear-icon="clear"
        borderless=""
      />
    </q-toolbar>

    <q-list dense>
      <q-item
        clickable
        v-ripple
        v-for="(item, i) of complaints"
        :key="i"
        style="font-size: 18px"
        @click="showForm(item)"
      >
        <q-item-section side="" top>
          {{ i + 1 }}
        </q-item-section>
        <q-item-section>{{ item.Title }}</q-item-section>
      </q-item>
      <div
        class="text-h6 q-px-md q-ml-md text-italic"
        v-if="complaints.length < 1"
      >
        No complaints to show...
      </div>
      <q-item class="q-mb-sm">
        <q-item-section avatar
          ><q-btn
            flat
            unelevated
            no-caps=""
            color="primary"
            icon="add"
            label="New petition"
            to="/applications/petitions/0"
        /></q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { onMounted, computed, provide, ref } from "vue";
import { useRouter } from "vue-router";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
//import { create } from "src/composables/remote";
//import DestructionForm from "src/components/forms/DestructionForm.vue";
//import InventoryCard from "src/components/InventoryCard.vue";
//import AttachmentCard from "src/components/AttachmentCard.vue";
//import StaffSelector from "src/components/StaffSelector.vue";
const store = useDefaultStore();
const db = firestore;
const router = useRouter();
const applicationYear = ref(new Date().getFullYear());
const year_options = ref([]);
const complaintCollection = collection(db, "Complaints");

const complaintDatasource = computed(() =>
  query(
    complaintCollection,
    //where("CoyId", "==", store.company?.id || ""),
    where("ContactEmail", "==", store.user.email || ""),
    where("ApplicationYear", "==", applicationYear.value)
  )
);
const complaints = useCollection(complaintDatasource);

const inputText = ref(null);

function setTextInput(v) {
  inputText.value = v || null;
}
function showForm(value) {
  router.push("/applications/petitions/" + value.id);
}

onMounted(async () => {
  const thisYear = new Date().getFullYear();
  for (let i = 2023; i <= thisYear; i++) {
    year_options.value.push(i);
  }
  //destruction.value.ApplicationYear = applicationYear.value;
});

// defineExpose({ reset, save, add })
</script>
