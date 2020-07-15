const state = {
  /**
   * userInfo
   * GET /customer/user
   */
  info: {},
  /**
   * User
   * customer_id: 242
   * type: "CUSTOMER"
   * username: 微信用户oZvvx5NKCP9hJTzkdf5qbJxv3t2U"
   * uuid: "60b574ef-6d93-4560-9385-d8ac16be92b2"
   */
  user: {},
  scope: {
    user: true
  },
  collectId: -1
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
    console.log("user updated: ", state.user);
  },
  SET_USER_INFO: (state, info) => {
    state.info = info;
    console.log("userInfo updated: ", state.info);
  },
  SET_PHONE_NUMBER: (state, phone) => {
    if (state.info) state.info.wechat_phone_number = phone;
  },
  SET_SCOPE_USER: (state, status) => {
    state.scope.user = status;
    console.log("user authorize status updated: ", state.scope.user);
  },
  SET_COLLECTID: (state, status) => {
    state.collectId = status;
    console.log("user collectId updated: ", state.collectId);
  }
};

const getters = {
  user: state => {
    return state.user;
  },
  userInfo: state => {
    return state.info;
  },
  userId: state => {
    return state.user && state.user.uuid;
  },
  scope: state => {
    return state.scope;
  },
  authorizeType: state => {
    console.log(state.info);
    return state.info && state.info.authorize_type === "ON";
  },
  phone: (state, getters) => {
    return getters.userInfo.wechat_phone_number;
  },
  collectId: state => {
    return state.collectId;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
