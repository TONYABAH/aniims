<template>
  <div class="row q-col-gutter-xs q-mb-xl q-pb-xl bg-">
    <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-5">
      <q-card
        flat
        class="my-card q-ma-sm q-pb-sm q-pr-sm bg-red"
        :class="
          $q.dark.isActive ? 'bg-grey-10 q-ma-xs' : 'bg-grey-1 text-grey-10'
        "
        style="opacity: 0.8; overflow: auto"
      >
        <q-item>
          <q-item-section>
            <q-input
              v-model="search"
              type="text"
              color="teal"
              placeholder="Search..."
              outlined=""
              autocapitalize="words"
              :debounce="400"
              class="q-mb-sm"
              input-class="q-pl-sm"
              @update:model-value="handleSearch(search)"
            >
              <template v-slot:append>
                <q-btn
                  color="teal"
                  icon="search"
                  glossy=""
                  :loading="loading"
                  @click="handleSearch(search)"
                >
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                  </template>
                </q-btn>
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-expansion-item
          expand-separator
          icon=""
          label="Results"
          caption=""
          default-opened=""
          dense
        >
          <q-list class="text-h6 q-pb-md q-pt-xs" style="border-radius: 4px">
            <q-item
              clickable
              v-ripple
              v-for="(item, i) of list"
              :key="item.uid"
              :v-bind="item"
              :to="
                '/app/admin/' + collection + '/#' + (item.uid || item.Abbrev)
              "
              :active-class="store.theme.bg.dark + ' text-white'"
              :active="active === i"
              style="font-size: medium"
              @click="_setModel(item, i)"
            >
              <q-item-section
                top
                thumbnail=""
                align="center"
                class="q-pl-md text-center"
              >
                {{ (i + 1).toString().padStart(3, "0") }}
              </q-item-section>
              <q-item-section
                ><q-item-label lines="2">
                  {{ item.Name || item.displayName || item.email
                  }}<span class="text-grey text-italic"
                    >&nbsp;{{ item.Location }}
                  </span>
                </q-item-label>
              </q-item-section>
              <!--<q-item-section avatar class="text-grey text-italic">
              {{ item.Location }}
            </q-item-section>-->
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-card>
    </div>
    <div class="col col-xs-12 col-sm-12 col-md-6 col-lg-7">
      <q-card
        class="my-card q-mt-sm q-mx-sm q-mb-xl full-height"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-grey-'"
        style="opacity: 0.8"
        ref="formCard"
      >
        <q-toolbar class="bg-deep-purple text-white">
          <q-toolbar-title>
            {{
              selected?.Name ||
              selected?.displayName ||
              selected?.email ||
              collection
            }}
          </q-toolbar-title>
          <q-btn flat icon="add" label="Add new" @click="onReset" />
        </q-toolbar>
        <q-card-section :class="$q.dark.isActive ? 'bg-blue-grey-10' : ''">
          <slot> </slot>
        </q-card-section>
        <q-card-actions class="bg-">
          <loading-button
            v-if="_selected.id || _selected.uid"
            :color="'red' || store.theme.color.default"
            :submit="onDelete"
            :loading="deletingAccount"
            flat
            icon="error"
            label="Delete"
          />
          <q-space />
          <loading-button
            v-if="_selected.id || _selected.uid"
            unelevated
            :color="store.theme.color.default"
            :submit="onSave"
            :loading="loading"
            rounded
            icon-right="arrow_right"
            icon=""
            label="Save"
          />
          <loading-button
            v-if="!_selected.id && onAdd"
            unelevated
            :color="store.theme.color.default"
            :submit="onAdd"
            :loading="loading"
            rounded
            icon-right="arrow_right"
            icon=""
            label="Create"
          />
          <q-btn
            unelevated
            icon="close"
            label="Reset"
            :color="store.theme.color.default"
            @click="onReset"
          />
          <q-space />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import LoadingButton from "src/components/LoadingButton.vue";
import { remove } from "src/composables/remote";
import { Notify, Dialog } from "quasar";

const store = useDefaultStore();
const search = ref("");
const deletingAccount = ref(false);
const formCard = ref(null);

const _selected = computed({
  get: () => props.selected || {},
  set: (val) => props.setModel(val),
});

const props = defineProps({
  title: String,
  iconName: String,
  setModel: Function,
  collection: String,
  selected: Object,
  list: Array,
  reset: Function,
  handleSearch: Function,
  loading: Boolean,
  onAdd: Function,
  onSave: Function,
});

//const itemList = computed(() => props.list);
const active = ref(0);
function _setModel(m, i) {
  active.value = i;
  _selected.value = m;
  //document.getElementById().scrollIntoView();
  formCard.value?.$el?.scrollIntoView(true, {
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
  //console.log(i);
}
async function onReset() {
  if (_selected.value?.Name !== "Users") props.reset();
  _selected.value = {};
  //store.loading = false;
}
async function onDelete() {
  Dialog.create({
    message: "Permanently delete item?",
    title: "Delete item",
    ok: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    deletingAccount.value = true;
    let id = _selected.value.uid || _selected.value.id;
    let collectionName =
      props.collection === "Staff" || props.collection === "IPOS"
        ? "Users"
        : props.collection;
    remove(id, collectionName)
      .then(() => {
        onReset();
        //let _id = _selected.value.uid || _selected.value.id;
        //let index = list.value.findIndex((item) => u.uid === user.value.uid);
        //users.value.splice(index, 1);
        props.handleSearch("");
        Notify.create({
          message: "Success",
          caption: "Delete item",
          color: "green",
          position: "center",
        });
      })
      .catch((e) => {
        Notify.create({
          message: e.message,
          caption: "Delete item",
          color: "red",
        });
      })
      .finally(() => (deletingAccount.value = false));
    //console.log(result);
  });
}
/*async function onDelete() {
  let id = _selected.value.uid || _selected.value.id;
  let collectionName =
    props.collection === "Staff" ? "Users" : props.collection;
  await remove(id, collectionName);
}*/
</script>
<style lang="scss" scoped>
.absolute {
  position: absolute;
}
</style>
