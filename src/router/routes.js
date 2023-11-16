//import CaseForm from "../pages/ComplaintApplication.vue";
//console.log(CaseForm);
const routes = [
  {
    path: "/",
    component: () => import("src/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    name: "Default",
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("../pages/MainLanding.vue"),
      },
      {
        path: "mails",
        name: "Mails",
        component: () => import("../components/forms/MailForm.vue"),
      },
      {
        path: "cases",
        name: "Cases",
        component: () => import("../components/forms/CaseForm.vue"),
      },
      {
        path: "files",
        name: "File",
        component: () => import("../components/forms/FileForm.vue"),
      },
      {
        path: "complaints",
        name: "Complaints",
        component: () => import("../components/forms/ComplaintForm.vue"),
      },
      {
        path: "raids",
        name: "Raids",
        component: () => import("../components/forms/RaidForm.vue"),
      },
      {
        path: "samples",
        name: "Sample",
        component: () => import("../components/forms/SampleForm.vue"),
      },
      {
        path: "payments",
        name: "Payment",
        component: () => import("../components/forms/PaymentForm.vue"),
      },
      {
        path: "destructions",
        name: "Destructions",
        component: () => import("../components/forms/DestructionForm.vue"),
      },
    ],
  },
  {
    path: "/applications",
    meta: { requiresAuth: true },
    name: "Applications",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        meta: { requiresAuth: true },
        name: "Applications",
        component: () => import("src/pages/ApplicationHome.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    meta: { requiresAuth: true },
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "AdminHome",
        component: () => import("../pages/AdminLanding.vue"),
      },
      {
        path: "ipo",
        name: "IPO",
        component: () => import("../components/forms/IpoForm.vue"),
      },
      {
        path: "unit",
        name: "Unit",
        component: () => import("../components/forms/UnitForm.vue"),
      },
      {
        path: "staff",
        name: "Staff",
        component: () => import("../components/forms/StaffForm.vue"),
      },
      {
        path: "user",
        name: "User",
        component: () => import("../components/forms/UserForm.vue"),
      },
    ],
  },
  {
    path: "/action",
    name: "Action",
    meta: { requiresAuth: false },
    component: () => import("src/pages/CodeAction.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: { requiresAuth: false },
    component: () => import("src/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: { requiresAuth: false },
    component: () => import("src/pages/RegisterUser.vue"),
  },
  {
    path: "/password_reset",
    name: "Password",
    meta: { requiresAuth: false },
    component: () => import("src/pages/PasswordReset.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    meta: { requiresAuth: false },
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
