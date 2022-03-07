import { common } from '@/api';
import { constantRoutes, staticRoutes } from '@/router';
import { RoutesModule } from '@/store/modules/routes';
import { RouteConfig } from 'vue-router';
import { assembleRoutes, createRouter, assembleStaticRoutes, assembleAsyncRoutes } from './routes';
import { message } from 'ant-design-vue';

class Startup {
  /** 配置初始化信息 */
  public static async bootstrap() {
    try {
      this.convertStaticRoutes();
      // const asyncRoutes: any = await this.getAsyncRouters();
      const router = createRouter(constantRoutes, [...staticRoutes]);
      return Promise.resolve({ router: router });
    } catch (error) {
      message.error('系统异常,  请联系管理员');
    }
  }

  /**
   * 获取动态菜单信息, 配置菜单、动态路由
   * @returns
   */
  private static async getAsyncRouters() {
    try {
      const selectedSystem = JSON.parse(window.sessionStorage.getItem('selectedSystem')!);
      if (!selectedSystem && !(window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')) {
        location.href = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/portal/';
      }
      const data = {
        // menuId: selectedSystem.sysytemId
      }
      // 获取菜单信息
      const params: any = await common.getAsyncMenu(data);
      // 组装路由信息
      const asyncRoutes: RouteConfig[] = assembleRoutes(params);

      // 动态路由转换为菜单格式
      const asyncAssembleRoutes = assembleAsyncRoutes(params);
      // 存储菜单结构
      RoutesModule.SetRoutes(asyncAssembleRoutes);
      return Promise.resolve(asyncRoutes);
    } catch (error) {
      return Promise.reject(error || new Error('error'));
    }
  }

  /** 转换路由格式 */
  private static convertStaticRoutes() {
    if (staticRoutes.length === 0) return;

    const staticAssembleRoutes = assembleStaticRoutes(staticRoutes);

    RoutesModule.SetRoutes(staticAssembleRoutes);
  }
}

export default Startup;
