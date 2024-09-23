import { route } from "quasar/wrappers";
import { useDefaultStore } from "src/stores/store.js";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import routes from "./routes";
//import { getAuth } from "firebase/auth";
import { auth } from "src/composables/firebase";
//import { Notify } from "quasar";

//const auth = getAuth();
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from) => {
    const store = useDefaultStore();
    //console.log(store.user);
    // instead of having to check every route record with
    // to.matched.some(record => record.meta.requiresAuth)
    if (to.meta.requiresAuth) {
      if (!auth?.currentUser?.uid) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        return {
          path: "/app/login",
          // save the location we were at to come back later
          query: { redirect: to.fullPath },
        };
      } else if (to.path.match(/\/admin/i) && !store.user?.claims?.admin) {
        throw { message: "Admin right required" };
      } else {
        return true;
      }
    }
  });

  /*Router.beforeEach(async (to, from) => {
    //const store = useDefaultStore();
    //console.log(isAuthenticated());
    if (
      // make sure the user is authenticated
      !isAuthenticated() &&
      //Avoid an infinite redirect❗️
      to.name !== "Login" &&
      to.name !== "Register" &&
      to.name !== "SignUp" &&
      to.name !== "Action"
    ) {
      //store.refererUrl = from.path || "/";
      //return { name: "Login" };
      return {
        path: "/login",
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      };
    }
  });*/
  return Router;
});
