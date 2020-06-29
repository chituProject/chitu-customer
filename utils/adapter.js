/*
 * 所有参数默认按微信小程序格式，调用时除了不加 wx. 都一样
 */
import store from "@/store";
import config from "./config.json";
import Notify from "@/static/vant/notify/notify";

/**
 * 统一封装，工厂模式为了在找不到包的时候统一处理异常
 * @param args 消息内容，格式按微信小程序
 * @param wechatFuncProvider
 * @param aliFuncProvider
 * @param h5Func
 * @param defaultFunc
 */
function wrapper(
  args,
  wechatFuncProvider,
  aliFuncProvider,
  h5Func,
  defaultFunc
) {
  try {
    // console.log('wechatFunc');
    wechatFuncProvider()(args);
    return;
  } catch (e) {
    console.log("error: ", e);
  }

  try {
    // console.log('aliFunc');
    aliFuncProvider()(args);
    return;
  } catch (e) {}

  try {
    // console.log('h5Func');
    h5Func(args);
    return;
  } catch (e) {
    console.log(e);
  }

  try {
    // console.log('defaultFunc');
    defaultFunc(args);
  } catch (e) {}
}

export function showToast(args) {
  wx.vibrateShort();
  wrapper(
    args,
    () => wx.showToast,
    null,
    m => alert(m.title),
    m => console.log(m.title)
  );
}

export function showModal(args) {
  wx.vibrateShort();
  wrapper(
    args,
    () => wx.showModal,
    null,
    m => alert(m.title),
    m => console.log(m.title)
  );
}

export function showLoading(args) {
  wrapper(args, () => wx.showLoading, null, null, () =>
    console.log("showLoading")
  );
}

export function hideLoading(args) {
  wrapper(args, () => wx.hideLoading, null, null, () =>
    console.log("hideLoading")
  );
}

// H5中使用navigateTo，url无需加'/#'
export function navigateTo(args) {
  wx.vibrateShort();
  console.log(args.url);
  wrapper(args, () => uni.navigateTo, null, null, a =>
    console.log("navigate to: ".concat(a.url))
  );
}

export function navigateBack(args) {
  wx.vibrateShort();
  wrapper(args, () => wx.navigateBack, null, null, () =>
    console.log("navigate back")
  );
}

export function redirectTo(args) {
  wx.vibrateShort();
  wrapper(args, () => wx.redirectTo, null, null, () =>
    console.log("redirectTo")
  );
}

export function reLaunch(args) {
  wrapper(args, () => wx.reLaunch, null, null, () => console.log("reLaunch"));
}

export function switchTab(args) {
  wrapper(args, () => wx.switchTab, null, null, () => console.log("switchTab"));
}

export function showShareMenu(args) {
  wrapper(args, () => wx.showShareMenu, null, null, () =>
    console.log("showShareMenu")
  );
}

export function updateShareMenu(args) {
  wrapper(args, () => wx.updateShareMenu, null, null, () =>
    console.log("updateShareMenu")
  );
}

export function getSystemInfo(args) {
  wrapper(
    args,
    () => wx.getSystemInfo,
    null,
    a => {
      try {
        const res = {
          windowWidth: document.body.clientWidth,
          windowHeight: document.body.clientHeight
        };
        a.success(res);
      } catch (e) {
        a.fail(e);
      }
    },
    () => console.log("get system info")
  );
}

export function vibrateShort(args) {
  wrapper(args, () => wx.vibrateShort, null, null, () =>
    console.log("vibrateShort")
  );
}

export function getImageInfo(args) {
  wrapper(args, () => wx.getImageInfo, null, null, () =>
    console.log("getImageInfo")
  );
}

export function chooseImage(args) {
  wrapper(args, () => wx.chooseImage, null, null, () =>
    console.log("chooseImage")
  );
}

export function showActionSheet(args) {
  wrapper(args, () => wx.showActionSheet, null, null, () =>
    console.log("showActionSheet")
  );
}

export function setStorage(args) {
  wrapper(args, () => wx.setStorage, null, null, () =>
    console.log("setStorage")
  );
}

export function setStorageSync(args) {
  wrapper(args, () => wx.setStorageSync, null, null, () =>
    console.log("setStorageSync")
  );
}

export function getStorage(args) {
  wrapper(args, () => wx.getStorage, null, null, () =>
    console.log("getStorage")
  );
}

export function getStorageSync(args) {
  wrapper(args, () => wx.getStorageSync, null, null, () =>
    console.log("getStorageSync")
  );
}

function requestInterceptor(args) {
  let header = args.header || {};
  if (store.state.token) {
    if (store.state.token.length > 10) {
      header.authorization = `Token ${store.state.token}`;
    }
  }
  if (header.noToken) {
    header = {};
  }
  args.url = config.baseURL.concat(args.url);
  args.header = header;
}

/**
 * 检疫HTTP拦截器
 * 参数见https://uniapp.dcloud.io/api/request/request
 * 该方法在`main.js`中被加到Vue的原型链
 *
 * @example
 * import { httpRequest } from '@utils/adapter'
 * // in component:
 * httpRequest({...}).then(...);
 *
 * @example
 * // (推荐用法) in component:
 * this.$request({...}).then(...);
 *
 * @param args
 * @returns requestTask | Promise
 */
export function httpRequest(args) {
  requestInterceptor(args);
  const hasOwnProperty = Object.prototype.hasOwnProperty.bind(args);
  // 用老版本callback模式调用
  if (
    hasOwnProperty("success") ||
    hasOwnProperty("fail") ||
    hasOwnProperty("complete")
  ) {
    const newArgs = { ...args };
    newArgs.success = res => {
      if (!res || res.statusCode < 200 || res.statusCode > 299) {
        if (
          res &&
          res.data.detail &&
          res.statusCode !== 403 &&
          res.statusCode !== 409
        ) {
          showToast({ title: res.data.detail, icon: "none" });
        }
      } else {
        console.log("AJAX:", args, res);
      }
      // eslint-disable-next-line no-unused-expressions
      args.success && args.success(res);
    };
    newArgs.fail = err => {
      // eslint-disable-next-line no-unused-expressions
      args.fail && args.fail(err);
    };
    return uni.request(newArgs);
  }
  // 用uni-app封装的promise模式调用
  return uni.request(args).then(([err, res]) => {
    if (err || res.statusCode < 200 || res.statusCode > 299) {
      if (res.data.detail && res.statusCode !== 403 && res.statusCode !== 409) {
        showToast({ title: res.data.detail, icon: "none" });
      }
      return [err || new Error(`Response ${res.statusCode}`), null];
    }
    console.log("AJAX (promise):", args, err, res);
    return [err, res];
  });
}

/* above are the wx function wrappers */
/* below are other wrappers */

export function getQuery(object) {
  if (object.$store.state.h5) {
    return object.$route.query;
  }
  return object.$root.$mp.query;
}

export function notify(
  text,
  color = "#fff",
  backgroundColor = "#f56250",
  duration = 1500
) {
  Notify({ text, color, backgroundColor, duration });
}
