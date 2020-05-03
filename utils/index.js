
import {showToast} from '@/utils/adapter';

export function formatTime(tt, mode = 0) {
  if (!tt) {
    return "";
  }
  const a = tt.split("-");
  const y = a[0];
  const m = a[1];
  const Str1 = a[2];
  const d = Str1.substr(0, 2);
  const h = Str1.substr(3, 2);
  const minutes = Str1.substr(6, 2);
  const seconds = Str1.substr(9, 2);
  if (mode === 0) {
    return `${m}月${d}日 ${h}:${minutes}:${seconds}`;
    // return `${y}/${m}/${d} ${h}:${minutes}:${seconds}`;
  }
  return `${y}年${m}月${d}日`;
}

export function formatPrice(n) {
  return (n / 100).toFixed(2);
}

export function deformatPrice(str) {
  const yuan = str.substring(1);
  return parseFloat(yuan) * 100;
}

export function isNumber(val) {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
}

export function isChinese(name) {
  const myreg = /^[\u4e00-\u9fa5]{2,10}$/;
  if (!myreg.test(name)) {
    showToast({ title: '请输入正确的中文姓名', icon: 'none' });
    return false;
  }
  return true;
}

export function isIdcard(idcard) {
  const myreg = /^([1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2})$/;
  if (!myreg.test(idcard)) {
    showToast({ title: '请输入正确身份证号', icon: 'none' });
    return false;
  }
  return true;
}

export function isBankCard(bankcard) {
  const myreg = /^[0-9]{16,19}$/;
  if (!myreg.test(bankcard)) {
    showToast({ title: '请输入正确银行卡号', icon: 'none' });
    return false;
  }
  return true;
}

export function isPhone(phone) {
  const myreg = /^[1][0-9]{10}$/;
  if (!myreg.test(phone)) {
    showToast({ title: '请输入正确中国大陆手机号', icon: 'none' });
    return false;
  }
  return true;
}

export function isLicense(license) {
  const myreg = /^[0-9|A-Z|a-z]{15,18}$/;
  if (!myreg.test(license)) {
    showToast({ title: '请输入正确营业执照号', icon: 'none' });
    return false;
  }
  return true;
}

export function isSmscode(code) {
  const myreg = /^[0-9]{4}$/;
  if (!myreg.test(`${code}`)) {
    showToast({ title: '请输入正确验证码', icon: 'none' });
    return false;
  }
  return true;
}

export function isUrl(url, hint) {
  console.log('url', url);
  // const myreg = /(http|ftp|https):?/;
  if (!url) {
    showToast({ title: hint, icon: 'none' });
    return false;
  }
  return true;
}

export function isEmpty(key, value) {
  if (!value) {
    showToast({ title: `请输入${key}!`, icon: 'none' });
    return false;
  }
  return true;
}

export function isEmail(email) {
  const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexp.test(email)) {
    showToast({ title: '请输入正确的邮件地址', icon: 'none' });
    return false;
  }
  return true;
}

// export function utf8(str) {
//   console.log('utf8', str);
//   return str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "\u9602");
// }

export function trim_nulls(data) {
  var y;
  for (var x in data) {
    y = data[x];
    if (y instanceof Object) y = trim_nulls(y);
    if (y === "null" || y === null || y === "" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
      delete data[x];
    }
  }
  return data;
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export default {
  formatTime,
  formatPrice,
  deformatPrice,
  isNumber,
  isChinese,
  isIdcard,
  isBankCard,
  isPhone,
  isLicense,
  isUrl,
  // utf8,
  trim_nulls,
  debounce,
};
