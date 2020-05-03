/*
 * 所有参数默认按微信小程序格式，以uni为前缀，h5+的api略有不同
 */
import store from '@/store';
import config from './config.json';

/**
 * 统一封装，工厂模式为了在找不到包的时候统一处理异常
 * @param args 消息内容，格式按微信小程序
 * @param wechatFuncProvider
 * @param aliFuncProvider
 * @param h5Func
 * @param defaultFunc
 */
function wrapper(args, wechatFuncProvider, aliFuncProvider, h5Func, defaultFunc) {
  try {
    // console.log('wechatFunc');
    // console.log('args', args);
    wechatFuncProvider()(args);
    return;
  } catch (e) {
    console.log('error: ', e);
  }

  try {
    // console.log('aliFunc');
    aliFuncProvider()(args);
    return;
  } catch (e) {
  }

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
  } catch (e) {
  }
}


export function showToast(args) {
  wrapper(
    args,
    () => uni.showToast,
    () => uni.showToast,
    m => alert(m.title),
    m => console.log(m.title),
  );
}

export function showModal(args) {
  wrapper(
    args,
    () => uni.showModal,
    () => uni.showModal,
    m => alert(m.title),
    m => console.log(m.title),
  );
}

export function showLoading(args) {
  wrapper(
    args,
    () => uni.showLoading,
    () => uni.showLoading,
    m => alert(m.title),
    m => console.log(m.title),
  );
}

// H5中使用navigateTo，url无需加'/#'
export function navigateTo(args) {
  uni.vibrateShort();
  console.log(args.url);
  wrapper(args, () => uni.navigateTo, null, null, a =>
    console.log("navigate to: ".concat(a.url))
  );
}

export function navigateBack(args) {
  uni.vibrateShort();
  wrapper(args, () => uni.navigateBack, null, null, () =>
    console.log("navigate back")
  );
}


export function redirectTo(args) {
  wrapper(
    args,
    () => uni.redirectTo,
    () => uni.redirectTo,
    null,
    () => console.log('redirectTo'),
  );
}

export function reLaunch(args) {
  wrapper(
    args,
    () => uni.reLaunch,
    () => uni.reLaunch,
    null,
    () => console.log('reLaunch'),
  );
}

export function setNavigationBarTitle(args) {
  wrapper(
    args,
    () => uni.setNavigationBarTitle,
    () => uni.setNavigationBarTitle,
    null,
    () => console.log('bar title set'),
  );
}

export function getSystemInfo(args) {
  wrapper(
    args,
    () => uni.getSystemInfo,
    () => uni.getSystemInfo,
    (a) => {
      try {
        const res = {
          windowWidth: document.body.clientWidth,
          windowHeight: document.body.clientHeight,
        };
        a.success(res);
      } catch (e) {
        a.fail(e);
      }
    },
    () => console.log('get system info'),
  );
}

export function chooseImage(args) {
  wrapper(
    args,
    () => uni.chooseImage,
    () => uni.chooseImage,
    null,
    () => console.log('chooseImage'),
  );
}

export function getImageInfo(args) {
  wrapper(
    args,
    () => uni.getImageInfo,
    () => uni.getImageInfo,
    null,
    () => console.log('getImageInfo'),
  );
}

export function showActionSheet(args) {
  wrapper(
    args,
    () => uni.showActionSheet,
    () => uni.showActionSheet,
    null,
    () => console.log('showActionSheet'),
  );
}

export function scanCode(args) {
  wrapper(
    args,
    () => uni.scanCode,
    () => uni.scanCode,
    null,
    () => console.log('scanCode'),
  );
}

export function vibrateShort(args) {
  wrapper(
    args,
    () => uni.vibrateShort,
    () => uni.vibrateShort,
    null,
    () => console.log('vibrateShort'),
  );
}

export function getQuery(object) {
  if (object.$store.state.h5) {
    return object.$route.query;
  }
  return object.$root.$mp.query;
}

export function httpRequest(args) {
  const header = {};
  if (store.state.token !== '' && store.state.token !== 'undefined' && store.state.token !== undefined) {
    header.opa = 'Token '.concat(store.state.token);
  }
  args.header = header;
  console.log('header=', header);
  args.url = config.baseURL.concat(args.url);
  args.complete = (res) => {
    console.log('complete=', res);
    if (res.statusCode < 200 || res.statusCode > 299) {
      if (res.statusCode > 499) {
        showToast({ title: 'oops， 我们遇到了一些问题', icon: 'none' });
      }
      // 当用户未注册，不做用户提示
      else if (res.data.detail && res.data.detail !== '用户未注册') {
        showToast({ title: res.data.detail, icon: 'none' });
      } else {
        let m = 0;
        for (const i in res.data) {
          m++;
          if (m > 4) {
            break;
          }
          showToast({ title: `${i}:${res.data[i]}`, icon: 'none' });
        }
      }
    }
  };
  console.log('request adapter', args);
  wrapper(
    args,
    () => uni.request,
    () => uni.request,
    null,
    () => console.log('http request'),
  );
}

export function altHttpRequest(args) {
  console.log('request adapter', args);
  wrapper(
    args,
    () => uni.request,
    () => uni.request,
    null,
    () => console.log('http request'),
  );
}

export function login(args) {
  console.log('request adapter', args);
  wrapper(
    args,
    () => uni.login,
    () => uni.login,
    null,
    () => console.log('login'),
  );
}

export function reLogin(callback) {
  console.log('re-login');
  uni.login({
    success: (res) => {
      httpRequest({
        url: 'auth/',
        data: {
          code: res.code,
          mode: 'mini',
        },
        method: 'POST',
        success: (res2) => {
          try {
            if (typeof callback === 'function') {
              callback();
            }
          } catch (e) {}
          store.commit('SET_TOKEN', res2.data.token);
          // that.getUserInfo(res2.data.token);
        },
      });
    },
  });
}


export function register(userInfo) {
  const gender = ['unknown', 'male', 'female', 'unknown'];
  console.log(userInfo);
  const params = {
    mode: 'mini',
    type: 'OFFICIAL',
    openid: store.state.openid,
    // wechat_nickname: utf8(userInfo.nickName),
    wechat_nickname: userInfo.nickName,
    wechat_gender: gender[userInfo.gender],
  };
  if (userInfo.avatarUrl) {
    params.wechat_avatar_url = userInfo.avatarUrl;
  }
  if (userInfo.city) {
    params.wechat_city = userInfo.city;
  }
  if (userInfo.province) {
    params.wechat_province = userInfo.province;
  }
  if (userInfo.country) {
    params.wechat_country = userInfo.country;
  }
  console.log(params);

  httpRequest({
    url: 'user/',
    data: params,
    method: 'POST',
    success: () => {
      reLogin();
    },
  });
}

export function reRegister(userInfo) {
  console.log('register');
  uni.login({
    success: (res) => {
      httpRequest({
        url: 'auth/',
        data: {
          code: res.code,
          mode: 'mini',
        },
        method: 'POST',
        success: (res2) => {
          if (res2.statusCode === 201) {
            store.commit('SET_TOKEN', res2.data.token);
          } else if (res2.statusCode === 403) {
            const gender = ['unknown', 'male', 'female', 'unknown'];
            console.log(userInfo);
            const params = {
              mode: 'mini',
              type: 'OFFICIAL',
              openid: store.state.openid,
              // wechat_nickname: utf8(userInfo.nickName),
              wechat_nickname: userInfo.nickName,
              wechat_gender: gender[userInfo.gender],
            };
            if (userInfo.avatarUrl) {
              params.wechat_avatar_url = userInfo.avatarUrl;
            }
            if (userInfo.city) {
              params.wechat_city = userInfo.city;
            }
            if (userInfo.province) {
              params.wechat_province = userInfo.province;
            }
            if (userInfo.country) {
              params.wechat_country = userInfo.country;
            }
            console.log(params);

            httpRequest({
              url: 'user/',
              data: params,
              method: 'POST',
              success: () => {
                reLogin();
              },
            });
          }
        },
      });
    },
  });
}

export function cleanFormId(callback) {
  if (!store.state.formIds || !store.state.formIds.length) {
    try {
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {}
    return;
  }
  httpRequest({
    url: 'form/',
    method: 'POST',
    data: { form_ids: store.state.formIds },
    success: (res) => {
      if (res.statusCode > 199 && res.statusCode < 300) {
        try {
          if (typeof callback === 'function') {
            callback();
          }
        } catch (e) {}
        store.commit('CLEAN_FORMID');
      }
    },
  });
}
