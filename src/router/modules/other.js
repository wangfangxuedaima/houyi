import Layout from "@/layout";
export default [
  {
    path: "/tools",
    name: "tools",
    component: Layout,
    redirect: "/tools/appscreenshot",
    hidden: true,
    meta: {
      title: "tools"
    },
    children: [
      {
        path: "/appscreenshot",
        name: "appscreenshot",
        component: () => import("@/views/home"),
        hidden: true,
        meta: {
          title: "移动截屏"
        }
      },
      {
        path: "/bookpkgcompare",
        name: "bookpkgcompare",
        component: () => import("@/views/home"),
        hidden: true,
        meta: {
          title: "排期包对比"
        }
      }
    ]
  }
];
