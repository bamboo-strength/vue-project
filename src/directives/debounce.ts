const debounce = {
  inserted: (el: any, binding: any, vNode: any) => {
    let timer: any;

    const uLock = binding.arg;

    const setTimeExecute = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
        if (!uLock) {
          ulockExecute(false);
        }
      }, 1000);
    }

    const ulockExecute = (locking = true) => {
      const type = vNode.child.$el.nodeName;

      switch (type) {
        case 'BUTTON':
          if (!uLock) {
            vNode.child.sLoading = locking;
          } else {
            vNode.context[uLock] = locking;
          }
          break;
        case 'INPUT':
        case 'SPAN':
        default:
          break;
      }
    }

    if (binding.modifiers.click) {
      el.addEventListener('click', () => {
        ulockExecute(true);
        setTimeExecute();
      });
    }

    if (binding.modifiers.enter) {
      el.addEventListener('keydown', (e: any) => {
        if (e.keyCode === 13) {
          ulockExecute(true);
          setTimeExecute();
        }
      });
    }
  }
}

export default debounce;
