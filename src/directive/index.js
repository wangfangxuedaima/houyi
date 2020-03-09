import ListGetter from "@/directive/ListGetter";
import Permission from "@/directive/permission";
import RelatedComponents from "@/directive/RelatedComponents";

const install = function(Vue, options) {
  Vue.directive(ListGetter.name, ListGetter);
  Vue.directive(RelatedComponents.name, RelatedComponents);
  Vue.directive(Permission.name, Permission);
};

export default { install };
