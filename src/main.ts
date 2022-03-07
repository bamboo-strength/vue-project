import 'babel-polyfill';
import 'fetch-detector';
import 'fetch-ie8';
import '@primary/assets/font/iconfont.css';
import '@primary/assets/font/iconfont.js';
import '@primary/styles/_index.less';
import '@primary/styles/_theme.less';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import Vue from 'vue';
import Startup from '@/core/startup';
import i18n from '@/lang';
import store from '@/store/index';
import filters from '@/filters';
import Directives from '@/directives';
import Components from '@/components';
import App from './App.vue';

Vue.use(Antd);

Vue.config.productionTip = false;

Vue.use(Directives);

Vue.use(Components);

Vue.use(filters);

Startup.bootstrap().then((params: any) => {
  const router = params.router;

  router.afterEach((to: any) => {
    const origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const url = origin + process.env.VUE_APP_BASE_URL + '#' + to.path;
    history.pushState(null, String(), url);
  });

  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  });
});
