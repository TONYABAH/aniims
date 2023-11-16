<template>
  <div>
    <q-dialog v-model="destructionPopupModel">
      <q-card
        class="full-width full-height"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-yellow-1'"
        style="overflow: hidden"
      >
        <q-toolbar class="bg-teal text-white">
          <q-icon name="location" color="white" />
          <q-toolbar-title> Destruction </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-scroll-area
            style="
              width: 100%;
              height: calc(100vh - 180px);
              padding-right: 16px;
            "
            :visible="true"
          >
            <DestructionApplicationVue
              ref="destructionFormRef"
              :data="destruction"
            />
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="center" class="bg-blue-grey-9">
          <q-space />
          <q-btn
            icon="check"
            label="Submit"
            color="primary"
            class="q-mr-xs"
            @click="submit"
            v-if="!destruction.id"
          />
          <q-btn
            icon="close"
            color="negative"
            :label="destruction.id ? 'Close' : 'Cancel'"
            @click="cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="petitionPopupModel">
      <q-card
        class="full-width full-height"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-yellow-1'"
        style="overflow: hidden"
      >
        <q-toolbar class="bg-teal text-white">
          <q-icon name="location" color="white" />
          <q-toolbar-title> Petition </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-scroll-area
            style="
              width: 100%;
              height: calc(100vh - 180px);
              padding-right: 32px;
            "
            :visible="true"
          >
            <ComplaintApplication ref="complaintFormRef" :data="complaint" />
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="center" class="bg-blue-grey-9">
          <q-space />
          <q-btn
            unelevated=""
            icon="check"
            label="Submit"
            color="primary"
            class="q-mr-xs"
            @click="submit"
            v-if="!complaint.id"
          />
          <q-btn
            unelevated=""
            icon="close"
            :label="complaint.id ? 'Close' : 'Cancel'"
            color="negative"
            @click="cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-bar class="bg-teal-9" v-if="store.company">
      <q-tabs
        dense
        v-model="tabModel"
        class="text-white"
        inline-label=""
        active-bg-color=""
        active-color="white"
        indicator-color="yellow"
        narrow-indicator=""
      >
        <q-tab
          tabindex="1"
          name="destruction"
          label="Destructions"
          no-caps
          exact
        />
        <q-tab
          tabindex="2"
          name="complaint"
          label="Complaints"
          no-caps=""
          exact
        />
      </q-tabs>
    </q-bar>
    <q-bar class="bg-teal-9 text-white" v-if="store.company">
      <q-btn-dropdown
        flat
        square
        unelevated=""
        :label="applicationYear"
        color="white"
      >
        <q-list dense>
          <q-item
            clickable
            v-close-popup
            @click="selectYear(y)"
            v-for="(y, i) of year_options"
            :key="i"
          >
            <q-item-section>
              <q-item-label>{{ y }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!--<q-input
        dark
        v-model="search"
        type="search"
        label="Search"
        clearable=""
        :bg-color="$q.dark.isActive ? 'blue-9' : 'blue-9'"
        rounded=""
        dense=""
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>-->
    </q-bar>
    <q-tab-panels
      v-model="tabModel"
      animated
      v-if="store.company"
      class="q-ma-sm"
      :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-yellow-1'"
    >
      <q-tab-panel name="destruction">
        <div class="text-h6">Destruction</div>
        <q-card class="my-card transparent">
          <q-list bordered dense>
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of destructions"
              :key="i"
              @click="showDestructionDialog(item)"
            >
              <q-item-section side="" top>
                {{ i + 1 }}
              </q-item-section>
              <!--<q-item-section thumbnail="">
                    <q-icon color="primary" name="delete" class="q-ml-md" />
                  </q-item-section>-->
              <q-item-section>{{ item.Title }}</q-item-section>
            </q-item>
            <q-item class="q-mb-sm">
              <q-item-section avatar
                ><q-btn
                  flat
                  unelevated
                  no-caps=""
                  color="primary"
                  icon="add"
                  label="New Destruction"
                  @click="showDestructionDialog()"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="complaint">
        <div class="text-h6">Petition</div>
        <q-card class="my-card transparent">
          <q-list bordered dense>
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of complaints"
              :key="i"
              @click="showPetitionDialog(item)"
            >
              <q-item-section side="" top>
                {{ i + 1 }}
              </q-item-section>
              <!--<q-item-section thumbnail="">
                    <q-icon color="primary" name="campaign" class="q-ml-md" />
                  </q-item-section>-->
              <q-item-section>{{ item.Title }}</q-item-section>
            </q-item>
            <q-item class="q-mb-sm">
              <q-item-section avatar
                ><q-btn
                  flat
                  no-caps=""
                  unelevated
                  color="primary"
                  icon="add"
                  label="New Petition"
                  @click="showPetitionDialog()"
              /></q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
    <!--<q-card flat square class="my-card bg-transparent" v-if="store.company">
      <q-card-section>
        <q-scroll-area
          style="width: 100%; height: calc(100vh - 180px); padding-right: 32px"
          :visible="true"
        >
          <q-card class="my-card">
            <q-expansion-item
              expand-separator
              icon="delete"
              label="Destructions"
            >
              <q-list bordered dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(item, i) of destructions"
                  :key="i"
                  @click="showDestructionDialog(item)"
                >
                  <q-item-section side="" top>
                    {{ i + 1 }}
                  </q-item-section>
                  <q-item-section>{{ item.Title }}</q-item-section>
                </q-item>
                <q-item class="q-mb-sm">
                  <q-item-section avatar
                    ><q-btn
                      flat
                      unelevated
                      no-caps=""
                      color="primary"
                      icon="add"
                      label="New Destruction"
                      @click="showDestructionDialog"
                  /></q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-card>

          <q-separator spaced inset vertical dark />
          <q-card class="my-card">
            <q-expansion-item
              expand-separator
              icon="campaign"
              label="Petitions"
            >
              <q-list bordered dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(item, i) of complaints"
                  :key="i"
                  @click="showPetitionDialog(item)"
                >
                  <q-item-section side="" top>
                    {{ i + 1 }}
                  </q-item-section>
                  <q-item-section>{{ item.Title }}</q-item-section>
                </q-item>
                <q-item class="q-mb-sm">
                  <q-item-section avatar
                    ><q-btn
                      flat
                      no-caps=""
                      unelevated
                      color="primary"
                      icon="add"
                      label="New Petition"
                      @click="showPetitionDialog"
                  /></q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-card>
        </q-scroll-area>
      </q-card-section>
    </q-card>-->
    <q-card flat dark class="my-card bg-transparent" v-else>
      <q-card-section> </q-card-section>
      <q-card-section>
        <div class="text-h5 q-px-xl text-teal-5">
          Your company accounts is empty. Add a company to your account on the
          ledft panel. Select a company account to see the widgets here.
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
//import { Dialog } from "quasar";
//import TextEditor from "src/components/TextEditor.vue";
//import LocationForm from "src/components/LocationForm.vue";
//import TableView from "src/components/TableView.vue";
//import { onAddDocument, onDeleteDocument } from "src/composables/remote";
import { useDefaultStore } from "src/stores/store";
import { onMounted, computed, watch, ref } from "vue";
import DestructionApplicationVue from "./DestructionApplication.vue";
import ComplaintApplication from "./ComplaintApplication.vue";
import { create } from "../composables/remote";
import { useCollection, useDocument, useDatabase } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "src/composables/firebase";

const store = useDefaultStore();

const form = ref(null);
const tabModel = ref("destruction");
const destructionPopupModel = ref(false);
const petitionPopupModel = ref(false);
const applicationYear = ref(new Date().getFullYear());
const year_options = ref([]);
const complaintFormRef = ref(null);
const destructionFormRef = ref(null);
const complaint = ref({});
const destruction = ref({});

const db = firestore;
const complaintCollection = collection(db, "Complaints");
const destructionCollection = collection(db, "Destructions");
const complaintDatasource = computed(() =>
  query(
    complaintCollection,
    where("CoyId", "==", store.company?.id || ""),
    where("ApplicationYear", "==", applicationYear.value)
  )
);
const destructionDatasource = computed(() =>
  query(
    destructionCollection,
    where("CoyId", "==", store.company?.id || ""),
    where("ApplicationYear", "==", applicationYear.value)
  )
);
const complaints = useCollection(complaintDatasource);
const destructions = useCollection(destructionDatasource);

function selectYear(y) {
  applicationYear.value = y;
}

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

function showDestructionDialog(value) {
  destruction.value = value || {};
  store.currentDocument = value || {};
  destructionPopupModel.value = true;
  store.currentCollection = "Destructions";
}
function showPetitionDialog(value) {
  complaint.value = value || {};
  store.currentDocument = value || {};
  petitionPopupModel.value = true;
  store.currentCollection = "Complaints";
}
async function cancel() {
  const { reset } = destructionPopupModel.value
    ? destructionFormRef.value
    : complaintFormRef.value;
  reset();
  petitionPopupModel.value = false;
  destructionPopupModel.value = false;
}
async function submit() {
  const { data, collection, searchFields, reset, validate } =
    destructionPopupModel.value
      ? destructionFormRef.value
      : complaintFormRef.value;
  const validated = await validate();

  if (validated)
    create(data, collection, searchFields)
      .then((resp) => {
        //complaint.value.id = resp.data.id;
        cancel();
      })
      .catch((e) => {
        Dialog.create({
          title: "Error",
          message: e.message,
          color: "red",
        });
      });
}
/*watch(
  applicationYear,
  (y) => {
    console.log(y);
  }
  //{ immediate: true }
);*/
defineExpose({
  reset,
  validate,
});

onMounted(async () => {
  const thisYear = new Date().getFullYear();
  for (let i = 2023; i <= thisYear; i++) {
    year_options.value.push(i);
  }
});

// defineExpose({ reset, save, add })
</script>
