/* eslint-disable import/prefer-default-export */
import { mapGetters } from "vuex";
import { offpayAuth } from "./offpay";
import { navigateTo } from "./adapter";

export const authMixin = {
  computed: {
    ...mapGetters("app", ["hasLoggedIn", "options", "hasAuth"])
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  async onShow() {
    const qrScene = this.options.query.scene;
    if (!this.$store.state.scene && qrScene) {
      this.$store.commit("SET_SCENE", qrScene);
    }
    // const pages = getCurrentPages();
    // const currentPage = pages[pages.length - 1].route;
    await uni.getSetting().then(([_, res]) => {
      if (res && res.authSetting["scope.userInfo"] && !this.hasLoggedIn) {
        // 老用户
        offpayAuth();
      } else if (!this.hasLoggedIn) {
        offpayAuth();
      } else if (!this.hasAuth) {
        navigateTo({ url: "/pages/wxauth/auth" });
      }
    });
  }
};

// vue官方给出的mixin是合并策略,如果当前有同名函数,会进行数组合并
// uni-app的策略貌是替换同名函数
export const shareMixinDefault = {
  computed: {
    ...mapGetters("user", ["user"]),
    resellerUser() {
      return this.$store.state.resellerUser;
    }
  },
  onShareAppMessage() {
    wx.showShareMenu({
      withShareTicket: true
    });
    let path = "/pages/online/index/main?";
    return {
      title: "购物即免单！优质生活，这次我请！",
      imageUrl: "/static/img/redPacket/card.png",
      path
    };
  }
};
