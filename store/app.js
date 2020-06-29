const state = {
  /**
   * appOptions
   * {
   *     page,
   *     query: {
   *         scene
   *     }
   * }
   */
  options: {},
  /**
   * See https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html
   */
  systemInfo: {},
  /**
   * See https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html
   * {
   *     avatarUrl,
   *     city,
   *     country,
   *     province,
   *     gender,
   *     language,
   *     nickName
   * }
   */
  wechatInfo: {},
  /**
   * Is iPhone X
   */
  isIpx: false,
  /**
   * 是否调用登陆接口
   * FIXME: auth暂时的办法是每次进入小程序都强制登陆一次
   */
  hasCalledLogin: false
};

const mutations = {
  SET_OPTIONS: (state, options) => {
    state.options = options;
  },
  SET_WECHAT_INFO: (state, info) => {
    state.wechatInfo = info;
    console.log("wechatInfo updated: ", info);
  },
  SET_SYSTEM_INFO: (state, info) => {
    const imgWidth = Math.round((info.windowWidth - 45) * 0.5);
    // 瀑布流的图片宽度
    info.imgWidth = imgWidth;
    // 瀑布流每个商品的高度
    info.cellHeight = imgWidth + 61;
    // 首页banner的宽度
    info.bannerWidth = info.windowWidth - 30;
    // 瀑布流分页的个数，切记只有瀑布流用这个参数！
    info.page_size = 4 * Math.floor((info.windowHeight - 90) / 340 + 1);

    state.systemInfo = info;
    console.log("system_info updated", state.systemInfo);
  },
  SET_IPX: (state, isIpx) => {
    state.isIpx = isIpx;
  }
};

const getters = {
  options: state => {
    const optionsInterface = {
      path: "",
      query: {
        scene: ""
      }
    };
    return Object.assign(optionsInterface, state.options);
  },
  systemInfo: state => {
    return state.systemInfo;
  },
  wechatInfo: state => {
    console.log("APP: WECHAT INFO:", state.wechatInfo);
    return state.wechatInfo;
  },
  hasWechatInfo: state => {
    return JSON.stringify(state.wechatInfo) !== "{}";
  },
  isIpx: state => {
    return state.isIpx;
  },
  hasLoggedIn: (state, getters, rootState, rootGetters) => {
    const hasUserInfo = JSON.stringify(rootGetters["user/userInfo"]) !== "{}";
    const hasUserId = !!rootGetters["user/userId"];
    return (
      rootState.token &&
      rootState.token.length > 10 &&
      //    rootState.token !== config.token &&
      hasUserInfo &&
      hasUserId
    );
  },
  hasAuth: (state, getters, rootState, rootGetters) => {
    const hasAuth = rootGetters["user/authorizeType"]
    return hasAuth;
  }
};

const actions = {
  setSystemInfo: ({ commit }, info) => {
    commit("SET_SYSTEM_INFO", JSON.parse(JSON.stringify(info)));
    if (info && info.model) {
      commit("SET_IPX", info.model.includes("iPhone X"));
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
