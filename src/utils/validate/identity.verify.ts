const CITY_VERIFY: any = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外'
};

/** 验证基本输入规则  */
const isCardNo = (identityCard: string) => {
  const reg = /(^\d{17}(\d|X|x)$)/;
  return reg.test(identityCard);
};

/** 监测前两位是否为省份 */
const checkProvince = (identityCard: string) => {
  const provice = identityCard.substr(0, 2);
  return Boolean(CITY_VERIFY[provice]);
};

/** 检测生日是否正确 */
const checkBirthDay = (identityCard: string) => {
  const REG_EIGHTEEN = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
  const ARR_DATA: any = identityCard.match(REG_EIGHTEEN);
  const year = ARR_DATA[2];
  const month = ARR_DATA[3];
  const day = ARR_DATA[4];
  const birthDay = new Date(`${year}/${month}/${day}`);
  return verifyBirthDay(year, month, day, birthDay);
};

const verifyBirthDay = (year: any, month: any, day: any, birthDay: any) => {
  const nowDate = new Date();

  const NOW_YEAR = nowDate.getFullYear();
  if (birthDay.getFullYear() === Number(year) && (birthDay.getMonth() + 1) === Number(month) && birthDay.getDate() === Number(day)) {
    const time = NOW_YEAR - year;
    return time >= 0 && time <= 150;
  }
  return false;
};

/** 检验校验位是否正确 */
const checkParity = (identityCard: any) => {
  const ARR_INT = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const ARR_CH = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let cardTemp = 0;
  for (let i = 0; i < 17; i++) {
    cardTemp += identityCard.substr(i, 1) * ARR_INT[i];
  }
  return ARR_CH[cardTemp % 11] === identityCard.substr(17, 1);
}

/**
 * 验证身份证合法性
 * @param identityCard 身份证号码
 * @returns Boolean
 */
export const checkIdentityCard = (identityCard: string): Boolean => {
  return isCardNo(identityCard) && checkProvince(identityCard) && checkBirthDay(identityCard) && checkParity(identityCard);
};
