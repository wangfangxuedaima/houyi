import Layout from "@/layout";
export default [
  {
    path: "/resource",
    name: "resource",
    component: Layout,
    redirect: "/resource/adposition",
    meta: { title: "资源", oldPath: "/resource/adposition/" },
    children: [
      {
        path: "adposition",
        component: () => import("@/views/home"),
        meta: { title: "广告位", oldPath: "/resource/adposition/" }
      },
      {
        path: "adstyle",
        component: () => import("@/views/home"),
        meta: { title: "广告形式", oldPath: "/resource/adstyle/" }
      },
      {
        path: "price-system",
        component: () => import("@/views/home"),
        meta: { title: "价格体系", oldPath: "/resource/price-system/" }
      },
      {
        path: "creative-template",
        component: () => import("@/views/home"),
        meta: { title: "创意模版", oldPath: "/resource/creative-template/" }
      },
      {
        path: "sale-resource",
        component: () => import("@/views/home"),
        meta: { title: "销售资源", oldPath: "/resource/sale-resource/" }
      },
      {
        path: "vrs-channel",
        component: () => import("@/views/home"),
        meta: { title: "视频资源", oldPath: "/resource/vrs-channel/" }
      },
      {
        path: "cms-channel",
        component: () => import("@/views/home"),
        meta: { title: "页面资源", oldPath: "/resource/cms-channel/" }
      },
      {
        path: "cpd",
        component: () => import("@/views/home"),
        meta: { title: "CPD资源", oldPath: "/p/saleRes/cpd" }
      },
      {
        path: "spec",
        component: () => import("@/views/home"),
        meta: { title: "规格管理", oldPath: "/p/spec/list" }
      },
      {
        path: "advprice",
        component: () => import("@/views/home"),
        meta: { title: "刊例管理", oldPath: "/p/advprice/toList" }
      },
      {
        path: "saleChannel",
        component: () => import("@/views/home"),
        meta: { title: "销售栏目", oldPath: "/p/saleChannel/toList" }
      },
      {
        path: "channel",
        component: () => import("@/views/home"),
        meta: { title: "频道栏目管理", oldPath: "/p/channel/toList" }
      },
      {
        path: "saleRes",
        component: () => import("@/views/home"),
        meta: { title: "销售资源管理", oldPath: "/p/saleRes/tolist" }
      },
      {
        path: "adposition",
        component: () => import("@/views/home"),
        meta: { title: "页面广告管理", oldPath: "/p/adposition/toList" }
      },
      {
        path: "channel-toListNew",
        component: () => import("@/views/home"),
        meta: { title: "新频道栏目", oldPath: "/p/channel/toListNew" }
      },
      {
        path: "dmptag",
        component: () => import("@/views/home"),
        meta: { title: "DMP标签", oldPath: "/p/dmptag/toList" }
      },
      {
        path: "anticheatrule",
        component: () => import("@/views/home"),
        meta: { title: "反作弊规则", oldPath: "/p/anticheatrule/toList" }
      }
    ]
  }
];
