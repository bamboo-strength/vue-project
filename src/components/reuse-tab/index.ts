import path from 'path';

const transformRoutesToReuseTab = (_item: any, basePath = '/', title?: any) => {
  return {
    code: title || _item.code,
    title: _item.title,
    path: path.resolve(basePath, _item.path),
    badge: 0,
    affix: _item.affix,
    reuse: _item.reuse
  }
}

const transformRoutes = ($route: any, routes: any) => {
  if (!routes || routes.length === 0) {
    return $route;
  }
  const _route = routes.find((item: any) => item.path === $route.fullPath || item.path === $route.path);
  return {
    code: $route.name || _route.code,
    meta: {
      title: $route?.meta?.title || _route.title,
      affix: $route?.meta?.affix || _route.affix,
      reuse: $route?.meta?.reuse || _route.reuse
    },
    path: $route.path,
    fullPath: $route.fullPath
  }
}

const transform$routeToReuseTab = (_route: any) => {
  return {
    code: _route?.name,
    title: _route?.meta?.title,
    path: _route?.fullPath,
    badge: 0,
    affix: _route?.meta?.affix,
    reuse: !!_route?.meta?.reuse
  }
}

export const utils = {
  transformRoutes,
  transformRoutesToReuseTab,
  transform$routeToReuseTab
}
