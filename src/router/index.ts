import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Calculator from "../views/Calculator.vue";
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
  }
];

const router = createRouter({
  history: routerHistory,
  routes: routes
});

export default router;
