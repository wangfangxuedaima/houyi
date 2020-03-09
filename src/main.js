import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import Directive from "@/directive";
import { PermissionMixins } from "@/mixins";
import "@/assets/css/element-variables.scss";
import "@/assets/css/index.scss";
import "@/filters";

Vue.use(ElementUI);
Vue.use(Directive);
Vue.mixin(PermissionMixins);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
