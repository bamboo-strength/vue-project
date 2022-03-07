import './iframes.less';
import qs from 'qs';

export default {
  name: 'IframeBox',

  computed: {
    pages: function() {
      return this.$store.getters.ENABLE_PAGES;
    },
    boxState: function() {
      return this.$store.getters.BOX_STATE;
    },
    refreshState: function() {
      return this.$store.state.Iframes.IFRAMES_REFRESH.IFRAMES_REFRESH_STATE
    }
  },

  watch: {
    refreshState(val) {
      if (!val) return;
      const iframes = this.$store.state.Iframes.IFRAMES_REFRESH.IFRAMES_REFRESH_LIST;
      try {
        this.$nextTick(() => {
          for (const _ of iframes) {
            const dealIframes = document.getElementById(_.toLowerCase());
            window.open(dealIframes.src, dealIframes.name, new String());
          }
          this.$store.dispatch('unRefreshIframes');
        })
      } catch (error) {
        this.$message.error(error);
      }
    }
  },

  methods: {
    convert(src, obj) {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return src;
      }
      return src + '?' + qs.stringify(obj);
    }
  },

  render() {
    const divProps = {
      class: {
        'iframe-box': true
      },
      style: {
        display: this.boxState ? 'block' : 'none'
      }
    }
    return <Div { ...divProps }>
      {
        this.pages.map(_item => {
          const iframesProps = {
            attrs: {
              id: _item.key.toLowerCase(),
              key: _item.title,
              src: this.convert(_item.src, _item.params),
              name: _item.title,
              frameborder: 0,
              height: '100%',
              width: '100%'
            },
            style: {
              display: _item.show ? 'block' : 'none'
            },
            key: _item.title
          };

          return <Iframe { ...iframesProps }></Iframe>
        })
      }
    </Div>
  }
}
