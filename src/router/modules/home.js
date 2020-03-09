import Layout from "@/layout";
export default [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/home",
    meta: { title: "首页", oldPath: "/index.jsp" },
    children: [
      {
        path: "home",
        hidden: true,
        component: () => import("@/views/home"),
        meta: { title: "首页详情", oldPath: "/index.jsp", noBread: true }
      }
    ]
  }
];
