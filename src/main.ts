import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "lib-flexible/flexible.js";

createApp(App)
  .use(router)
  .mount("#app");
