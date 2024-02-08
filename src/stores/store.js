import { defineStore } from "pinia";

export const useDefaultStore = defineStore("default", {
  state: () => ({
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
    documents: [],
    query: null,
    refererUrl: "/",
    chatMode: true,
    currentCollection: "Mails",
    units: [],
    ipos: [],
    staffList: [],
    locations: ["Lagos", "Kaduna", "Asaba", "Abuja"],
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
    history: [],
    minutes: [],
    tabModel: "search",
    fn: {},
    settings: {
      themeColor: "purple",
      keepLogin: true,
    },
    //settingDialog: false,
  }),

  getters: {
    // doubleCount: (state) => state.counter * 2,
    theme: (state) => {
      const _themeColor = state.settings?.themeColor || "cyan";
      const color = {
        normal: _themeColor + "-9",
        light: _themeColor + "-8",
        dark: _themeColor + "-10",
        default: _themeColor,
        xxlight: _themeColor + "-3",
        xlight: _themeColor + "-5",
      };
      const bg = {
        normal: "bg-" + _themeColor + "-9",
        light: "bg-" + _themeColor + "-8",
        dark: "bg-" + _themeColor + "-10",
        default: "bg-" + _themeColor,
        xxlight: "bg-" + _themeColor + "-3",
        xlight: "bg-" + _themeColor + "-5",
      };
      return {
        color,
        bg,
      };
    },
  },

  actions: {
    /*setRaid(d) {
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
    },*/
  },
});
