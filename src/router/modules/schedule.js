import Layout from "@/layout";
export default [
  {
    path: "/schedule",
    name: "schedule",
    component: Layout,
    redirect: "/schedule/advproject",
    meta: { title: "排期", oldPath: "/resource/order/" },
    children: [
      {
        path: "advproject",
        component: () => import("@/views/home"),
        meta: { title: "执行单管理", oldPath: "/resource/order/" }
      },
      {
        path: "visibility",
        component: () => import("@/views/home"),
        meta: {
          title: "可见保障"
        }
      },
      {
        path: "bpList",
        component: () => import("@/views/flight/bpList"),
        meta: {
          title: "新建广告组"
        }
      }
    ]
  }
];
