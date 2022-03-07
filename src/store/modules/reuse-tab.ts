import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from './../index';

export interface IReuseTab {
  code?: string;
  title?: string;
  path?: string;
  badge?: number;
  affix?: boolean;
  reuse?: boolean;
}

export interface IReuseTabState {
  visitedViews: IReuseTab[];
  cachedViews: (string | undefined)[];
}

@Module({ dynamic: true, store, name: 'ReuseTab' })
class ReuseTab extends VuexModule implements IReuseTabState {
  /** 展示菜单信息 */
  public visitedViews: IReuseTab[] = [];

  /** 缓存菜单信息 */
  public cachedViews: (string | undefined)[] = [];

  /**
   * 将路由信息添加到可展示菜单信息内
   * @param route
   * @returns
   */
  @Mutation
  private ADD_VISITED_VIEW(route: any) {
    if (this.visitedViews.some(v => v.path === route.path)) return;
    this.visitedViews = [
      ...this.visitedViews,
      route
    ];
  }

  /**
   * 判断菜单是否可缓存, 并添加缓存编码
   * @param route
   * @returns
   */
  @Mutation
  private ADD_CACHED_VIEW(_reuse: any) {
    if (!_reuse.reuse) return;
    if (!_reuse?.title || !_reuse.code) return;
    if (this.cachedViews.includes(_reuse?.code)) return;
    if (_reuse.code) this.cachedViews.push(_reuse.code);
  }

  @Mutation
  private DEL_VISITED_VIEW(view: IReuseTab) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1);
        break;
      }
    }
  }

  @Mutation
  private DEL_CACHED_VIEW(view: IReuseTab) {
    if (!view.code) return;
    const index = this.cachedViews.indexOf(view.code);
    index > -1 && this.cachedViews.splice(index, 1);
  }

  @Mutation
  private DEL_OTHERS_VISITED_VIEWS(view: IReuseTab) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.affix || v.path === view.path;
    });
  }

  @Mutation
  private DEL_OTHERS_CACHED_VIEWS(view: IReuseTab) {
    if (view.title === null) return;
    const index = this.cachedViews.indexOf(view.title);
    if (index > -1) {
      this.cachedViews = this.cachedViews.slice(index, index + 1);
    } else {
      this.cachedViews = [];
    }
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    this.visitedViews = this.visitedViews.filter(view => view.affix);
  }

  @Mutation
  private DEL_ALL_CACHED_VIEWS() {
    this.cachedViews = [];
  }

  @Mutation
  private UPDATE_VISITED_VIEW(view: any) {
    for (let _views of this.visitedViews) {
      if (_views.path === view.path) {
        _views = Object.assign(_views, view);
        break;
      }
    }
  }

  @Action
  public addView(route: any) {
    this.addVisitedView(route);
    this.addCacheView(route);
  }

  @Action
  public addCacheView(route: any) {
    this.ADD_CACHED_VIEW(route);
  }

  @Action
  public addVisitedView(view: IReuseTab) {
    this.ADD_VISITED_VIEW(view);
  }

  @Action
  public delView(view: IReuseTab) {
    this.DEL_VISITED_VIEW(view);
    this.DEL_CACHED_VIEW(view);
  }

  @Action({ rawError: true })
  public delCachedView(view: IReuseTab) {
    return new Promise((resolve) => {
      this.DEL_CACHED_VIEW(view);
      resolve(this.visitedViews);
    })
  }

  @Action
  public delOthersViews(view: IReuseTab) {
    this.DEL_OTHERS_VISITED_VIEWS(view);
    this.DEL_OTHERS_CACHED_VIEWS(view);
  }

  @Action
  public delAllViews() {
    this.DEL_ALL_VISITED_VIEWS();
    this.DEL_ALL_CACHED_VIEWS();
  }

  @Action
  public delAllCachedViews() {
    this.DEL_ALL_CACHED_VIEWS();
  }

  @Action
  public updateVisitedView(route: any) {
    this.UPDATE_VISITED_VIEW(route);
  }
}

export const ReuseTabModule = getModule(ReuseTab);
