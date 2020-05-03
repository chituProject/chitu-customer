<script>
import { httpRequest, showToast, reLaunch, getSystemInfo, redirectTo, navigateTo, register, login } from '@/utils/adapter';
import './static/css/resetcss.css';
import './static/css/weui.css';
import './static/css/mdj.css';

export default {
  methods: {
    getReseller(token) {
      login({
        success: () => {
          httpRequest({
            url: 'reseller/',
            header: { opa: token },
            method: 'get',
            success: (res) => {
              if (res.data[0]) {
                this.$store.commit('SET_RESELLER', res.data[0]);
                if (res.data[0].status === 'AUDITED') {
                  reLaunch({ url: '/pages/account/index/main' });
                } else if (res.data[0].status === 'UNAUDITED') {
                  navigateTo({ url: '/pages/hint/word/main?num=0' });
                } else if (res.data[0].status === 'AUDIT_FAILED') {
                  navigateTo({ url: '/pages/hint/word/main?num=1' });
                }
              } else {
                reLaunch({ url: '/pages/welcome/main' });
              }
            },
          });
        },
      });
    },
    getUserInfo(token) {
      const that = this;
      login({
        success: () => {
          httpRequest({
            url: 'auth/',
            header: { opa: token },
            method: 'get',
            success: (res) => {
              console.log('user:', res);
              that.$store.commit('SET_UUID', res.data.user.uuid);
              that.$store.commit('SET_OPENID', res.data.user.openid);
            },
          });
        },
      });
    },
  },
  onLaunch() {
    const that = this;
    console.log('miniapp launched?');

    getSystemInfo({
      success: (res) => {
        console.log('model: ', res.model);
        this.$store.commit('SET_SYSTEM_INFO', res);
        this.$store.state.isIpx = res.model.indexOf('iPhone X') >= 0;
      },
    });
    if (this.$store.state.token === '') {
      login({
        success: (res) => {
          if (res.code) {
            console.log(res.code);
            httpRequest({
              url: 'auth/',
              data: {
                code: res.code,
                mode: 'mini',
              },
              method: 'POST',
              success: (res2) => {
                if (res2.statusCode === 200 || res2.statusCode === 201) {
                  that.$store.commit('SET_TOKEN', res2.data.token);
                  that.getReseller(res2.data.token);
                  that.getUserInfo(res2.data.token);
                } else if (res2.statusCode === 403) {
                  redirectTo({ url: '/pages/welcome/main' });
                  if (res2.data.openid) {
                    that.$store.commit('SET_OPENID', res2.data.openid);
                    wx.getSetting({
                      success: (res0) => {
                        console.log('getSetting', res0);
                        if (res0.authSetting['scope.userInfo']) {
                          wx.getUserInfo({
                            success: (res1) => {
                              that.$store.commit('SET_USERINFO', res1.userInfo);
                              register(res1.userInfo);
                            },
                          });
                        } else {
                          showToast({ title: '请先授权', icon: 'none' });
                        }
                      },
                    });
                  }
                }
              },
            });
          }
        },
      });
    }
  },
};
</script>
