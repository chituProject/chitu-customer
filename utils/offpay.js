/* eslint-disable no-use-before-define */
import store from "@/store";
import { httpRequest, navigateTo } from "./adapter";

// 上传FormId到后台，本地缓存清理
export function cleanFormId(callback) {
  if (!store.state.formIds || !store.state.formIds.length) {
    try {
      if (typeof callback === "function") {
        callback();
      }
    } catch (e) {}
    return;
  }
  httpRequest({
    url: "form/",
    method: "POST",
    data: { form_ids: store.state.formIds },
    success: res => {
      if (res.statusCode > 199 && res.statusCode < 300) {
        try {
          if (typeof callback === "function") {
            callback();
          }
        } catch (e) {}
        store.commit("CLEAN_FORMID");
      }
    }
  });
}

// 拉取最新用户信息
export function fetchUserInfo() {
  return httpRequest({
    url: `user/${store.getters["user/userId"]}/`,
    method: "GET",
    success: res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        store.commit("user/SET_USER_INFO", res.data);
      }
    }
  });
}

async function fetchWechatInfo() {
  if (store.getters["app/hasWechatInfo"]) {
    return;
  }
  const [err, res] = await uni.getUserInfo();
  if (res) {
    store.commit("app/SET_WECHAT_INFO", res.userInfo);
  }
  const userId = store.getters["user/userId"];
  const userInfo = store.getters["user/userInfo"];
  if (err || !userId) {
    return;
  }
  const params = {};
  if (userInfo.wechat_nickname !== res.userInfo.nickName) {
    params.wechat_nickname = res.userInfo.nickName;
  }
  if (userInfo.wechat_avatar_url !== res.userInfo.avatarUrl) {
    params.wechat_avatar_url = res.userInfo.avatarUrl;
  }
  if (Object.keys(params).length === 0) {
    return;
  }
  // 更新user
  const [err2] = await httpRequest({
    url: `user/${userId}/modify/`,
    data: params,
    method: "POST"
  });
  if (!err2) {
    offpayAuth();
  }
}

/**
 * 检查微信登陆session是否过期，若过期则重新login
 *
 * @returns Promise<undefined> 如果session有效不需要重新登陆，则返回resolved<undefined>
 * @returns Promise<res> 如果需要重新登陆，登陆接口访问成功返回POST auth/ 返回resolved<res>
 * @returns Promise<res> 如果需要重新登陆，登陆接口访问失败返回返回rejected<res>
 */
export function tryLogin() {
  /* eslint-disable no-unused-expressions */
  const login = () =>
    new Promise((resolve, reject) => {
      console.log("--- WECHAT LOGIN HERE ---");
      wx.login({
        success: res => resolve(res),
        fail: err => reject(err)
      });
    });

  const postToken = code =>
    new Promise((resolve, reject) => {
      httpRequest({
        url: "auth/",
        data: {
          code,
          mode: "mini"
        },
        header: {
          noToken: "true"
        },
        method: "POST",
        success: res => {
          if (res.statusCode > 199 && res.statusCode < 299) {
            console.log("--- WECHAT LOGIN END ---");
            store.commit("SET_TOKEN", res.data.token);
          }
          resolve(res);
        },
        fail: err => reject(err)
      });
    });

  const checkSession = () =>
    new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          if (!store.getters["app/hasLoggedIn"]) {
            reject();
          } else {
            resolve();
          }
        },
        fail: () => reject()
      });
    });

  return checkSession().catch(() => {
    return login().then(res => {
      if (res.code) {
        return postToken(res.code);
      }
      return undefined;
    });
  });
}

export async function offpayUserInfo() {
  const [err, res] = await httpRequest({
    url: "auth/",
    method: "GET"
  });
  if (err) return;
  store.commit("user/SET_USER", res.data.user);
  // get user info
  fetchUserInfo();
}

export async function offpayAuth() {
  return exportFunctions
    .tryLogin()
    .then(async res => {
      console.log("ddd", res);
      if (!res || (res.statusCode > 199 && res.statusCode < 299)) {
        // session还存在
        return exportFunctions.offpayUserInfo();
      }
      if (res.statusCode === 403) {
        // 用户不存在时，创建用户
        if (!store.getters["app/hasWechatInfo"]) {
          const [_, res3] = await uni.getUserInfo();
          if (res3) {
            store.commit("app/SET_WECHAT_INFO", res3.userInfo);
          }
        }
        if (store.getters["app/hasWechatInfo"]) {
          return exportFunctions.offpayRegister(
            store.getters["app/wechatInfo"],
            res.data.openid,
            store.state.scene
          );
        }
        throw new Error("offpayAuth: get wechat info failed");
      }
      throw new Error("offpayAuth: status code invalid", res);
    })
    .catch(e => {
      // 这里是确保不论出现什么错误, 【尤其是出错的时候】都会执行checkSetting检查授权
      console.error(e);
    })
    .then(exportFunctions.checkSetting);
}

export function checkSetting(thenFunc) {
  return uni
    .getSetting()
    .then(([err, res]) => {
      // 如果未授权，需要用户手动点击授权
      if (!res.authSetting["scope.userInfo"]) {
        store.commit("user/SET_SCOPE_USER", false);
        // navigateTo({ url: "/pages/wxauth/main" });
        // 跳出promise链
        throw new Error("checkSetting: requires authentication!");
      } else {
        store.commit("user/SET_SCOPE_USER", true);
      }
    })
    .then(fetchWechatInfo)
    .then(thenFunc);
}

function offpayRegister(userInfo, openid, qrScene) {
  const gender = ["unknown", "male", "female", "unknown"];
  const params = {
    mode: "mini",
    openid,
    // wechat_nickname: utf8(userInfo.nickName),
    wechat_nickname: userInfo.nickName,
    wechat_gender: gender[userInfo.gender]
  };
  if (qrScene) {
    params.source = "SCAN";
    params.from_reseller = qrScene;
    // params.from_customer = xx;
  }
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

  return httpRequest({
    url: "user/",
    data: params,
    method: "POST",
    header: {
      noToken: "true"
    }
  }).then(([err, res]) => {
    if (res) {
      return offpayAuth();
    }
    throw new Error(err);
  });
}

/**
 * 用于单元测试！
 * https://medium.com/@DavideRama/mock-spy-exported-functions-within-a-single-module-in-jest-cdf2b61af642
 */
const exportFunctions = {
  tryLogin,
  offpayAuth,
  offpayRegister,
  offpayUserInfo,
  checkSetting
};

export default exportFunctions;
