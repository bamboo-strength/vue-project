import debounce from './debounce';
import FocusExter from './focus-enter';

const directives: any = {
  debounce,
  'focus-enter': FocusExter
};

export default {
  install(Vue: any) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    })
  }
};
