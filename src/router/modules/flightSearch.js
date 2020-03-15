import Layout from "@/layout/index";

export default [
  {
    path: "/flight-search",
    component: Layout,
    redirect: "/flight-search/info",
    name: "flight-search",
    alwaysShow: true,
    meta: {
      title: "供应商查询",
      icon: "el-icon-search"
    },
    children: [
      {
        path: "adcode",
        name: "adcode-info",
        component: () => import("@/views/flightSearch/adcode"),
        meta: {
          title: "查询",
          activeMenu: "adcode-info",
          icon: "el-icon-search"
        }
      }
      // {
      //   path: "adplus",
      //   name: "adcode-adplus",
      //   component: () => import("@/views/flightSearch/adplus"),
      //   meta: {
      //     title: "实时数据查询",
      //     activeMenu: "adcode-adplus",
      //     icon: "el-icon-s-promotion"
      //   }
      // }
    ]
  }
];
