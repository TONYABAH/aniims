<template>
  <div>
    <q-dialog v-model="settingDialog">
      <q-card flat>
        <q-toolbar class="text-white" :class="'bg-' + themeModel">
          <q-avatar icon="settings" />
          <q-toolbar-title
            ><span class="q-ml-sm">Settings</span></q-toolbar-title
          >
          <q-btn flat icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section style="max-width: 300px; max-height: 280px">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label>Theme</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ themeModel }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-ripple>
              <q-item-section>
                <q-option-group
                  v-model="themeModel"
                  type="radio"
                  :color="themeModel"
                  :options="themeOptions"
                />
              </q-item-section>
              <q-item-section
                avatar=""
                :class="'bg-' + themeModel + '-8'"
                class="text-white"
              >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" :class="'bg-' + themeModel + '-7'">
          <q-btn
            unelevated=""
            label="Save settings"
            color="deep-purple"
            :loading="loading"
            glossy=""
            @click="set"
          />
          <q-btn flat label="Cancel" color="white" @click="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn flat color="" icon="settings" @click="cancel" />
  </div>
</template>

<script setup>
import { useDefaultStore } from "src/stores/store";
import { computed, ref, onMounted } from "vue";

const store = useDefaultStore();
const settingDialog = ref(false);
const themeOptions = [
  { label: "Dark", value: "blue-grey" },
  //{ label: "Grey", value: "grey" },
  { label: "Indigo", value: "indigo" },
  { label: "Teal", value: "teal" },
  //{ label: "Cyan", value: "cyan" },
  { label: "Purple", value: "purple" },
  //{ label: "Deep Purple", value: "deep-purple" },
  { label: "Pink", value: "pink" },
];
const theme = ref(store.settings?.themeColor);
const keepLogin = ref(true);
const loading = ref(false);
const themeModel = computed({
  get: () => theme.value,
  set: (v) => (theme.value = v),
});
const set = async () => {
  loading.value = true;
  const settings = {
    themeColor: themeModel.value,
    keepLogin: keepLogin.value,
  };
  store.settings = settings;

  const { saveSettings } = await import("../composables/remote.js");
  saveSettings(settings)
    .then(() => (settingDialog.value = false))
    .catch((e) => {
      console.trace(e);
    })
    .finally(() => {
      loading.value = false;
    });
};
function cancel() {
  settingDialog.value = !settingDialog.value;
  theme.value = store.settings?.themeColor || "indigo";
}
onMounted(() => {
  theme.value = store.settings?.themeColor || "indigo";
});
</script>
