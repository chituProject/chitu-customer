<template>
  <container>
    <van-notify id="van-notify" />
    <div class="container _100vh">
      <div
        class="full"
        style="text-align:center;align-items:center;justify-content: center;"
      >
        <img
          style="margin-bottom:20px;width:121px; height:99px;"
          src="/static/img/logo.png"
        />
        <button
          :disabled="disable"
          :class="{ _opacity: disable }"
          class="btn btn-main btn-full btn-radius button"
          open-type="getUserInfo"
          @getuserinfo="onGotUserInfo"
        >
          微信登录
        </button>
      </div>
    </div>
  </container>
</template>

<script>
import { mapGetters } from "vuex";
import { navigateBack, notify } from "@/utils/adapter";
import { offpayAuth } from "@/utils/offpay";

export default {
  data() {
    return {
      disable: false
    };
  },
  computed: {
    ...mapGetters("app", ["options"])
  },
  mounted() {
    const qrScene = this.options.query.scene;
    if (!this.$store.state.scene && qrScene) {
      this.$store.commit("SET_SCENE", qrScene);
    }
  },
  methods: {
    onGotUserInfo(e) {
      this.disable = true;
      /* 下面是授权逻辑 */
      // 用户按了允许授权按钮
      if (e.mp.detail.userInfo) {
        this.$store.commit("app/SET_WECHAT_INFO", e.mp.detail.userInfo);
        offpayAuth()
          .then(() => {
            this.disable = false;
            navigateBack({ delta: 1 });
          })
          .catch(err => {
            this.disable = false;
            console.log(err);
          });
      } else {
        this.disable = false;
        // 用户按了拒绝按钮
        notify("已拒绝");
      }
    }
  },
  onShow() {
    this.disable = false;
  }
};
</script>

<style scoped>
._opacity {
  opacity: 0.6;
}
.userinfo-avatar {
  overflow: hidden;
  width: 60px;
  height: 60px;
  margin: auto;
  padding: 15px;
  border-radius: 10px;
}
._100vh {
  height: 100vh;
  justify-content: center;
}
</style>
