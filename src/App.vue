<template>
  <a-config-provider :locale="vlocale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

@Component({})
export default class App extends Vue {
  vlocale: any = zhCN;
}
</script>
