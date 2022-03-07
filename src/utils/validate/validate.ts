import { valid } from './valid';

/** 联系方式验证 */
const IS_CHECK_TEL = (rule: object, value: any, callback: Function) => {
  if (value === null || value === '') {
    return callback();
  }
  return valid.IS_VALID_TEL(value) || valid.IS_VALID_PHONE(value) ? callback() : callback(new Error('请输入正确的联系方式!'));
};

/** URL 验证 */
const IS_CHECK_URL = (rule: object, value: any, callback: Function) => {
  valid.IS_VALID_URL(value) ? callback() : callback(new Error('请输入正确的URL地址'));
};

/** 数字验证 */
const IS_CHECK_NONNEGATIVE_NUMBER = (rule: object, value: any, callback: Function) => {
  valid.IS_VALID_NONNEGATIVE_NUMBER(value) ? callback() : callback(new Error('请输入正确的数字'));
};

/** 验证身份证号 */
const IS_CHECK_ID_CARD = (rule: object, value: any, callback: Function) => {
  if (value === null || value === '') {
    return callback();
  }
  return valid.IS_VALID_ID_CARD(value) ? callback() : callback(new Error('请输入正确的身份证号'));
};

export const Validate = {
  IS_CHECK_TEL,
  IS_CHECK_URL,
  IS_CHECK_NONNEGATIVE_NUMBER,
  IS_CHECK_ID_CARD
};
