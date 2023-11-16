import { defineStore } from "pinia";

export const useDefaultStore = defineStore("default", {
  state: () => ({
    query: null,
    refererUrl: "/",
    chatMode: true,
    currentCollection: "Mails",
    units: [],
    ipos: [],
    staffList: [],
    locations: ["Lagos", "Kaduna", "Asaba", "Abuja"],
    productCategories: [
      "Food",
      "Water",
      "Beverage",
      "Pharmaceuiticals",
      "Medical Device",
      "Chemical",
      "Cosmetics",
      "Other",
    ],
    destructionMetods: [
      "Burning",
      "Crushing",
      "Burrying",
      "Inceneration",
      "Other",
    ],
    assignDialogModel: false,
    documentDialogModel: false,
    fileViewerDialogModel: false,
    currentDocument: {},
    searchFilters: [],
    searchResults: [],
    currentStaff: {},
    search: {},
    user: {},
    unit: {},
    searchObject: {},
    isDark: true,
    /*raidModel: false,
    caseModel: false,
    productModel: false,
    complaintModel: false,
    teamDialogModel: false,
    productDialogModel: false,
    locationDialogModel: false,
    surveuillancewModel: false,*/
    history: [],
    minutes: [],
    tabModel: "form",
  }),

  getters: {
    // doubleCount: (state) => state.counter * 2,
  },

  actions: {
    setRaid(d) {
      this.raidData = d;
    },
    setSurveuillance(d) {
      this.surveillanceData = d;
    },
    setCase(d) {
      this.case = d;
    },
    setRaidModel(m) {
      this.raidModel = m;
    },
    setCaseModel(m) {
      this.caseModel = m;
    },
    setSurveuillancewModel(m) {
      this.surveuillancewModel = m;
    },
    setComplaintModel(m) {
      this.complaintModel = m;
    },
    setUser(u) {
      this.user = u;
    },
    /*
    async submit({ path, data },) {
      let res = null
      if (data.id) {
        res = await api.patch(path + "/" + data.id, data)
      } else {
        res = await api.post(path, data)
      }
      return data.id ? res.data.affectedRows : res.data.insertId
    },
    async remove({ path, data }) {
      return await api.delete(path + '/' + data.id || data)
    },
    async submitLocation() {
      const path = 'locations'
      let response = this.submit({
        path, data: this.location
      })
      if (!response) return
      if (this.location.id) {
        // this.location = data
      } else {
        //data.id = response
        this.location.id = response
        this.locations.push(this.location)
      }
    },
    async removeLocation() {
      const path = 'locations'
      let response = this.remove({
        path, data: this.location
      })
      if (!response) return
      let index = this.locations.findIndex((loc) => loc.id === this.location.id)
      this.locations.splice(index, 1)
      this.location = {}
    },
    async submitProduct() {
      const path = 'products'
      let response = this.submit({
        path, data: this.product
      })
      if (!response) return
      if (this.product.id) {
        // this.location = data
      } else {
        //data.id = response
        this.product.id = response
        this.products.push(this.product)
      }
    },
    async removeProduct() {
      const path = 'products'
      let response = this.remove({
        path, data: this.product
      })
      if (!response) return
      let index = this.products.findIndex((p) => p.id === this.product.id)
      this.products.splice(index, 1)
      this.product = {}
    }*/
  },
});
