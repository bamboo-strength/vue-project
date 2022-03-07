
import IconFontJs from '@primary/assets/font/iconfont.js';
import { Menu, Icon } from 'ant-design-vue';

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: IconFontJs // iconfont
});

const DEFAULT_ICON = 'gongzuotai1';

export default {
  name: 'LayoutMenu',
  props: {
    // 菜单类型
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    // 菜单配置
    options: {
      type: Array,
      required: true
    },
    // 展开与收缩状态
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedKeys: [], // 默认选中菜单
      defaultOpenKeys: [] // 默认打开的菜单树节点
    }
  },

  watch: {
    $route: {
      handler(e) {
        this.defaultOpenKeys = [];
        let path = e.path;
        if (path.indexOf('/msun/external') > -1) {
          path = e.fullPath
        }
        this.getCurrentMenu(this.options, path);
      },
      immediate: true
    }
  },

  methods: {
    // 获取当前菜单
    getCurrentMenu(options, path) {
      const result = this.getCureentMenuKeys(options, path);
      if (!result) {
        return;
      }
      this.selectedKeys = [result[0].key];
      this.getDefaultOpenKeys(result);
    },

    // 获取当前菜单层级
    getCureentMenuKeys(options, path) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].path === path) {
          this.$emit('change', options[i].breadCrumb);
          return [options[i]];
        }

        if (options[i].children && options[i].children.length === 0) continue;

        const result = this.getCureentMenuKeys(options[i].children, path);

        if (result) return result.concat(options[i]);
      }
    },

    // 获取defaultOpenKeys
    getDefaultOpenKeys(val) {
      const arr = val ? val.slice(1) : [];
      if (arr.length > 0) {
        arr.forEach(item => {
          this.defaultOpenKeys.push(item.key);
        });
      } else {
        this.defaultOpenKeys = [];
      }
    },

    // a-menu 层
    renderMenu(options) {
      return options.map(_item => {
        if (!_item.children || _item.children.length === 0) {
          return this.renderMenuLink(_item);
        }
        return this.renderSubMenu(_item);
      })
    },

    // a-sub-menu 层
    renderSubMenu(_router) {
      // 子菜单信息
      const children = () => {
        return _router.children.map(_item => {
          if (!_item.children || _item.children.length === 0) {
            return this.renderMenuLink(_item, true);
          }
          return this.renderSubMenu(_item);
        })
      }

      const props = {
        key: _router.key,
        scopedSlots: {
          title: () => {
            return <Span>
              { this.renderIcon(_router) }
              <Span>{ _router.title }</Span>
            </Span>
          }
        }
      };
      return <Menu.SubMenu { ...props }>
        { children() }
      </Menu.SubMenu>
    },

    // link 层
    renderMenuLink(_router, flag = false) {
      const menuItemProps = {
        key: _router.key
      };
      const routeLinkProps = {
        props: {
          to: _router.path
        }
      };
      return <Menu.Item { ...menuItemProps }>
        <RouterLink { ...routeLinkProps }></RouterLink>
        { this.renderIcon(_router, flag) }
        <Span>{ _router.title }</Span>
      </Menu.Item>;
    },

    // 图标层
    renderIcon(_router, flag = false) {
      if (flag) {
        return null;
      }
      let icon = _router.icon;
      if (!_router.icon) {
        icon = DEFAULT_ICON;
      }
      const props = {
        props: {
          type: `icon-${icon}`
        }
      };
      return <MyIcon { ...props } />
    }
  },

  render() {
    const props = {
      props: {
        mode: this.$props.mode, // 菜单类型
        defaultOpenKeys: this.defaultOpenKeys, // 打开的菜单树节点
        defaultSelectedKeys: this.selectedKeys, // 选中菜单
        inlineCollapsed: this.$props.collapsed
      }
    };
    return <Menu { ...props }>
      { this.renderMenu(this.options) }
    </Menu>
  }
}
