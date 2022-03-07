import { Vue, Component } from 'vue-property-decorator';

@Component
export class PagingMixins extends Vue {
  /** 当前展示页 */
  pageIndex: number = 1;

  /** 每页展示量 */
  pageSize: number = 20;

  /** 总数据信息 */
  pageTotal: number = 0;

  /** 查询缓存 */
  msSearchCache: any = {};
}
