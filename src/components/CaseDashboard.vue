<template>
  <q-page :style-fn="void 0">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Case No: {{ Case.CaseId }} </q-toolbar-title>
      <q-btn unelevated="" color="" icon="edit" label="Edit" @click="onClick" />
      <q-btn unelevated="" color="" icon="add" label="New" @click="onClick" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{ Case.Title }}</div>
        <div class="text-subtitle2">{{ Case.Status }}</div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-item
            class="bg-grey-1 text-"
            clickable
            v-ripple
            @click="showRaidPanel = !showRaidPanel"
            style="border-bottom: 1px solid #bbb"
          >
            <q-item-section
              >Case raids for {{ store.user.displayName }}</q-item-section
            >
            <q-item-section side>
              <q-btn unelevated size="sm" color="primary" label="toggle" @click="onClick" />
            </q-item-section>
          </q-item>

          <div v-if="showRaidPanel">
            <q-item dense clickable="" v-for="i in 4" :key="i">
              <q-item-section side top>{{ i }}</q-item-section>
              <q-item-section>
                <q-item-label>Raid Title</q-item-label>
                <q-item-label caption lines="2">{{ new Date() }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>5 min ago</q-item-label>
                <q-icon name="star" :color="i > 2 ? 'red' : 'blue'" />
              </q-item-section>
              <q-item-section top side="">
                <q-icon
                  name="edit"
                  class="cursor-pointer"
                  @click.stop="showRaidDialog = true"
                />
              </q-item-section>
            </q-item>
          </div>
          <q-item
            class="bg-grey-1 text-"
            clickable
            v-ripple
            @click="showRaidPanel = !showRaidPanel"
            style="border-top: 1px solid #bbb"
          >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-toolbar class="bg-primary text-white" style="border-top: 1px solid #bbb">
      <q-toolbar-title> Case No: {{ Case.CaseId }} </q-toolbar-title>
      <q-btn unelevated="" color="" icon="edit" label="Edit" @click="onClick" />
      <q-btn unelevated="" color="" icon="add" label="New" @click="onClick" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-dialog v-model="showRaidDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            size="sm"
            icon="signal_wifi_off"
            color="primary"
            text-color="white"
          />
          <RaidForm />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useDefaultStore } from "src/stores/store";
import { computed, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import TableView from "./TableView.vue";
import { useCollection, useDocument } from "vuefire";
import { collection, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../composables/firebase";
import SurveillanceForm from "./SurveillanceForm.vue";
import RaidForm from "./RaidForm.vue";
// https://github.com/naver/billboard.js/wiki/CHANGELOG-v2#modularization-by-its-functionality
import { bb, area, bar, zoom, line, spline } from "billboard.js";
// 2) import css if your dev-env supports. If don't, include them via <link>
import "billboard.js/dist/billboard.css";
// or theme style. Find more themes from 'theme' folder
import "billboard.js/dist/theme/dark.css";
//import VueChartkick from "vue-chartkick";
//import "chartkick/chart.js";

const router = useRouter();
const store = useDefaultStore();
const form = ref(null);
const surveillanceDialog = ref(false);
const raidDialog = ref(false);
const showRaidPanel = ref(true);
const showRaidDialog = ref(false);

const history_columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Author", field: "Author", label: "Author", align: "left" },
];
const surveillance_columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const raid_columns = [
  { name: "Date", field: "Date", label: "Date", align: "left" },
  { name: "Title", field: "Title", label: "Title", align: "left" },
  // { name: "Address", field: "address", label: "Address", align: "left" },
];
const Case = computed({
  get: () => store.currentDocument,
  set: (v) => (store.currentDocument = v),
});
onMounted(() => {});
</script>
