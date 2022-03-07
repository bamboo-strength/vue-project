declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'ant-design-vue/lib/locale-provider/*' {
  export const antLocale: any;
}

declare module '*.gif' {
  export const gif: any;
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to';

// TODO: remove this part after vuedraggable has its typescript file
declare module 'vuedraggable';

// TODO: remove this part after vue2-dropzone has its typescript file
declare module 'vue2-dropzone';

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload';

// TODO: remove this part after vue-splitpane has its typescript file
declare module 'vue-splitpane';

declare module '@primary/utils/mathjax';

declare module '@primary/layout/layout.js';

declare module '@primary/layout/iframes/iframes.js';

declare module '@primary/utils/keyCode';
