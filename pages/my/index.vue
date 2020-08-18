<template>
  <container>
    <van-notify id="van-notify" />
    <loading-animation :show-animation="showAnimation" />
    <div class="container">
      <div class="background" />
      <div class="bg-blend">
        <div
          v-if="scope.user"
          class="full-vw flex-justify_start"
          style="align-items:center"
        >
          <div class="userinfo-avatar">
            <open-data type="userAvatarUrl" />
          </div>
          <div>
            <div class="flex-justify_start" style="align-items:center;">
              <open-data class="user-name" type="userNickName" lang="zh_CN" />
            </div>
            <button class="vip-btn">
              VIP
            </button>
          </div>
        </div>
        <div
          v-else
          class="full-vw flex-justify_start"
          style="align-items:center"
        >
          <div class="userinfo-avatar">
            <button
              class="user-name"
              open-type="getUserInfo"
              @getuserinfo="onGotUserInfo"
            >
              <img
                style="width: 120rpx; height: 120rpx;"
                src="/static/img/placeholder-avatar.png"
              />
            </button>
          </div>
          <button
            class="user-name"
            open-type="getUserInfo"
            @getuserinfo="onGotUserInfo"
          >
            点击登录
          </button>
        </div>
      </div>
      <van-cell-group style="width: 100%;margin-top:12px;">
        <van-cell
          title="我的收藏"
          icon="like-o"
          size="large"
          is-link
          link-type="navigateTo"
          url="/pages/my/collect"
        />
      </van-cell-group>
      <van-cell-group style="width: 100%;margin-top:12px;">
        <van-cell title="关于赤兔" icon="info-o" size="large" />
      </van-cell-group>
    </div>
  </container>
</template>

<script>
import { mapGetters } from "vuex";
import { navigateTo, notify } from "@/utils/adapter";
import { fetchUserInfo, offpayAuth } from "@/utils/offpay";
import { authMixin } from "@/utils/mixins";
import config from "@/utils/config.json";
import loadingAnimation from "@/components/loadingAnimation";

export default {
  components: {
    loadingAnimation
  },
  mixins: [authMixin],
  data() {
    return {
      config,
      showAnimation: false
    };
  },
  computed: {
    ...mapGetters("user", ["scope", "user", "userInfo"])
  },
  onShow() {
    if (this.user.scopeUser) {
      fetchUserInfo();
    }
  },
  onShareAppMessage() {
    wx.showShareMenu({
      withShareTicket: true
    });
    return {
      title: "赤兔小程序",
      path: "/pages/online/index/main"
    };
  },
  methods: {
    introduction() {
      this.nav("/pages/mycenter/offpay/introduction/main");
    },
    nav(url) {
      navigateTo({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    onGotUserInfo(e) {
      if (e.mp.detail.userInfo) {
        this.$store.commit("app/SET_WECHAT_INFO", e.mp.detail.userInfo);
        offpayAuth();
      } else {
        notify("已拒绝");
      }
    }
  }
};
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.dialog-container {
  margin: auto;
  width: 375rpx;
  background: #ffffff;
  border-radius: 16rpx;
  position: relative;
}
.bg-blend {
  width: 100%;
  background-image: linear-gradient(-39deg, #d03d3d 0%, #d03d3d 100%),
    linear-gradient(#ffffff, #ffffff);
}

.vip-btn {
  color: white;
  border: 1px #b62e2d solid;
  font-size: 26rpx;
  line-height: 46rpx;
  border-radius: 32rpx;
  background-color: #df3f3f;
  margin: 20rpx 20rpx 0;
}

.userinfo-avatar {
  overflow: hidden;
  width: 120rpx;
  height: 120rpx;
  margin: 80rpx 24rpx;
  border-radius: 20rpx;
}

.user-name {
  font-size: 30rpx;
  color: white;
  line-height: 30rpx;
  background: transparent;
}
</style>
