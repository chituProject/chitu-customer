<template>
  <container>
    <div class="container _100vh">
      <img
        style="width:121px; height:99px;margin:12vw 0;"
        src="/static/img/logo.png"
      />
      <div class="full flex-jusitfy_center text">
        授权登陆失败
        <div>联系经理：{{ admin.fund_name }}</div>
        <div>联系电话：{{ admin.phone }}</div>
        <div>联系邮箱：{{ admin.email }}</div>
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
      admin: {
        fund_name: "",
        phone: "",
        email: ""
      }
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
    if (this.hasLoggedIn) {
      this.getAdmin();
    }
    //   this.getAdmin();
  }
};
</script>

<style scoped lang="scss">
._100vh {
  justify-content: center;
}
.text {
  text-align: center;
  font-size: 48upx;
  div {
    margin: 12upx 0;
    font-size: 32upx;
  }
}
</style>
