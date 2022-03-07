import Router from 'vue-router';

// 生成父级路由信息
const genParentRouter = (item: any) => {
  return {
    path: item.rootPath,
    component: () => import(`@/layout/${item.rootComponent}.vue`),
    children: []
  }
}

// 生成常规路由信息
const genStandardRouter = (item: any) => {
  return {
    path: item.skipPath,
    component: () => import(`@/views/${item.skipComponent}.vue`),
    name: item.componentName,
    meta: {
      title: item.title,
      hidden: !!Number(item.display),
      affix: false,
      reuse: true
    }
  }
}

// 生成子路由信息
const genChildRoute = (item: any) => {
  return genStandardRouter(item);
}

/** 创建路由 */
const createRouter = (constantRoutes: any, asyncRoutes: any) =>
  new Router({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 };
    },
    base: process.env.VUE_APP_BASE_URL,
    routes: [...constantRoutes, ...asyncRoutes]
  });

/** 重置路由 */
const resetRouter = (router: any, constantRoutes: any, asyncRoutes: any) => {
  const newRouter = createRouter(constantRoutes, asyncRoutes);
  (router as any).matcher = (newRouter as any).matcher;
};

export {
  genParentRouter,
  genChildRoute,
  createRouter,
  resetRouter
};
