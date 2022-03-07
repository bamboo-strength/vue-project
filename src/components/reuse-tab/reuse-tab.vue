<template src="./reuse-tab.html"></template>

<script lang="ts">
import { IframesModule } from '@/store/modules/iframes';
import { ReuseTabModule } from '@/store/modules/reuse-tab';
import { RoutesModule } from '@/store/modules/routes';
import qs from 'qs';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { utils } from './index';

@Component({})
export default class ReuseTab extends Vue {
  // 弹出框状态
  visible: boolean = false;

  // 右键菜单信息绝对距离顶部高度
  top: number = 0;

  // 右键菜单信息绝对距离左侧宽度
  left: number = 0;

  // 当前选择的标签信息
  selectedTag: any = {};

  // 固定标签信息
  affixTags: any[] = [];

  // 获取当前可展示的菜单信息
  get visitedViews() {
    return ReuseTabModule.visitedViews;
  }

  get routes() {
    return RoutesModule.routes;
  }

  @Watch('visible')
  onVisibleChange(visible: boolean) {
    if (visible) {
      document.body.addEventListener('click', this.closeMenu);
    } else {
      document.body.removeEventListener('click', this.closeMenu);
    }
  }

  @Watch('$route')
  onRouteChange() {
    this.insertViews();
    this.moveToCurrentTag();
  }

  mounted() {
    this.initReuseTab();
    this.insertViews();
  }

  // 查看当前路由激活情况
  isActive(route: any) {
    return route.path === this.$route.path;
  }

  // 查看当前路由是否固定
  isAffix(tag: any) {
    return tag && tag.affix;
  }

  // 判断菜单是否需要隐藏, 如果不隐藏则添加菜单缓存
  insertViews() {
    if (this.$route.path === '/msun/external') {
      const router: any = this.getExternal(this.$route.fullPath, 'External');
      document.title = router.title;
      ReuseTabModule.addView(router);
      return;
    }

    if (!this.$route.name || !this.$route.meta || Object.keys(this.$route.meta).length === 0 || this.$route.meta.hidden) return;

    ReuseTabModule.addView(utils.transform$routeToReuseTab(utils.transformRoutes(this.$route, this.routes)));
  }

  // 过滤固定标签
  filterAffixTags(routes: any[], basePath = '/'): any[] {
    let tags: any[] = [];
    for (const _ of routes) {
      if (_.affix) tags.push(utils.transformRoutesToReuseTab(_, basePath));

      if (!_.children || _.children.length === 0) continue;

      const tempTags = this.filterAffixTags(_.children, _.path);

      if (tempTags.length > 0) tags = [...tags, ...tempTags]
    }
    return tags;
  }

  // 初始化 将固定标签添加到待显示标签栏内
  initReuseTab() {
    const affixTags = this.affixTags = this.filterAffixTags(this.routes);
    for (const tag of affixTags) {
      if (tag.title) ReuseTabModule.addVisitedView(tag);
    }
  }

  // 特殊地址匹配
  getExternal(path: any, title: any = null) {
    const routers = this.routes;
    const getPatchRouter = (_routes: any) => {
      let patchRouter: any = new Object();
      for (let i = 0; i < _routes.length; i++) {
        if (_routes[i].path === path) {
          patchRouter = _routes[i];
          break;
        }

        if (_routes[i].children && _routes[i].children.length > 0) {
          patchRouter = getPatchRouter(_routes[i].children);

          if (Object.keys(patchRouter).length > 0) break;
        }
      }
      return patchRouter;
    }

    const patchRouter = getPatchRouter(routers);

    if (Object.keys(patchRouter).length === 0) return new Object();

    return utils.transformRoutesToReuseTab(patchRouter, '/', title);
  }

  // 移到指定展示位置
  moveToCurrentTag() {
    this.$nextTick(() => {
      const tags = this.$refs.tag as any[];
      for (const tag of tags) {
        if (tag.to !== this.$route.fullPath) {
          ReuseTabModule.updateVisitedView(this.getExternal(this.$route.fullPath));
          break;
        }
      }
    });
  }

  // 刷新当前选择的tag
  async refreshTag(view: any) {
    if (view.path.startsWith('/msun/external')) {
      const urls = view.path.split('?');
      const params: any = qs.parse(urls[1]);
      IframesModule.refreshIframes(params.code.toUpperCase());
      return;
    }
    await ReuseTabModule.delCachedView(view);
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + view.path
      });
    });
  }

  // 删除选中tag, 如果当前为最后一个, 则移动到最新位置
  closeSelectedTag(view: any) {
    const views = ReuseTabModule.visitedViews;
    if (views.length === 1) return;
    this.$store.dispatch('delView', view)
      .then(() => {
        if (!this.isActive(view)) return;
        this.toLastView(view);
      });
  }

  // 关闭其他tag
  closeOthersTags() {
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + this.selectedTag.path
      });
    });
    this.$store.dispatch('delOthersViews', this.selectedTag)
    this.moveToCurrentTag();
  }

  // 将 tag 移到指定有效位置
  toLastView(view: any) {
    const latestView = this.$store.state.ReuseTab.visitedViews.slice(-1)[0];
    if (latestView) {
      this.$router.push(latestView.path);
      return;
    }
    if (view.title === 'Dashboard') {
      this.$router.replace({ path: '/redirect' + view.path });
    } else {
      this.$router.push('/');
    }
  }

  // 打开下拉框, 并初始化下拉框位置
  openMenu(tag: any, e: MouseEvent) {
    this.left = e.clientX;
    this.top = e.clientY + 15;
    this.visible = true;
    this.selectedTag = tag;
  }

  // 隐藏菜单信息
  closeMenu() {
    this.visible = false;
  }
}
</script>
<style lang="less" scoped src="./reuse-tab.less"></style>
