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
        path: "applications",
        name: "Applications",
        component: () => import("../views/ApplicationView.vue"),
      },
      {
        path: "raids",
        name: "Raids",
        component: () => import("../views/RaidsView.vue"),
      },
      {
        path: "samples",
        name: "Samples",
        component: () => import("../views/SampleView.vue"),
      },
      {
        path: "payments",
        name: "Payments",
        component: () => import("../views/PaymentView.vue"),
      },
      {
        path: "investigations",
        name: "Investigations",
        component: () => import("../views/CaseView.vue"),
      },
      {
        path: "investigations/:id/suspects",
        name: "InvestigativeSuspects",
        component: () => import("../views/SuspectView.vue"),
      },
      {
        path: "investigations/:id/raids",
        name: "InvestigativeRaids",
        component: () => import("../views/RaidsView.vue"),
      },
      {
        path: "investigations/:id/samples",
        name: "InvestigativeSamples",
        component: () => import("../views/SampleView.vue"),
      },
      {
        path: "investigations/:id/payments",
        name: "InvestigativePayments",
        component: () => import("../views/PaymentView.vue"),
      },
      {
        path: "investigations/:id/reports",
        name: "InvestigativeReports",
        component: () => import("../views/ReportsView.vue"),
      },
    ],
  },
  {
    path: "/my_destruction",
    meta: { requiresAuth: false },
    name: "CustomerApplication",
    component: () => import("src/pages/ApplicationPage.vue"),
  },
  {
    path: "/my_petition",
    meta: { requiresAuth: false },
    name: "CustomerComplaint",
    component: () => import("src/pages/PetitionPage.vue"),
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
    path: "/cases",
    name: "Cases",
    meta: { requiresAuth: true },
    component: () => import("src/pages/CasePage.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    meta: { requiresAuth: true },
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "ipos",
        name: "IPO",
        component: () => import("../components/forms/IpoForm.vue"),
      },
      {
        path: "units",
        name: "Unit",
        component: () => import("../components/forms/UnitForm.vue"),
      },
      {
        path: "staff",
        name: "Staff",
        component: () => import("../components/forms/StaffForm.vue"),
      },
      {
        path: "users",
        name: "User",
        component: () => import("../components/forms/UserForm.vue"),
      },
    ],
  },
  /*{
    path: "/my_applications",
    meta: { requiresAuth: true },
    name: "MyApplications",
    component: () => import("src/layouts/CompanyLayout.vue"),
    children: [
      {
        path: "",
        name: "ApplicationHome",
        component: () => import("../pages/ApplicationHome.vue"),
      },
      {
        path: "destruction",
        meta: { requiresAuth: true },
        name: "MyDestructionApplications",
        component: () => import("src/pages/ApplicationHome.vue"),
      },
      {
        path: "petition",
        meta: { requiresAuth: true },
        name: "MyPetitionApplications",
        component: () => import("src/pages/PetitionHome.vue"),
      },
      {
        path: "destruction/:id(.*)",
        meta: { requiresAuth: true },
        name: "MyDestructionApplication",
        component: () => import("src/views/ApplicationView.vue"),
      },
      {
        path: "petition/:id(.*)",
        meta: { requiresAuth: true },
        name: "MyPetitionApplication",
        component: () => import("src/views/PetitionView.vue"),
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
