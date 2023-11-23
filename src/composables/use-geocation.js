//import { computed, ref, watch } from "vue";

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
var _Geocoder = null;
script.onload = async () => {
  if (window.google !== undefined) {
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    _Geocoder = Geocoder;
  }
};

export const useGeolocation = () => {
  var geocoder = new _Geocoder();
  return {
    async getLocation(address) {
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
