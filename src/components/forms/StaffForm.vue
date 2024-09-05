<template>
  <AdminViewer
    :set-model="setModel"
    :title="collection"
    :collection="collection"
    :search-fields="searchFields"
    :selected="staff"
    :list="userList"
    :reset="reset"
    :validate="validate"
    :handle-search="handleSearch"
    :on-add="create"
    :on-save="save"
    icon-name="perm_identity"
    :loading="loading"
  >
    <q-form class="q-pb-sm q-gutter-sm" ref="form">
      <q-select
        v-model="staff.Title"
        label="Title *"
        :options="TITLE_OPTIONS"
        options-dense=""
        outlined
        name="title"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <FiledUpdateButton
          field="Title"
          collection="Users"
          :id="staff.id"
          :value="staff.Title"
        />
      </q-select>
      <q-input
        v-model="staff.Name"
        label="Full name *"
        type="text"
        input-class="text-input"
        outlined
        name="name"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-btn
            :loading="loading"
            flat
            color="secondary"
            label="Update"
            @click="() => onFieldChanged('Name', 'staff.Name', 'Users')"
          />
          <q-icon name="person" />
        </template>
      </q-input>

      <q-input
        label="Phone *"
        outlined
        v-model="staff.Phone"
        type="text"
        name="phone"
        :rules="[validation.required, validation.isPhoneNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="phone" />
        </template>
      </q-input>

      <q-input
        label="Email *"
        outlined
        v-model="staff.Email"
        type="email"
        name="email"
        :rules="[validation.required, validation.isEmail]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="email" />
        </template>
      </q-input>

      <q-input
        label="Staff Number *"
        outlined
        v-model="StaffId"
        type="text"
        name="staffnumber"
        :rules="[validation.isStaffNumber]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="fingerprint"></q-icon>
        </template>
      </q-input>

      <q-input
        label="Rank *"
        outlined
        v-model="staff.Rank"
        type="text"
        name="rank"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onRankChanged"
            v-if="staff.id"
          ></q-btn>
        </template>
      </q-input>

      <q-select
        label="Role *"
        outlined
        v-model="staff.Role"
        :options="roleOptions"
        options-dense=""
        name="role"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-icon name="category" />
        </template>
      </q-select>

      <q-select
        label="Location *"
        v-model="staff.Location"
        options-dense=""
        :options="store.locations"
        outlined
        name="location"
        :rules="[validation.required]"
        lazy-rules="ondemand"
        hide-bottom-space=""
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onLocationChanged"
            v-if="staff.id"
          ></q-btn>
          <q-icon name="location_on" />
        </template>
      </q-select>
      <template v-if="staff.Role !== 'Director'">
        <q-select
          v-model="staff.Unit"
          :options="store.units"
          options-dense
          emit-value
          option-value="Abbrev"
          option-label="Abbrev"
          label="Unit"
          outlined=""
        >
          <template v-slot:append>
            <q-btn
              unelevated
              color="teal"
              label="Update"
              glossy
              @click.stop="onUnitChanged"
              v-if="staff.id"
            ></q-btn>
            <q-icon name="apartment" />
          </template>
        </q-select>
      </template>
      <q-select
        v-model="status"
        :options="STATUS_OPTIONS"
        options-dense=""
        label="Status"
        outlined
      >
        <template v-slot:append>
          <q-btn
            unelevated
            color="teal"
            label="Update"
            glossy
            @click.stop="onStatusChanged"
            v-if="staff.id"
          ></q-btn>
          <q-icon name="wifi" />
        </template>
      </q-select>
    </q-form>
  </AdminViewer>
</template>

<script setup>
import { Notify, Dialog, debounce } from "quasar";
import { computed, onMounted, ref, watch } from "vue";
import { useDefaultStore } from "src/stores/store";
import { createUser } from "src/composables/functions";
import { update, listStaff } from "src/composables/remote";
import { useValidation } from "src/composables/use-fn";
import AdminViewer from "src/views/AdminViewer.vue";
import { addSearch, sortByName } from "src/composables/searchProvider";
import FiledUpdateButton from "./FiledUpdateButton.vue";

const form = ref(null);
const store = useDefaultStore();
const validation = useValidation();
const loading = ref(false);

const roleOptions = [
  "Director",
  "Head Location",
  "Head Division",
  "Head Unit",
  "Regulatory",
  "Secretary",
  "Accountant",
  "Administrative",
  "Press",
  "Legal",
  "Maintenance",
  "Transport",
];
const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Pharm", "Prof"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const collection = "Staff";
const searchFields = ["Name", "Rank", "Email", "Location"];
const users = ref([]);
const model = ref({});

function setModel(s) {
  model.value = s;
}
//const active = ref(staff.value?.Active)
const staff = computed({
  get: () => model.value || {},
  set: (val) => {
    model.value = val;
  },
});

const userList = computed({
  get: () => users.value,
  set: (v) => {
    users.value = v;
  },
});
const StaffId = computed({
  get: () => staff.value?.StaffId?.toUpperCase(),
  set: (v) => (staff.value.StaffId = v.toUpperCase()),
});
const status = computed({
  get: () => staff.value.Status || "Active",
  set: (v) => (staff.value.Status = v),
});
const isAdmin = computed({
  get: () => staff.value.IsAdmin || undefined,
  set: (v) => (staff.value.IsAdmin = v),
});
async function onFieldChanged(field, value, collection) {
  if (!staff.value.id) return;
  loading.value = true;
  let obj = {};
  obj[field] = value;
  update(staff.value.id, obj, collection)
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Updated " + collection,
        caption: "Update " + collection,
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e);
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function onLocationChanged() {
  if (!ipo.value.id) return;
  loading.value = true;
  update(ipo.value.id, { Rank: staff.value.Location }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Rank updated",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function onRankChanged() {
  if (!staff.value.id) return;
  loading.value = true;
  update(staff.value.id, { Rank: staff.value.Rank }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Updated user",
        caption: "Update user",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e);
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function onUnitChanged() {
  if (!staff.value.id) return;
  loading.value = true;
  update(staff.value.id, { Unit: staff.value.Unit }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "Updated user",
        caption: "Update user",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      console.log(e);
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function onStatusChanged() {
  if (!staff.value.id) return;
  loading.value = true;
  update(staff.value.id, { Status: status.value }, "Users")
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "User status updated",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function save() {
  if (!staff.value.id) return;
  loading.value = true;
  update(
    staff.value.id,
    {
      Status: status.value,
      Rank: staff.value.Rank,
      Role: staff.value.Role,
      Heads: staff.value.Heads || [],
      Unit: staff.value.Unit || null,
      Location: staff.value.Location,
      Name: staff.value.Name,
      Title: staff.value.Title,
      //Admin: isAdmin.value,
      //CanEditPayment: staff.value.CanEditPayment || false,
      //CanConfirmPayment: staff.value.CanConfirmPayment || false,
      //CanReceiveMail: staff.value.CanReceiveMail || false,
    },
    "Users"
  )
    .then(() => {
      Notify.create({
        timeout: 800,
        message: "User status updated",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
async function create() {
  if (!(await validate())) return;
  loading.value = true;
  const _fields = ["Name", "StaffId", "Rank"].map((f) => staff.value[f]);
  const meta = {
    search: addSearch(_fields),
  };
  createUser({ ...staff.value, meta })
    .then((result) => {
      staff.value.id = result.data;
      handleSearch("");
      setModel({});
      Notify.create({
        timeout: 800,
        message: "Created successfully",
        caption: "Update",
        color: "secondary",
        textColor: "white",
        icon: "check",
        position: "right",
      });
    })
    .catch((e) => {
      Dialog.create({
        title: "Error",
        message: e.message,
        color: "red",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

function reset() {
  form.value?.resetValidation();
}
const validate = async () => await form.value?.validate(true);

const handleSearch = debounce((searchTerm, active) => {
  const whereFilters = [];
  //if (active) whereFilters.push(["Status", "==", "Active"]);
  const list = store.staffList;
  //listStaff(whereFilters).then((list) => {
  users.value = list
    .filter((s) => {
      //let pattern = `${s.Name}|| ${s.Rank} || ${s.Location} || ${s.Unit}`
      let d = searchTerm?.toLowerCase() || "";
      let searchTerms = d.split(" ");
      for (let x of searchTerms) {
        return (
          s.Name?.toLowerCase().indexOf(x) >= 0 ||
          s.Rank?.toLowerCase().indexOf(x) === 0 ||
          s.Location?.toLowerCase().indexOf(x) >= 0 ||
          s.Unit?.toLowerCase().indexOf(x) >= 0
        );
      }
    })
    .sort(sortByName);
}, 5);

/*const handleSearch = debounce(async (d, active) => {
  users.value = [];
  if (!d || d.length === 0) return;
  let searchTerms = d.split(" ");
  allUsers.value.filter((u) => {
    for (let x of searchTerms) {
      let m = u.Name.toLowerCase().search(x.toLowerCase());
      if (m > -1) {
        users.value.push(u);
        break;
      }
    }
  });
});

const dbRef = collection(firestore, collectionId);
const dataSource = query(dbRef, where("Status", "==", "Active"));
allUsers = useCollection(dataSource);*/

defineExpose({
  reset,
  validate,
});
onMounted(async () => {
  if (staff.value.Status === undefined) {
    staff.value.Status = "Active";
  }
  if (staff.value.IsAdmin === undefined) {
    staff.value.IsAdmin = false;
  }
});
</script>

<style scoped></style>
