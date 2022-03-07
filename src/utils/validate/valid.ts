import { checkIdentityCard } from './identity.verify';

const IS_VALID_ARRAY = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
};

const IS_VALID_EXTERNAL = (path: string) => /^(https?:|mailto:|tel:)/.test(path);

const IS_VALID_URL = (url: string) => /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(url);

const IS_VALID_TEL = (value: string) => /^[1][3,4,5,7,8,9][0-9]{9}$/.test(value);

const IS_VALID_PHONE = (value: string) => /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value);

const IS_VALID_NONNEGATIVE_NUMBER = (value: string) => /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value);

const IS_VALID_ID_CARD = (value: string) => checkIdentityCard(value);

export const valid = {
  IS_VALID_ARRAY,
  IS_VALID_EXTERNAL,
  IS_VALID_URL,
  IS_VALID_TEL,
  IS_VALID_PHONE,
  IS_VALID_NONNEGATIVE_NUMBER,
  IS_VALID_ID_CARD
};
