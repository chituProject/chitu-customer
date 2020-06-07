const state = {
  // 首次在线下入口点击商品详情
  firstClick: false,

  // 停留5秒埋点
  firstFivesecs: false,

  // 初次进入App
  firstEnter: false,

  // 搜索关键词，暂时不用
  keyword: "搜索"
};

const getters = {
  firstEnter: state => {
    return state.firstEnter;
  },
  firstClick: state => {
    return state.firstClick;
  },
  firstFivesecs: state => {
    return state.firstFivesecs;
  },
  keyword: state => {
    return state.keyword;
  }
};

const mutations = {
  SET_SEARCH_DEFAULT: (state, keyword) => {
    state.keyword = keyword;
  },
  SET_ENTER: state => {
    state.firstEnter = true;
  },
  SET_CLICK: state => {
    state.firstClick = true;
  },
  SET_FIVESECS: state => {
    state.firstFivesecs = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
