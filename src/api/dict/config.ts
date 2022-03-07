import axios from 'axios';

const api = axios.create({ baseURL: process.env.VUE_APP_COMMON_API });

/** 获取配置中心数据 */
const getConfig = (params: any) => {
  return api.post('/api/config/getStringConfig', params);
}

export const config = {
  getConfig
};
