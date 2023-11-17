import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";
import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  app.use(VueChartkick);
  // The app.use(VueChartkick) will make <VueChartkick> component available everywhere.
});
