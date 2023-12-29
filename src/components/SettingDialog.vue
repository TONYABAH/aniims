<template>
  <div>
    <q-dialog v-model="settingDialog">
      <q-card flat :class="'bg-' + themeModel + '-10'" class="text-white">
        <q-toolbar class="bg-purple text-white">
          <q-avatar icon="settings" />
          <q-toolbar-title
            ><span class="q-ml-sm">Settings</span></q-toolbar-title
          >
          <q-btn flat icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-scroll-area style="width: 400px; height: 280px">
            <q-list>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label>Theme</q-item-label>
                  <q-separator spaced inset vertical dark />
                  <q-option-group
                    v-model="themeModel"
                    type="radio"
                    color="white"
                    :options="themeOptions"
                  />
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label>Security</q-item-label>
                  <q-separator spaced inset vertical dark />
                  <q-checkbox
                    v-model="keepLogin"
                    label="Keep me logged in until I logout"
                    :color="themeModel"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            unelevated=""
            label="Save settings"
            color="deep-purple"
            :loading="loading"
            @click="set"
          />
          <q-btn label="Cancel" color="negative" @click="cancel" />
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
  { label: "Grey", value: "grey" },
  { label: "Indigo", value: "indigo" },
  { label: "Teal", value: "teal" },
  { label: "Cyan", value: "cyan" },
  { label: "Purple", value: "purple" },
  { label: "Deep Purple", value: "deep-purple" },
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
