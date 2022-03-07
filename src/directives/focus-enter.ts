import KeyCode from '@primary/utils/keyCode';

const isMultipleOrTags = (props: any) => {
  return props.multiple || props.tags;
};

/**
 * 绑定 聚焦
 * @param nextComponent
 * @param type
 */
const onFocus = (nextComponent: any, type?: any) => {
  if (type && type === 'button') {
    nextComponent.$el.focus();
    return;
  }

  if (nextComponent.focus && typeof nextComponent.focus === 'function') {
    nextComponent.focus();
  }

  if (nextComponent.select && typeof nextComponent.select === 'function') {
    nextComponent.select();
  }
};

const FocusExter = {
  bind: (el: any, binding: any, vNode: any) => {
    const nextFocus = el.getAttribute('focus-enter-next');

    el.addEventListener('keydown', (e: any) => {
      if (e.keyCode === 9) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
      }

      if (e.keyCode === 13) {
        if (vNode.tag.indexOf('Select') > -1) {
          return;
        }

        if (vNode.tag.indexOf('Input') > -1 || vNode.tag.indexOf('MsSearchBox') > -1) {
          onFocus(vNode.context.$refs[nextFocus], vNode.context.$refs[nextFocus].$el.nodeName.toLowerCase());
        }
      }
    });
  },
  inserted: (el: any, binding: any, vNode: any) => {
    const initFocus = el.getAttribute('focus-enter-init');
    if (initFocus !== null) {
      onFocus(vNode.context.$refs[initFocus]);
    }

    if (vNode.tag.indexOf('Select') > -1) {
      const vSelectNode = vNode.child.$refs['vcSelect'];
      const nextFocus = el.getAttribute('focus-enter-next');
      vSelectNode.onKeyDown = (e: any) => {
        const { _open: open } = vSelectNode.$data;
        const { disabled } = vSelectNode.$props;
        if (disabled) {
          return;
        }
        const keyCode = e.keyCode;
        if (open && !vSelectNode.getInputDOMNode()) {
          vSelectNode.onInputKeydown(e);
        } else if (keyCode === KeyCode.ENTER || keyCode === KeyCode.DOWN) {
          if (keyCode === KeyCode.ENTER && !isMultipleOrTags(vSelectNode.$props)) {
            vSelectNode.maybeFocus(true);
            if (!open) {
              onFocus(vNode.context.$refs[nextFocus], vNode.context.$refs[nextFocus].$el.nodeName.toLowerCase());
            }
          } else if (!open) {
            vSelectNode.setOpenState(true);
          }
          e.preventDefault();
        } else if (keyCode === KeyCode.SPACE) {
          if (!open) {
            vSelectNode.setOpenState(true);
            e.preventDefault();
          }
        }
      };
    }
  }
}

export default FocusExter;
