import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/group",
    component: Layout,
    children: [
      {
        path: "group",
        name: "Group",
        component: () => import("@/views/group/index"),
        meta: { title: "团队数据", icon: "dashboard" },
      },
    ],
    hidden: true,
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/userlist",
    meta: { title: "用户管理", icon: "el-icon-s-custom" },
    children: [
      {
        path: "/userlist",
        name: "Userlist",
        component: () => import("@/views/user/user/index"),
        meta: { title: "用户管理", icon: "user" },
      },
    ],
  },
  {
    path: "/ProjectManagement",
    component: Layout,
    redirect: "/ProjectManagement",
    meta: { title: "项目管理", icon: "el-icon-s-tools" },
    children: [
      {
        path: "/myProject",
        name: "myProject",
        component: () => import("@/views/assets/myProject_check"),
        meta: { title: "我的项目", icon: "el-icon-s-check" },
      },
      {
        path: "/ProjectOrde",
        name: "Project_order",
        component: () => import("@/views/myProject/myProject_list"),
        meta: { title: "项目挂单", icon: "el-icon-data-analysis" },
      },
    ],
  },
  {
    path: "/wallet",
    component: Layout,
    redirect: "/wallet",
    meta: { title: "钱包管理", icon: "el-icon-s-finance" },
    children: [
      {
        path: "/wallet_list",
        name: "Wallet",
        component: () => import("@/views/wallet/wallet_list/index"),
        meta: { title: "钱包管理", icon: "el-icon-s-finance" },
      },
      {
        path: "/user_address",
        name: "userAddress",
        component: () => import("@/views/wallet/user_address/index"),
        meta: { title: "用户地址", icon: "el-icon-wallet" },
      },
    ],
  },
  {
    path: "/assets",
    component: Layout,
    redirect: "/recharge",
    meta: { title: "出入金统计", icon: "el-icon-s-order" },
    children: [
      {
        path: "/check",
        name: "Check",
        component: () => import("@/views/assets/withdrawal_check/index"),
        meta: { title: "提币审核", icon: "el-icon-upload2" },
      },
      {
        path: "/withdrawal",
        name: "Withdrawal",
        component: () => import("@/views/assets/withdrawal/index"),
        meta: { title: "提币明细", icon: "el-icon-printer" },
      },
      {
        path: "/charging",
        name: "charging",
        component: () => import("@/views/assets/withdrawal/charging"),
        meta: { title: "充币明细", icon: "el-icon-printer" },
      },
      {
        path: "/transfer",
        name: "Transfer",
        component: () => import("@/views/assets/transfer/index"),
        meta: { title: "划转记录", icon: "el-icon-aim" },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/systemslist",
    meta: {
      title: "系统设置",
      icon: "el-icon-setting",
    },
    children: [
      {
        path: "/notice",
        name: "Notice",
        component: () => import("@/views/system/notice/index"),
        meta: {
          title: "公告",
          icon: "el-icon-document-checked",
        },
      },
      {
        path: "/customerservice",
        name: "Customerservice",
        component: () => import("@/views/system/customerservice/index"),
        meta: {
          title: "客服咨询",
          icon: "el-icon-phone-outline",
        },
      },
    ],
  },

  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
