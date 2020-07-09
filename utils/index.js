export function timeDeltaSec(tt, mode = 0) {
  if (!tt) {
    return 0;
  }
  const a = tt.split("-");
  const y = a[0];
  const m = a[1];
  const Str1 = a[2];
  let d = Str1.substr(0, 2);
  let h = Str1.substr(3, 2);
  let minutes = Str1.substr(6, 2);
  const seconds = Str1.substr(9, 2);

  // 对于mode = 1，是从3天开始算
  if (mode === 1) {
    d = parseInt(d, 10);
    d += 3;
  }

  // ios系统必须用/做分隔符
  const time1 = new Date(`${y}/${m}/${d} ${h}:${minutes}:${seconds}`);
  const time2 = new Date();
  if (mode === 0) {
    return parseInt((time2.getTime() - time1.getTime()) / 1000, 10) > 1800
      ? 1800
      : parseInt((time2.getTime() - time1.getTime()) / 1000, 10);
  }
  let deltaSecs = (time1.getTime() - time2.getTime()) / 1000;
  const total = deltaSecs;
  d = Math.floor(deltaSecs / 86400);
  deltaSecs %= 86400;
  h = Math.floor(deltaSecs / 3600);
  deltaSecs %= 3600;
  minutes = Math.floor(deltaSecs / 60);
  return { d, h, minutes, total };
}

export function timeDeltaDay(tt) {
  if (!tt) {
    return 0;
  }
  const a = tt.split("-");
  const y = a[0];
  const m = a[1];
  const Str1 = a[2];
  const d = Str1.substr(0, 2);

  const time1 = new Date(`${y}/${m}/${d} 00:00:00`);
  const time2 = new Date();
  return parseInt((time1.getTime() - time2.getTime()) / 86400000);
}

export function formatDay(tt) {
  return tt.substr(0, 10);
}

export function calEndTime(start_time, delta, mode = 0) {
  // console.log(start_time.replace(/-/g, '/').replace(/T/, ' ').substr(0,16));
  const end_at = new Date(
    start_time
      .replace(/-/g, "/")
      .replace(/T/, " ")
      .substr(0, 16)
  );
  // console.log(end_at);
  end_at.setMinutes(end_at.getMinutes() + delta);
  // let end_at = new Date(new Date(start_time).getTime() + delta * 60 * 60 * 1000);
  const y = end_at.getFullYear();
  const m = end_at.getMonth() + 1;
  const d = end_at.getDate();
  const h = end_at.getHours();
  let minutes = end_at.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (mode === 0) {
    return `${m}月${d}日${h}:${minutes}`;
  }
  return `${y}年${m}月${d}日${h}点`;
}

export function deformatPrice(str) {
  const yuan = str.substring(1);
  return parseFloat(yuan) * 100;
}

// export function utf8(str) {
//   console.log('utf8', str);
//   return str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "\u9602");
// }

export function isChinese(name) {
  const myreg = /^[\u4e00-\u9fa5]{1,10}$/;
  if (!myreg.test(name)) {
    // showToast({ title: '请输入正确的中文姓名', icon: 'none' });
    return false;
  }
  return true;
}

export function isEmpty(value) {
  if (
    value === null ||
    value === "" ||
    value === "undefined" ||
    value === undefined ||
    value === "null"
  ) {
    return true;
  }
  if (typeof value === "undefined") {
    return true;
  }
  if (typeof value === "string") {
    value = value.replace(/\s/g, "");
    if (value == "") {
      return true;
    }
  }
  return false;
}

export function debounce(func, delay) {
  let timer;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function deepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}

export function countBaseSale(uuid, min_num = 50, max_num = 2000) {
  if (!uuid) {
    return 0;
  }
  let seed = 0;
  const zero = "0".charCodeAt(0);
  const a = "a".charCodeAt(0);
  for (let i = 1; i <= 4; i++) {
    seed =
      seed * 36 +
      (uuid.charCodeAt(uuid.length - i) >= a
        ? uuid.charCodeAt(uuid.length - i) - a + 10
        : uuid.charCodeAt(uuid.length - i) - zero);
  }
  seed %= 167961;
  seed /= 167961.0;
  seed = parseInt(min_num + (max_num - min_num) * seed);
  console.log("seed", seed);
  return seed;
}

function toRad(d) {
  return (d * Math.PI) / 180.0;
}
export function getDisance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);
  const deltaLat = radLat1 - radLat2;
  const deltaLng = toRad(lng1) - toRad(lng2);
  var dis =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(deltaLat / 2), 2) +
          Math.cos(radLat1) *
            Math.cos(radLat2) *
            Math.pow(Math.sin(deltaLng / 2), 2)
      )
    );
  return Math.round(dis * 6378137.0).toFixed(2);
}

export function getMi(disance) {
  const dis = (4000 / 60).toFixed(2);
  const min = (disance / dis).toFixed(2);
  if (min > 60) {
    return `约${(min / 60).toFixed(0)}小时${min % 60}分钟`;
  }
  if (Math.floor(min) <= 0) {
    return `小于1分钟`;
  }
  return `约${Math.floor(min)}分钟`;
}

export function formatPercent(val) {
  return `${(parseFloat(val) * 100).toFixed(2)}%`;
}

export function formatTimeMonth(tt) {
  if (!tt) {
    return "无";
  }
  const a = tt.split("-");
  const y = a[0];
  const m = a[1];
  return `${y}-${m}`;
}

export default {
  formatDay,
  timeDeltaDay,
  timeDeltaSec,
  calEndTime,
  deformatPrice,
  // utf8,
  isChinese,
  isEmpty,
  debounce,
  deepCopy,
  countBaseSale,
  // shorten
  getDisance,
  getMi,
  formatPercent,
  formatTimeMonth
};
