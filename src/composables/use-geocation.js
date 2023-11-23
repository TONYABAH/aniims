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
              const Addr = results[0].formatted_address,
                Lat = results[0].geometry.location.lat(),
                Lng = results[0].geometry.location.lng(),
                Comp = results[0].address_components;
              resolve({ Addr, Lat, Lng, Comp });
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
