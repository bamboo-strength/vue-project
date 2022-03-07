import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators';
import store from './../index';

export interface IIframesState {
  IFRAMES_ENABLE: Boolean;

  IFRAMES_STATE: Object;

  IFRAMES_PAGE: Object;
}

@Module({ dynamic: true, store, name: 'Iframes' })
class Iframes extends VuexModule implements IIframesState {
  public IFRAMES_ENABLE = true;

  public IFRAMES_STATE: any = {
    IFRAME_BOX_STATE: false
  }

  public IFRAMES_PAGE = new Object();

  // 刷新
  public IFRAMES_REFRESH: any = {
    IFRAMES_REFRESH_STATE: false,
    IFRAMES_REFRESH_LIST: []
  }

  get ENABLE_PAGES() {
    const pages = new Array();

    for (const key in this.IFRAMES_STATE) {
      if (!Object.hasOwnProperty.call(this.IFRAMES_STATE[key], 'enable')) {
        continue;
      }
      if (this.IFRAMES_STATE[key]['enable']) {
        pages.push(this.IFRAMES_STATE[key]);
      }
    }

    return pages;
  }

  get BOX_STATE() {
    return this.IFRAMES_STATE.IFRAME_BOX_STATE;
  }

  get IFRAMES_PAGES() {
    return this.IFRAMES_PAGE;
  }

  @Mutation
  private SET_IFRAMES_PAGE(obj: Object) {
    Object.assign(this.IFRAMES_PAGE, obj);
  }

  @Mutation
  private SET_IFRAMES_STATE(obj: Object) {
    Object.assign(this.IFRAMES_STATE, obj);
    for (const key in obj) {
      if (!Object.hasOwnProperty.call(this.IFRAMES_STATE, key)) {
        continue;
      }

      this.IFRAMES_STATE[key].key = key;
      this.IFRAMES_STATE[key].params = {};
      this.IFRAMES_STATE[key].enable = false;
      this.IFRAMES_STATE[key].show = false;
    }
  }

  @Mutation
  private UPDATE_IFRAMES_STATE({ obj, key, value }: any) {
    if (!Object.hasOwnProperty.call(this.IFRAMES_STATE, obj.key)) {
      return;
    }
    if (typeof value !== 'undefined') {
      this.IFRAMES_STATE[obj.key][key] = value;
      return;
    }
    this.IFRAMES_STATE[obj.key][key] = obj[key];
  }

  @Mutation
  private REFRESH_IFRAMES(key: any) {
    this.IFRAMES_REFRESH.IFRAMES_REFRESH_LIST.push(key);
    this.IFRAMES_REFRESH.IFRAMES_REFRESH_STATE = true;
  }

  @Mutation
  private UNREFRESH_IFRAMES() {
    this.IFRAMES_REFRESH.IFRAMES_REFRESH_LIST = [];
    this.IFRAMES_REFRESH.IFRAMES_REFRESH_STATE = false;
  }

  @Mutation
  private FREEZE() {
    this.IFRAMES_STATE.IFRAME_BOX_STATE = true;
  }

  @Mutation
  private UNFREEZE() {
    this.IFRAMES_STATE.IFRAME_BOX_STATE = false;
  }

  @Mutation
  private REMOVE(key: any = null) {
    const keys = Object.keys(this.IFRAMES_PAGE);
    let obj = new Object();

    if (keys.length === 0) {
      return obj;
    }

    if (key && keys.findIndex(_item => _item === key) < 0) {
      return obj;
    }

    if (!key) {
      key = keys.pop();
    }

    obj = Object.assign({}, (this.IFRAMES_PAGE as any)[key]);
    delete (this.IFRAMES_PAGE as any)[key];
    delete (this.IFRAMES_STATE as any)[key];
    return obj;
  }

  @Mutation
  private REMOVE_ALL() {
    this.IFRAMES_PAGE = new Object();
  }

  @Action
  public next(obj: Object) {
    this.SET_IFRAMES_PAGE(obj);
    this.SET_IFRAMES_STATE(obj);
  }

  @Action
  public update(obj: any, key: any, value: any = null) {
    this.UPDATE_IFRAMES_STATE({ obj, key, value });
  }

  @Action
  public refreshIframes(key: any) {
    this.REFRESH_IFRAMES(key);
  }

  @Action
  public unRefreshIframes() {
    this.UNREFRESH_IFRAMES();
  }

  @Action
  public createdPage(obj: any) {
    if (obj.params) {
      this.UPDATE_IFRAMES_STATE({
        obj,
        key: 'params'
      })
    }
    this.UPDATE_IFRAMES_STATE({
      obj,
      key: 'enable',
      value: true
    });
    this.UPDATE_IFRAMES_STATE({
      obj,
      key: 'show',
      value: true
    });
    this.FREEZE();
  }

  @Action
  public activatedPage(key: any) {
    if (this.IFRAMES_STATE[key].show) return;
    this.UPDATE_IFRAMES_STATE({
      obj: this.IFRAMES_STATE[key],
      key: 'show',
      value: true
    });
    this.FREEZE();
  }

  @Action
  public deactivatedPage(key: any) {
    if (!this.IFRAMES_STATE[key].show) return;
    this.UNFREEZE();
    this.UPDATE_IFRAMES_STATE({
      obj: this.IFRAMES_STATE[key],
      key: 'show',
      value: false
    });
    if (this.IFRAMES_STATE[key].reuse) return;
    this.UPDATE_IFRAMES_STATE({
      obj: this.IFRAMES_STATE[key],
      key: 'enable',
      value: false
    })
  }

  @Action
  public beforeDestroyPage(key: any) {
    this.UNFREEZE();
    this.UPDATE_IFRAMES_STATE({
      obj: this.IFRAMES_STATE[key],
      key: 'enable',
      value: false
    });
  }

  @Action
  public changeParams(obj: any) {
    this.UPDATE_IFRAMES_STATE({
      obj,
      key: 'params'
    });
  }

  @Action
  public subscribe(key: any = null) {
    return new Promise((resolve) => {
      const obj = this.REMOVE(key)
      resolve(obj);
    })
  }

  @Action
  public unsubscribe() {
    this.REMOVE_ALL();
  }
}

export const IframesModule = getModule(Iframes);
