import Layout from "@/layout";
export default [
  {
    path: "/system",
    name: "system",
    component: Layout,
    redirect: "/system/user",
    meta: { title: "系统", oldPath: "/system/user/" },
    children: [
      {
        path: "user",
        component: () => import("@/views/home"),
        meta: { title: "用户", oldPath: "/system/user/" }
      },
      {
        path: "role",
        component: () => import("@/views/home"),
        meta: { title: "角色管理", oldPath: "/system/role" }
      },
      {
        path: "module",
        component: () => import("@/views/home"),
        meta: { title: "模块管理", oldPath: "/system/module/" }
      },
      {
        path: "timerule",
        component: () => import("@/views/home"),
        meta: { title: "贴片广告管理", oldPath: "/p/timerule/" }
      },
      {
        path: "bartemplate",
        component: () => import("@/views/home"),
        meta: { title: "广告条模板", oldPath: "/p/bartemplate/list" }
      },
      {
        path: "thesaurus",
        component: () => import("@/views/home"),
        meta: { title: "词包管理", oldPath: "/p/thesaurus/list" }
      },
      {
        path: "godtemplate",
        component: () => import("@/views/home"),
        meta: { title: "广告模板维护", oldPath: "/p/godtemplate/toList" }
      },
      {
        path: "basedata",
        component: () => import("@/views/home"),
        meta: { title: "数据字典", oldPath: "/system/basedata/" }
      },
      {
        path: "user-log",
        component: () => import("@/views/home"),
        meta: { title: "系统管理", oldPath: "/user-log/list" }
      }
    ]
  }
];
