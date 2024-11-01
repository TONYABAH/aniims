// src/boot/axios.js

import axios from "axios";
// import { getUserToken } from "src/composables/functions";
const api = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});
// api.defaults.withCredentials = true;
axios.defaults.withCredentials = true;
/*export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})*/

export { axios, api };
