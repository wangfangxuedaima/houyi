import "@/assets/css/index.scss";
import Directive from "@/directive";
import "@/filters";
import { PermissionMixins } from "@/mixins";
import store from "@/store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";

Vue.use(ElementUI);

Vue.use(Directive);

Vue.mixin(PermissionMixins);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App)
});
