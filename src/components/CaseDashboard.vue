<template>
  <q-page :style-fn="void 0">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Case No: {{ Case.case_id }} </q-toolbar-title>
      <q-btn unelevated="" color="" icon="edit" label="Edit" @click="onClick" />
      <q-btn unelevated="" color="" icon="add" label="New" @click="onClick" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{ Case.subject }}</div>
        <div class="text-subtitle2">{{ Case.status }}</div>
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
              <q-btn
                unelevated
                size="sm"
                color="primary"
                label="toggle"
                @click="onClick"
              />
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
      <q-toolbar-title> Case No: {{ Case.case_id }} </q-toolbar-title>
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
import { computed, ref, onMounted } from "vue";
import RaidForm from "src/components/forms/RaidForm.vue";
const store = useDefaultStore();

const showRaidPanel = ref(true);
const showRaidDialog = ref(false);
const Case = computed({
  get: () => store.currentDocument,
  set: (v) => (store.currentDocument = v),
});
onMounted(() => {});
</script>
