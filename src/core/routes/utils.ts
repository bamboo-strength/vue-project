import { IframesModule } from '@/store/modules/iframes';
import qs from 'qs';
import { RouteConfig } from 'vue-router';
import { genParentRouter, genChildRoute } from './route';

/**
 * 生成路由信息并生成iframes信息
 * @param {*} routeParameters 路由参数
 * @param {*} asyncRoutes generate routers
 * @returns asyncRoutes
 */
const assembleRoutes = (routeParameters: any[], asyncRoutes: any[] = []) => {
  for (let i = 0; i < routeParameters.length; i++) {
    // 判断是否存在子菜单
    if (routeParameters[i].children && routeParameters[i].children.length > 0) {
      asyncRoutes = assembleRoutes(routeParameters[i].children, asyncRoutes);
      continue;
    }
    // 判断是否是外部链接地址
    if (routeParameters[i].outsideLink === '1') {
      createIframe(routeParameters[i]);
      continue;
    }
    // 判断地址是否有效
    if (routeParameters[i].rootPath === null && routeParameters[i].skipPath === null) continue;
    asyncRoutes = combineRoutes(routeParameters[i], asyncRoutes);
  }
  return asyncRoutes;
}

/**
 * 合并路由信息
 * @param routeParameter
 * @param asyncRoutes
 * @returns
 */
const combineRoutes = (routeParameter: any, asyncRoutes: any[] = []) => {
  const index = asyncRoutes.findIndex(_item => _item.path === routeParameter.rootPath);
  const childrenRouter: RouteConfig = genChildRoute(routeParameter);
  if (index < 0) {
    const parentRoute: RouteConfig = genParentRouter(routeParameter);
    parentRoute.children!.push(childrenRouter);
    asyncRoutes.push(parentRoute);
    return asyncRoutes;
  }
  asyncRoutes[index].children.push(childrenRouter);
  return asyncRoutes;
}

/**
 * generate iframes box
 * @param routeParameter
 */
const createIframe = (routeParameter: any) => {
  // 切割 URL
  const skipPath = routeParameter.skipPath.split('?');
  const parameters: any = qs.parse(skipPath[1]);
  const url = parameters.url.indexOf('http') === -1 ? location.protocol + '//' + parameters.url : parameters.url;
  const params = {
    [parameters.code.toUpperCase()]: {
      src: url,
      key: parameters.code,
      type: parameters.type,
      reuse: parameters.reuse || true,
      title: routeParameter.title
    }
  }
  IframesModule.next(params);
}

// 静态路由转换为菜单格式
const assembleStaticRoutes = (routes: any, rootPath: any = null, breadCrumb: any[] = []) => {
  let staticRoutes: any[] = [];
  for (let i = 0; i < routes.length; i++) {
    const _route: any = new Object();

    if (!routes[i].children || routes[i].children === 0) {
      if (!routes[i].meta || routes[i].meta.hidden) continue;

      Object.assign(_route, generateRoute(routes[i], convertPath(rootPath, routes[i].path), [...breadCrumb, routes[i].meta?.title]));

      staticRoutes.push(_route);
      continue;
    }

    if (routes[i].meta && routes[i].meta.hidden) continue;

    if (routes[i].meta && !routes[i].meta.hidden) {
      Object.assign(_route, generateRoute(routes[i]));
      _route.children = assembleStaticRoutes(routes[i].children, routes[i].path, [...breadCrumb, routes[i].meta.title]);
      staticRoutes.push(_route);
      continue;
    }

    staticRoutes = [
      ...staticRoutes,
      ...assembleStaticRoutes(routes[i].children, routes[i].path)
    ];
  }

  return staticRoutes;
}

// 动态路由转换为菜单格式
const assembleAsyncRoutes = (routes: any[], asyncRoutes: any[] = [], breadCrumb: string = '') => {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].children && routes[i].children.length > 0) {
      asyncRoutes.push(genRoutes(routes[i], true));
      asyncRoutes[i].children = assembleAsyncRoutes(routes[i].children, [], routes[i].title);
      continue;
    }

    if (routes[i].rootPath !== null && routes[i].skipPath !== null) {
      routes[i].path = routes[i].rootPath + '/' + routes[i].skipPath;
    }
    routes[i].breadCrumb = [breadCrumb, routes[i].title].filter((item: any) => item);
    if (routes[i].outsideLink === '1') {
      const skipPath = routes[i].skipPath.split('?');
      const parameters = qs.parse(skipPath[1]);
      routes[i].path = routes[i].rootPath + '/' + skipPath[0] + '?code=' + parameters.code;
    }

    asyncRoutes.push(genRoutes(routes[i]));
  }

  return asyncRoutes;
}

// 生成路由信息
const genRoutes = (_route: any, isParent: Boolean = false) => {
  return {
    key: _route.key,
    title: _route.title,
    code: _route.componentName,
    path: isParent ? '' : _route.path,
    icon: _route.icon,
    breadCrumb: isParent ? [] : _route.breadCrumb,
    children: [],
    ...(isParent ? {} : {
      affix: false,
      reuse: true
    })
  }
}

/** 生成路由信息 */
const generateRoute = (_route: any, path: any = '', breadCrumb: any[] = []) => {
  return {
    key: generateRecordId(),
    title: _route.meta?.title,
    code: _route.name,
    icon: _route.meta?.icon,
    path: path,
    affix: _route.meta?.affix,
    reuse: _route.meta?.reuse,
    breadCrumb: breadCrumb,
    children: []
  };
}

/** 生成唯一主键 */
const generateRecordId = () => {
  return Math.random().toString(16).substr(1);
}

/** 拼接 path */
const convertPath = (rootPath: any, path: any) => {
  if (rootPath === null || rootPath === '/') {
    return formatPath(path);
  }

  return rootPath + formatPath(path);
}

/** 格式化 path */
const formatPath = (path: any) => {
  if (!path || path.startsWith('/')) {
    return path;
  }
  return '/' + path;
}

export {
  assembleRoutes,
  assembleStaticRoutes,
  assembleAsyncRoutes
};
