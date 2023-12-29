import states from "../data/states.json";
import cities from "../data/cities.json";
import countries from "../data/countries.json";
import lgas from "../data/lga.json";
// import { ref, computed, watch } from "vue";

export const useStates = (country) => {
  return country === "Nigeria" ? states : [];
};
export const useLgas = (state) => {
  let found = lgas.find((s) => s.state === state);
  //return state ? lgas.find((lga) => lga.state === state).lgas : [];
  return found ? found.lgas : [];
};
export const useCities = (state) => {
  let found = cities.find((s) => s.name === state);
  return found ? found.cities : [];
};
export const useCountries = () => {
  return countries;
};
