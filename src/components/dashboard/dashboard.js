//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import { useDefaultStore } from "src/stores/store";

const db = firestore;
const store = useDefaultStore();

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MONTH_ABBREV = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const isHOD = () =>
  store.user.claims.role === "Head Division" ||
  store.user.claims.role === "Head Location";
const isDirector = () => store.user.claims.role === "Director";
const isAdmin = () => store.user.claims.isAdmin;

export function getDaysInTheMonth(month, year) {
  switch (month) {
    case 2:
      if (!year) year = new Date().getFullYear();
      return year % 4 > 0 ? 28 : 29;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}
function filterQuery(filters) {
  if (isDirector || isAdmin) {
    // do not filter
  } else if (isHOD) {
    filters.push(
      where("meta.Unit", "==", store.user.claims.unit)
    );
  } else {
    filters.push(where("meta.CreatedBy", "==", store.user.uid));
  }
  return filters;
}
export async function getDateData(date, month, year, collectionId) {
  const date1 = new Date(year, month, date, 0, 0, 0, 0);
  const date2 = new Date(year, month, date, 23, 59, 59, 999);
  const dbRef = collection(db, collectionId);
  const filters = [
    where("meta.CreatedAt", ">=", Date.parse(date1)),
    where("meta.CreatedAt", "<=", Date.parse(date2)),
  ];
  filterQuery(filters);
  let q = query(dbRef, ...filters);
  const snapshot = await getCountFromServer(q);
  return snapshot?.data()?.count || 0;
}
export async function getMonthData(month, year, collectionId) {
  const date1 = new Date(year, month, 1, 0, 0, 0, 0);
  const date2 = new Date(
    year,
    month,
    getDaysInTheMonth(month, year),
    23,
    59,
    59,
    999
  );
  const dbRef = collection(db, collectionId);
  const filters = [
    where("meta.CreatedAt", ">=", Date.parse(date1)),
    where("meta.CreatedAt", "<=", Date.parse(date2)),
  ];
  filterQuery(filters);
  let q = query(dbRef, ...filters);

  const snapshot = await getCountFromServer(q);
  return snapshot?.data()?.count || 0;
}
export async function getQuarterData(quater, year, collectionId) {
  const data = [];
  const offset = quater * 3;
  const start = offset - 3;
  for (let month = start; month < offset; month++) {
    let d = await getMonthData(month, year, collectionId);
    data.push(d);
  }
  return data;
}
export async function getYearData(year, collectionId) {
  const date1 = new Date(year, 0, 1, 0, 0, 0, 0);
  const date2 = new Date(year, 11, 31, 23, 59, 59, 999);
  const dbRef = collection(db, collectionId);
  const filters = [
    where("meta.CreatedAt", ">=", Date.parse(date1)),
    where("meta.CreatedAt", "<=", Date.parse(date2)),
  ];
  filterQuery(filters);
  let q = query(dbRef, ...filters);
  const snapshot = await getCountFromServer(q);
  return snapshot?.data()?.count || 0;
}
export async function getDailyData(month, year, collectionId) {
  const daysInTheMonth = getDaysInTheMonth(month);
  const data = [];
  for (let date = 1; date <= daysInTheMonth; date++) {
    let d = await getDateData(date, month, year, collectionId);
    //let _date = new Date(year, month, date).toISOString;
    data.push([`${year}-${month}-${date}`, d]);
  }
  return data;
}
export async function getMonthlyData(year, collectionId) {
  const data = [];
  for (let month = 0; month < 12; month++) {
    let d = await getMonthData(month, year, collectionId);
    data.push([month + 1, d]);
  }
  return data;
}
export async function getQuarterlyData(year, collectionId) {
  const data = [];
  for (let quarter = 1; quarter <= 4; quarter++) {
    let d = await getQuarterData(quarter, year, collectionId);
    data.push([quarter, d]);
  }
  //console.log(data);
  return data;
}
export async function getYearlyData(startYear, endYear, collectionId) {
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    let d = await getYearData(year, collectionId);
    data.push([year, d]);
  }
  //console.log(data);
  return data;
}
