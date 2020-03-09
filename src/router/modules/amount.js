import Layout from "@/layout";
export default [
  {
    path: "/amount",
    name: "amount",
    component: Layout,
    redirect: "/amount/list",
    meta: { title: "询量", oldPath: "/d/amount/list/" },
    children: [
      {
        path: "list",
        component: () => import("@/views/home"),
        meta: { title: "询量", oldPath: "/d/amount/list/" }
      },
      {
        path: "consume",
        component: () => import("@/views/home"),
        meta: { title: "消耗轨迹", oldPath: "/d/amount/list/consume/bplist" }
      },
      {
        path: "launchStrategy",
        component: () => import("@/views/home"),
        meta: { title: "投放策略", oldPath: "/d/amount/list/consume/launchStrategy" }
      }
    ]
  }
];
