<template>
  <container>
    <van-notify id="van-notify" />
    <div class="container _100vh">
      <div
        class="full"
        style="text-align:center;align-items:center;justify-content: center;font-size: 36upx"
      >
        授权登陆失败<br /><br />
        <span v-if="admin !== '{}'">联系经理：{{admin.fund_name}}</span><br />
        <span v-if="admin !== '{}'">联系电话：{{admin.phone}}</span><br />
        <span v-if="admin !== '{}'">联系邮箱：{{admin.email}}</span>
      </div>
    </div>
  </container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      disable: false,
      login: false,
      admin: {}
    };
  },
  computed: {
    ...mapGetters("app", ["options", "hasLoggedIn", "hasAuth"])
  },
  watch: {
    hasLoggedIn(val) {
      if (val) {
        this.getAdmin();
      }
    }
  },
  mounted() {
    this.disable = true;
    const qrScene = this.options.query.scene;
    if (!this.$store.state.scene && qrScene) {
      this.$store.commit("SET_SCENE", qrScene);
    }
  },
  methods: {
    getAdmin() {
      this.$request({
        url: "fund_contact/"
      }).then(res => {
        if (res[1].data.length > 0) {
          this.admin = res[1].data[0];
        }
        this.disable = false;
      });
    }
  },
  onShow() {
    // this.disable = false;
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
  height: 75vh;
  justify-content: center;
}
span {
  font-size: 32upx;
}
</style>
