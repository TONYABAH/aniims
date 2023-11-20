//import { ref, onMounted, computed, inject, provide, watch } from "vue";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { firestore } from "src/composables/firebase";

const db = firestore;
const MONTH_NAMES = [
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
const MONTH_ABBREV = [
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
export function getDaysInTheMonth(month, year) {
  switch (month) {
    case 2:
      if (!yeay) year = new Date().getFullYear();
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

export async function getDateData(date, month, year, collectionId) {
  const date1 = new Date(year, month, date, 0, 0, 0, 0);
  const date2 = new Date(year, month, date, 23, 59, 59, 999);
  const dbRef = collection(db, collectionId);
  let q = query(
    dbRef,
    //where("Level", "==", 3),
    where("meta.CreatedAt", ">=", date1),
    where("meta.CreatedAt", "<=", date2)
  );
  const snapshot = await getCountFromServer(q);
  return snapshot?.data()?.count || 0;
}
export async function getMonthData(month, year, collectionId) {
  const date1 = new Date(year, month, day, 0, 0, 0, 0);
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
  let q = query(
    dbRef,
    //where("Level", "==", 3),
    where("meta.CreatedAt", ">=", date1),
    where("meta.CreatedAt", "<=", date2)
  );
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
  let q = query(
    dbRef,
    //where("Level", "==", 3),
    where("meta.CreatedAt", ">=", date1),
    where("meta.CreatedAt", "<=", date2)
  );
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
    data.push([month, d]);
  }
  return data;
}
export async function getQuarterlyData(year, collectionId) {
  const data = [];
  for (let quarter = 1; quarter <= 4; quarter++) {
    let d = await getQuarterData(quarter, year, collectionId);
    data.push([quarter, d]);
  }
  return data;
}
export async function getYearlyData(startYear, endYear, collectionId) {
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    let d = await getYearData(year, collectionId);
    data.push([year, d]);
  }
  return data;
}
