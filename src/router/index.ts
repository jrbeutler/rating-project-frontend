import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Calculator from "../views/Calculator.vue";
import Login from "../components/Login/login.vue";
const routerHistory = createWebHistory();

//eslint-disable-next-line
const routes = <Array<any>>[
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/calculator",
    name: "Calculator",
    component: Calculator
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = createRouter({
  history: routerHistory,
  routes: routes
});

export default router;
