import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en';
import zh from './zh';

Vue.use(VueI18n);

const messages = {
  zh_CN: {
    ...zh
  },
  'en-us': {
    ...en
  }
};

export const getLocale = () => {
  return 'zh_CN';
};

const i18n = new VueI18n({
  locale: getLocale(),
  messages
});

export default i18n;
