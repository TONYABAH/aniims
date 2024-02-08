<template>
  <div align="center">
    <BaseForm
      title="Profile"
      banner-icon="person"
      banner-icon-right="star"
      :addBtn="false"
      :onSave="onSave"
      :onAdd="onAdd"
      :onReset="onReset"
      :saveBtn="selected.id ? true : false"
    >
      <StaffForm
        ref="formRef"
        :onStaffLoaded="onLoaded"
        :searchBtn="false"
        :profile="selected"
        :set-profile="setProfile"
        :read-only="true"
        v-if="store.user.email.indexOf('@nafdac.gov.ng') > 0"
      />
      <IpoForm
        ref="formRef"
        :onIpoLoaded="onLoaded"
        :searchBtn="false"
        :profile="selected"
        :set-profile="setProfile"
        :read-only="true"
        v-else
      />
    </BaseForm>
  </div>
</template>

<script setup>
import BaseForm from "src/components/BaseForm.vue";
import StaffForm from "src/components/StaffForm.vue";
import IpoForm from "src/components/IpoForm.vue";
import { useDefaultStore } from "src/stores/store";
import { ref } from "vue";

const store = useDefaultStore();
const formRef = ref(null);
//const selected = ref({});
const selected = ref({
  First: "Anthony",
  Last: "Abah",
  StaffId: "ss1056",
  Rank: "AD",
  Email: "abah.a@nafdac.gov.ng",
  Phone: "08051169979",
  Units: ["FTF", "LOD"],
  Role: "HOU",
  Status: "Active",
});
function setProfile(p) {
  selected.value = p;
}
function onLoaded(s) {
  selected.value = s;
}
async function onSave() {
  formRef.value.save();
}
async function onAdd(e) {
  formRef.value.add();
}
function onReset(e) {
  //formRef.value.reset();
  selected.value = {};
}
console.log(store.user);
</script>
