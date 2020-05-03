/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { cleanFormId } from '@/utils/adapter';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    isCreateFailed: false,
    bankCards: [],
    bankId: 0,
    token: '',
    openid: '',
    uuid: '',
    reseller: {},
    formIds: [],
    systemInfo: {},
    userInfo: {},
  },
  mutations: {
    SET_CREATE_FAILED: (state, flag) => {
      state.isCreateFailed = flag;
      console.log('isCreateFailed updated: ', flag);
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
      console.log('token updated: ', token);
    },
    SET_OPENID: (state, openid) => {
      state.openid = openid;
      console.log('openid updated: ', openid);
    },
    SET_UUID: (state, uuid) => {
      state.uuid = uuid;
      console.log('uuid updated: ', uuid);
    },
    SET_SYSTEM_INFO: (state, info) => {
      state.systemInfo = info;
      console.log('system_info updated: ', info);
    },
    SET_USERINFO: (state, info) => {
      state.userInfo = info;
      console.log('userInfo updated: ', info);
    },
    SET_BANKCARDS: (state, bankCards) => {
      state.bankCards = bankCards;
      console.log('bankCards updated: ', bankCards);
    },
    SET_SELECTED_BANK: (state, bankId) => {
      state.bankId = bankId;
      console.log('SELECTED_BANK updated: ', bankId);
    },
    SET_RESELLER: (state, reseller) => {
      state.reseller = reseller;
      console.log('RESELLER updated: ', reseller);
    },
    ADD_FORMID: (state, id) => {
      state.formIds.push(id);
      console.log('formIds updated: ', state.formIds);
    },
    CLEAN_FORMID: (state) => {
      state.formIds = [];
      console.log('formIds cleaned');
    },
  },
  actions: {
    addFormId: ({ commit, state }, id) => {
      if (id) {
        commit('ADD_FORMID', id);
      }
      // 每1个formID发一次
      if (state.formIds && state.formIds.length > 0) {
        cleanFormId();
      }
    },
  },
});

export default store;
