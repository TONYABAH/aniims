<template>
  <div class="row q-col-gutter-xs q-mb-xl q-pb-xl bg-">
    <div class="col col-xs-12 col-sm-6 col-md-5 col-lg-5">
      <q-card
        flat
        class="my-card q-ma-sm q-pb-sm q-pr-sm full-height"
        :class="
          $q.dark.isActive ? 'bg-grey-10 q-ma-xs' : 'bg-grey-1 text-grey-10'
        "
        style="opacity: 0.8; overflow: auto"
      >
        <q-list
          class="text-h6 q-pb-md q-pt-xs"
          style="border-radius: 4px"
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
                @update:model-value="handleSearch(search)"
                :debounce="400"
                class="q-mb-sm"
                input-class="q-pl-sm"
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
          <q-item
            clickable
            v-ripple
            v-for="(item, i) of list"
            :key="item.uid"
            :v-bind="item"
            :to="'/admin/' + collection + '/#' + (item.uid || item.Abbrev)"
            :active-class="store.theme.bg.dark + ' text-white'"
            :active="_selected.Name === item.Name"
            style="font-size: medium"
            @click="_setModel(item)"
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
      </q-card>
    </div>
    <div class="col col-xs-12 col-sm-6 col-md-7 col-lg-7">
      <q-card
        class="my-card q-mt-sm q-mr-md q-mb-xl full-height"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-grey-'"
        style="opacity: 0.8"
      >
        <q-card-section class="text-left bg-teal text-white">
          <div class="text-h6">
            {{
              selected?.Name ||
              selected?.displayName ||
              selected?.email ||
              collection
            }}
          </div>
        </q-card-section>
        <q-card-section :class="$q.dark.isActive ? 'bg-blue-grey-10' : ''">
          <slot> </slot>
        </q-card-section>
        <q-card-actions class="">
          <q-space />
          <loading-button
            v-if="_selected.id || _selected.uid"
            unelevated
            :color="store.theme.color.default"
            :submit="onSave"
            :loading="loading"
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
            icon-right="arrow_right"
            icon=""
            label="Create"
          />
          <q-btn flat icon="close" label="Cancel" @click="onReset" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDefaultStore } from "src/stores/store";
import LoadingButton from "src/components/LoadingButton.vue";
//import { createUser, addIPO, addCompany } from "src/composables/functions";
//import { addipo } from "app/altfunctions";

const store = useDefaultStore();
const search = ref("");

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

function _setModel(m) {
  _selected.value = m;
  //activeId.value=m.Name
}
async function onReset() {
  _selected.value = {};
  props.reset();
  //store.loading = false;
}
</script>
<style lang="scss" scoped>
.absolute {
  position: absolute;
}
</style>
