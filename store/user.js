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
  user: {}
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
  authorizeType: state => {
    console.log(state.info)
    return state.info && state.info.authorize_type === "ON";
  },
  phone: (state, getters) => {
    return getters.userInfo.wechat_phone_number;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
