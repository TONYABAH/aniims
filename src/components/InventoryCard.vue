<template>
  <q-card flat class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : ''">
    <q-toolbar
      class="text-white q-pl-lg"
      :class="$q.dark.isActive ? 'bg-grey-9' : store.theme.bg.default"
    >
      <q-icon name="shopping_cart" color="" />
      <q-toolbar-title>Add Inventory of items</q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <q-table
        flat=""
        :rows="inventoryItems"
        :columns="columns"
        rows-per-page-options="0"
        hide-pagination
        title="Summary of Inventory"
        row-key="category"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="category" :props="props">
              {{ props.row.category }}
            </q-td>
            <q-td key="quantity" :props="props">
              {{ props.row.quantity }}
              <q-popup-edit
                v-model.number="props.row.quantity"
                auto-save
                v-slot="scope"
                class="bg-accent text-white"
              >
                <div class="text-italic text-white q-mb-xs">
                  Quantity in grams (1kg = 1000g)
                </div>
                <q-input
                  type="number"
                  dark
                  color="white"
                  v-model.number="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                >
                  <template v-slot:append>
                    <q-icon name="edit" />
                  </template>
                </q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="cost" :props="props">
              {{ props.row.cost }}
              <q-popup-edit
                v-model="props.row.cost"
                auto-save
                v-slot="scope"
                class="bg-accent text-white"
              >
                <div class="text-italic text-white q-mb-xs">
                  Current Market value
                </div>

                <q-input
                  dark
                  color="white"
                  type="number"
                  v-model.number="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                >
                  <template v-slot:append>
                    <q-icon name="edit" />
                  </template>
                </q-input>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions align="center" class="bg-">
      <q-space />
      <q-btn
        unelevated
        icon="arrow_left"
        label="Previous"
        :color="store.theme.color.normal"
        @click="previousTab"
      />
      <q-btn
        unelevated
        icon-right="arrow_right"
        label="Save & Continue"
        :color="store.theme.color.normal"
        :loading="loading"
        @click="saveInventory(inventoryItems)"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Saving...
        </template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script setup>
import { ref } from "vue";
import { useDefaultStore } from "src/stores/store";

const store = useDefaultStore();
const columns = [
  { name: "category", align: "left", label: "Category", field: "category" },
  {
    name: "quantity",
    align: "right",
    label: "Quantity (g)",
    field: "quantity",
  },
  { name: "cost", align: "right", label: "Cost (N)", field: "cost" },
];

const props = defineProps({
  nextTab: Function,
  previousTab: Function,
  saveInventory: Function,
  loading: Boolean,
  items: {
    type: Array,
    default: () => [
      { category: "Food", cost: 0, quantity: 0 },
      { category: "Beverage", cost: 0, quantity: 0 },
      { category: "Chemical", cost: 0, quantity: 0 },
      { category: "Cosmetics", cost: 0, quantity: 0 },
      { category: "Medical Devices", cost: 0, quantity: 0 },
      { category: "Drugs", cost: 0, quantity: 0 },
      { category: "Biologicals", cost: 0, quantity: 0 },
      { category: "Vaccine", cost: 0, quantity: 0 },
      { category: "Control Chemicals", cost: 0, quantity: 0 },
      { category: "Control Drugs", cost: 0, quantity: 0 },
    ],
  },
});
const inventoryItems = ref(props.items);
defineExpose({
  inventoryItems,
});
</script>
