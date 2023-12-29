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
        path: "investigations",
        name: "Investigations",
        component: () => import("../views/CaseView.vue"),
      },
      {
        path: "files",
        name: "File",
        component: () => import("../components/forms/FileForm.vue"),
      },
      {
        path: "complaints",
        name: "Complaints",
        component: () => import("../views/ComplaintView.vue"),
      },
      {
        path: "destructions",
        name: "Destructions",
        component: () => import("../views/DestructionView.vue"),
      },
      {
        path: "raids",
        name: "Raids",
        component: () => import("../views/RaidsView.vue"),
      },
      {
        path: "samples",
        name: "Sample",
        component: () => import("../views/SampleView.vue"),
      },
      {
        path: "payments",
        name: "Payment",
        component: () => import("../views/PaymentView.vue"),
      },
    ],
  },
  {
    path: "/applications",
    meta: { requiresAuth: true },
    name: "Applications",
    component: () => import("src/layouts/CompanyLayout.vue"),
    children: [
      {
        path: "destructions",
        meta: { requiresAuth: true },
        name: "Applications",
        component: () => import("src/pages/ApplicationHome.vue"),
      },
      {
        path: "petitions",
        meta: { requiresAuth: true },
        name: "Petitions",
        component: () => import("src/pages/PetitionHome.vue"),
      },
      {
        path: "destruction/:id(.*)",
        meta: { requiresAuth: true },
        name: "Application",
        component: () => import("src/views/ApplicationView.vue"),
      },
      {
        path: "petitions/:id(.*)",
        meta: { requiresAuth: true },
        name: "Petition",
        component: () => import("src/views/PetitionView.vue"),
      },
    ],
  },
  {
    path: "/petitions",
    meta: { requiresAuth: false },
    name: "CustomerComplaint",
    component: () => import("src/pages/PetitionPage.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    meta: { requiresAuth: true },
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
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
  {
    path: "/Cases",
    name: "Cases",
    meta: { requiresAuth: true },
    component: () => import("src/pages/CasePage.vue"),
  },
  /* {
    path: "/:document/search",
    component: () => import("src/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    name: "Search",
    children: [
      {
        path: "",
        component: () => import("src/components/forms/SearchForm.vue"),
        meta: { requiresAuth: true },
        name: "Search",
      },
    ],
  },
  {
    path: "/:document/dashboard",
    component: () => import("src/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    name: "Dashboard",
    children: [
      {
        path: "",
        component: () => import("src/components/dashboard/DashboardViewer.vue"),
        meta: { requiresAuth: true },
        name: "Dashboard",
      },
    ],
  },*/
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    meta: { requiresAuth: false },
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
