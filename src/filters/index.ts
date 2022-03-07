import { convert } from './convert';

const filters: any = {
  ...convert
}

export default {
  install(Vue: any) {
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key]);
    })
  }
}
