<template>
  <q-dialog v-model="model" persistent>
    <q-card dark class="bg-blue-grey-9">
      <q-card-section class="row items-center bg-blue-grey-8 text-white">
        <q-icon name="shopping_cart" />
        <span class="q-ml-sm">{{ raid?.Title || "Add new" }}</span>
      </q-card-section>
      <q-card-section>
        <RaidForm ref="raidFormRef" :data="raid" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-if="raid?.id"
          no-caps=""
          label="Delete"
          color="red"
          v-close-popup
          @click="onDelete"
        />
        <q-space />
        <q-btn
          no-caps=""
          label="Submit"
          color="primary"
          v-close-popup
          @click="onSubmit"
        />
        <q-btn
          no-caps=""
          label="Cancel"
          color="primary"
          v-close-popup
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, inject, ref } from "vue";
import RaidForm from "src/components/forms/RaidForm.vue";
const raidFormRef = ref(null);
const $q = useQuasar();

const submitRaid = inject("submit-raid");
const removeRaid = inject("remove-raid");

const props = defineProps({
  popupModel: { type: Boolean, default: false },
  onChangeModel: Function,
  raid: Object,
  onAddRaid: Function,
  onRemoveRaid: Function,
  onEditRaid: Function,
  caseId: String,
});
const model = computed({
  get: () => props.popupModel,
  set: (v) => props.onChangeModel(v),
});
async function onDelete() {
  const r = raidFormRef.value.raid;
  removeRaid(r);
}

async function onSubmit() {
  const r = raidFormRef.value.raid;
  submitRaid(r);
}

function onCancel() {
  // props.value.onRemoveProduct(productFormRef.value.product.id)
  raidFormRef.value.reset();
}
</script>
