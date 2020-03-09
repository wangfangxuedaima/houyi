/**
 * 权限指令v-has ，用来判断用户是否有某个按钮的权限
 * 修饰符normal 用来对普通的按钮进行处理：
 *  v-has.normal="false"
 * 不带修饰符则是对权限控制按钮的处理，此时会进行权限判断
 *
 * 对于disable的权限，则可通过直接 fCheckHasPermission 调用
 * 已全局注入在Vue对象中
 *
 */
const permission = {
  name: "has",
  inserted(el, binding, vnode) {
    const b = vnode.context.fCheckHasPermission(binding.value);
    if (!b) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};
export default permission;
