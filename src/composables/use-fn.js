//import { useDefaultStore } from "src/stores/store";
import { ref, computed } from "vue";
import { useCollection, useDocument } from "vuefire";
import { collection, query, where, or, and, orderBy } from "firebase/firestore";
import { firestore } from "src/composables/firebase";
import states from "../data/states.json";
import cities from "../data/cities.json";
import countries from "../data/countries.json";
import lgas from "../data/lga.json";
//const store = useDefaultStore();

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
  return countries.map((c) => c.name);
};

export const useGeolocation = () => {
  //var suspects = [];var staffList = [];var ipoList = [];
  const chartsScriptUrl =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyBISSc3EaCcch7wX9BxFdjtj6QMAe4xr6o";
  // Find script tag with same src in DOM.
  const foundScript = document.querySelector(
    'script[src="'.concat(chartsScriptUrl, '"]')
  );
  // Create or get existed tag.
  const script = foundScript || document.createElement("script");
  // Set src if no script was found.
  if (!foundScript) {
    script.src = chartsScriptUrl;
    script.type = "text/javascript";
    document.head.append(script);
  }
  return {
    async getLocation(address) {
      let geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address: address },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              //console.log(results[0]);
              const addr = results[0].formatted_address,
                lat = results[0].geometry.location.lat(),
                lng = results[0].geometry.location.lng(),
                comp = results[0].address_components;
              let country = comp.find((c) => c.types?.includes("country"));
              //if (country) country = country.long_name;
              const state = comp.find((c) =>
                c.types?.includes("administrative_area_level_1")
              );
              //if (state) location.value.State = state.long_name;
              const city = comp.find((c) =>
                c.types?.includes("administrative_area_level_2")
              );
              //if (city) {setTimeout(() => (location.value.City = city.long_name), 100);}
              resolve({ addr, lat, lng, comp, country, state, city });
            } else {
              console.log(
                "Geocode was not successful for the following reason: " + status
              );
              reject(status);
            }
          },
          1000
        );
      });
    },
  };
};
export function useDebounce(func, wait, immediate) {
  var timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const useStaffList = (options = {}) => {
  const whereClause = [where("Level", ">", 2)];
  if (options?.status) {
    whereClause.push(where("Status", "==", options.status));
  }
  if (options?.role) {
    whereClause.push(where("Role", "==", options.role));
  }
  if (options?.location) {
    whereClause.push(where("Location", "==", options.location));
  }
  if (options?.unit) {
    whereClause.push(where("Units", "array-contains", options.unit));
  }
  const staffQuery = computed(() =>
    query(collection(firestore, "Users"), ...whereClause)
  );
  return useCollection(staffQuery);
  //return staffList;
};

export const useIpoList = (options ={}) => {
  const whereClause = [where("Level", "==", 2)];
  if (options?.status) {
    whereClause.push(where("Status", "==", options.status));
  }
  if (options?.location) {
    whereClause.push(where("Location", "==", options.location));
  }
  if (options?.unit) {
    whereClause.push(where("Unit", "==", options.unit));
  }
  if (options?.role) {
    whereClause.push(where("Role", "==", options.role));
  }
  const ipoQuery = computed(() =>
    query(collection(firestore, "Users"), ...whereClause)
  );
  return useCollection(ipoQuery);
};

export const useSuspects = (CaseNumber) => {
  const whereClause = [];
  if (CaseNumber) {
    whereClause.push(where("Cases", "array-contains", CaseNumber));
  }
  const suspectQuery = computed(() =>
    query(collection(firestore, "Suspects"), ...whereClause)
  );
  return useCollection(suspectQuery);
};

export const useUnits = (options) => {
  const whereClause = [];
  if (options?.location) {
    whereClause.push(where("Location", "==", options.location));
  }
  const unitQuery = computed(() =>
    query(collection(firestore, "Units"), ...whereClause)
  );
  return useCollection(unitQuery);
};
export const useValidation = () => {
  return {
    isStaffNumber: (val) => {
      const pattern = /^(ss|SS|js|JS)[0-9]+$/;
      return pattern.test(val) || "Staff number not valid.";
    },
    isPhoneNumber: (val) => {
      const pattern = /^[0-9]+$/;
      return pattern.test(val) || "Phone number not valid";
    },
    isEmail: (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Email not valid";
    },
    required: (val) => {
      return (val && val.length > 0) || "Required field";
    },
  };
};
