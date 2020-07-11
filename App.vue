<script>
import { getSystemInfo } from "@/utils/adapter";
import { cleanFormId } from "@/utils/offpay";
import "./static/css/resetcss.css";
// import "./static/css/weui.css";
import "./static/css/mdj.css";

export default {
  computed: {
    token() {
      return this.$store.state.token;
    },
    options: {
      get() {
        return this.$store.getters.app.options;
      },
      set(value) {
        this.$store.commit("app/SET_OPTIONS", value);
      }
    }
  },
  onLaunch(options) {
    console.log("onLaunch:", options);
    this.options = options;

    getSystemInfo({
      success: res => {
        this.$store.dispatch("app/setSystemInfo", res);
      }
    });
  },
  onHide() {
    console.log("Hide App");
    cleanFormId();
  }
};
</script>

<style></style>
