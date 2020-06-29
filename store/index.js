import Vue from "vue";
import Vuex from "vuex";
import config from "@/utils/config.json";
import { cleanFormId } from "@/utils/offpay";

import app from "./app";
import user from "./user";
import utils from "./utils";

Vue.use(Vuex);

export const state = {
  scene: "",
  token: config.token,
  formIds: []
};

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
    console.log("token updated: ", state.token);
  },
  // 设置场景值
  SET_SCENE: (state, scene) => {
    console.log("set scene: ", scene);
    state.scene = scene;
  },
  ADD_FORMID: (state, id) => {
    state.formIds.push(id);
    console.log("formIds updated: ", state.formIds);
  },
  CLEAN_FORMID: state => {
    state.formIds = [];
    console.log("formIds cleaned");
  }
};

const store = {
  modules: {
    app,
    user,
    utils
  },
  state,
  mutations,
  actions: {
    addFormId: ({ commit, state }, id) => {
      if (id) {
        commit("ADD_FORMID", id);
      }
      // 每三个formID发一次
      if (state.formIds && state.formIds.length > 3) {
        cleanFormId();
      }
    }
  }
};

export default new Vuex.Store(store);

export { store as storeObj };
