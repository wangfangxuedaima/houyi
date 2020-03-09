import Layout from "@/layout";
import Main from "@/layout/components/pageMain";

export default [
  {
    path: "/flight",
    name: "flight",
    component: Layout,
    redirect: "/flight/advproject",
    meta: { title: "投放", oldPath: "/p/advproject/list" },
    children: [
      {
        path: "advproject",
        component: Main,
        redirect: "/flight/advproject/list",
        meta: { title: "投放管理", oldPath: "/p/advproject/list" },
        children: [
          {
            path: "list",
            hidden: true,
            component: () => import("@/views/flight/advproject"),
            meta: { title: "投放管理", oldPath: "/p/advproject/list", noBread: true }
          },
          {
            path: "proconflict/:id",
            hidden: true,
            component: () => import("@/views/flight/flight-list"),
            meta: { title: "执行单冲突列表", oldPath: "/p/proconflict/list" }
          },
          {
            path: "viewflight",
            hidden: true,
            component: () => import("@/views/flight/viewflight"),
            meta: { title: "查看投放表", oldPath: "/p/viewflight/view" }
          },
          {
            path: "flightdetail/:id",
            hidden: true,
            component: () => import("@/views/flight/flightdetail"),
            meta: { title: "查看排期", oldPath: "d/viewflight/queryBooks" }
          },
          {
            path: "viewBooks",
            hidden: true,
            component: () => import("@/views/flight/flight-list"),
            meta: { title: "查看排期", oldPath: "" }
          },
          {
            path: "adgroup",
            hidden: true,
            component: Main,
            redirect: "/flight/advproject/adgroup/list",
            meta: { title: "广告组列表", oldPath: "/p/adgroup/list" },
            children: [
              {
                path: "list",
                hidden: true,
                component: () => import("@/views/flight/adgroup/index"),
                meta: { title: "广告组列表", oldPath: "/p/adgroup/bpList", noBread: true }
              },
              {
                path: "bplist",
                hidden: true,
                component: () => import("@/views/flight/bpList"),
                meta: { title: "新建广告组", oldPath: "/p/adgroup/bpList" }
              },
              {
                path: "adedit",
                hidden: true,
                component: () => import("@/views/flight/adedit/index"),
                meta: { title: "编辑广告", oldPath: "/p/ad/edit" }
              }
            ]
          }
        ]
      },
      {
        path: "project-finished-rate",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "执行单完成率", oldPath: "/p/advproject/toProjectFinishedRatelist" }
      },
      {
        path: "ies-admaster",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "IESAdmaster", oldPath: "/p/viewflight/toIesAdMasterPage" }
      },
      {
        path: "monitorcode",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "监测代码助手", oldPath: "/p/monitorcode/toList" }
      },
      {
        path: "viewflight",
        redirect: "/flight/advproject/viewflight",
        meta: { title: "查看投放表", oldPath: "/p/viewflight/view" }
      },
      {
        path: "material",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "物料管理", oldPath: "/p/material/list" }
      },
      {
        path: "bandpoint",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "中插广告打点", oldPath: "/p/madpoint/list" }
      },
      {
        path: "madpoint",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "创可贴广告打点", oldPath: "/p/bandpoint/list" }
      },
      {
        path: "toAbnormal",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "异常流量", oldPath: "/p/viewflight/toAbnormal" }
      },
      {
        path: "regioncode",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "地域编码查询", oldPath: "/p/regioncode/tolist" }
      },
      {
        path: "blacklist",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "黑名单管理", oldPath: "/p/blacklist/list" }
      },
      {
        path: "bpmendmonitor",
        component: () => import("@/views/flight/flight-list"),
        meta: { title: "地域内容监控", oldPath: "/p/viewflight/bpmendmonitor" }
      }
    ]
  }
];
