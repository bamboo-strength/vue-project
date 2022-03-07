import axios from 'axios';

const api = axios.create({ baseURL: process.env.VUE_APP_COMMON_API });

// 获取菜单信息
const getAsyncMenu = (params: any) => api.get('/menu/findMenuById', { params });

export const common = {
  getAsyncMenu
};
