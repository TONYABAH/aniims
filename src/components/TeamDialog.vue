<template>
  <q-dialog v-model="model" persistent>
    <q-card>
      <q-bar class="row items-center bg-teal text-white">
        <q-icon name="people" color="white" />
        <span class="q-ml-sm">Team</span>
      </q-bar>
      <q-card-section class="row items-center q-px-xl">
        <q-form class="q-gutter-md">
          <StaffSelector
            label="Staff"
            dense
            :selected="member"
            field-label="Staff"
            outlined
            :setModel="onChangeModel"
          >
            <template v-slot:prepend> <q-icon name="person" /> </template>
          </StaffSelector>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="q-px-xl q-pb-lg">
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
          unelevated=""
          label="Cancel"
          color="red"
          v-close-popup
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useDefaultStore } from "src/stores/store";
import { computed, ref } from "vue";
import StaffSelector from "./StaffSelector.vue";
const store = useDefaultStore();
const $q = useQuasar();
const emit = defineEmits(["add-member", "remove-member"]);

const props = defineProps({
  popupModel: { type: Boolean, default: false },
  member: Object,
  officers: Array,
  onChangeModel: Function,
  officerId: Number,
  raidId: Number,
  readOnly: Boolean,
});
const teamMember = ref(props.member);
//const submitTeamMember = inject("submit-member")
//const removeTeamMember = inject("remove-member")
const model = computed({
  get: () => store.teamDialogModel,
  set: (v) => (store.teamDialogModel = v),
});
const roleList = ["Lead", "Member"];

async function onSubmit() {
  let res = null;
  let m = {
    raid_id: props.raidId,
    officer_id: store.teamMember.officer_id,
    role: store.teamMember.role,
    name: store.teamMember.name,
  };
  const path = "teams";
  try {
    if (m.id) {
      $q.notify({
        icon: "check",
        color: "secondary",
        message: "Updated not supported for teams",
      });
    } else {
      m.raid_id = props.raidId;
      res = await api.post(path, m);
      m.id = res.data.insertId;

      $q.notify({
        icon: "check",
        color: "secondary",
        message: "Added item at position " + res.data.insertId,
      });
    }
    emit("add-member");
    model.value = false;
    store.teamMembers.push(store.teamMember);
  } catch (e) {
    $q.notify({
      icon: "error",
      color: "red",
      message: e.message,
    });
  } finally {
    store.teamMember = {};
  }
}
async function onDelete(data) {
  try {
    await api.delete("teams/" + teamMember.value.id);
    $q.notify({
      icon: "check",
      color: "secondary",
      message: "Removed item: " + data.name,
    });
    emit("remove-member");
    model.value = false;
    let index = store.teamMembers.findIndex(
      (m) => m.officer_id === teamMember.value.officer_id
    );
    store.teamMembers.splice(index, 1);
  } catch (err) {
    $q.notify({
      icon: "error",
      color: "red",
      message: err.message,
    });
  }
}

function onCancel() {
  //productFormRef.value.reset()
  model.value = false;
  teamMember.value = {};
}

</script>
