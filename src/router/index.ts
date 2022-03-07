import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export const constantRoutes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/redirect',
    component: () => import('@/layout/layout.vue'),
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/api',
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        path: 'external',
        name: 'external',
        component: () => import(/* webpackChunkName: "external" */ '@/views/external/external.vue')
      }
    ]
  }
];

export const staticRoutes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/layout/layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: '首页', reuse: true, affix: true },
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue')
      }
    ]
  }
];
