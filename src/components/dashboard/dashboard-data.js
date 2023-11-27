import { ref } from "vue";
import * as dashboard from "./dashboard";
import { useDefaultStore } from "src/stores/store";
//import { ref } from "firebase/database";
const store = useDefaultStore();
export const lastQuarterData = ref([]);
export const lineChartData = ref([]);
export const barChartData = ref([]);
export const barChartData0 = ref([]);
export const YearData = ref([]);
export const interQuarterData = ref([]);

export const useDashboardData = async function () {
  let currentYear = new Date().getFullYear();
  let [year1, year2, year3] = [currentYear - 2, currentYear - 1, currentYear];

  dashboard.getMonthlyData(currentYear, store.currentCollection).then((d) => {
    let d1 = d.map((m) => [dashboard.MONTH_NAMES[m[0] - 1], m[1]]);

    YearData.value = d1;

    barChartData0.value = [
      {
        name: store.currentCollection,
        data: d,
      },
    ];
  });
  dashboard.getYearlyData(year1, year3, store.currentCollection).then((d2) => {
    lineChartData.value = [
      {
        name: store.currentCollection,
        data: d2,
      },
    ];

    barChartData.value = [
      {
        name: store.currentCollection,
        data: d2,
      },
    ];
  });
  dashboard
    .getQuarterlyData(currentYear, store.currentCollection)
    .then((d3) => {
      const last = d3[3][1].map((x, i) => {
        const offset = d3[3][0] * 3;
        const start = offset - 3;
        let dt = [dashboard.MONTH_NAMES[start + i], x];
        return dt;
      });
      lastQuarterData.value = last;

      let _3Q = [];
      d3.forEach((_d, j) => {
        let q = j + 1;
        let total = 0;
        d3[j][1].map((x, i) => {
          //const offset = d3[3][0] * 3;
          //const start = offset - 3;
          //let dt = [dashboard.MONTH_NAMES[start + i], x];
          total += x;
        });
        _3Q.push([q, total]);
      });
      interQuarterData.value = _3Q;
    });
  /*return {
    lastQuarterData,
    lineChartData,
    barChartData,
    barChartData0,
    YearData,
    interQuarterData,
  };*/
};
