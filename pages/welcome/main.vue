<template>
  <div class="container _vh100 page-padding" style="justify-content: center;">
    <img style="width:105px; height:47px;margin-bottom:20vh;" src="/static/img/logo.png"/>
    <!-- <button v-if="!Token" class="btn btn-main btn-full btn-radius-6" open-type="getUserInfo" @getuserinfo="onRegister">线上入驻</button>
    <button v-else class="btn btn-main btn-full btn-radius-6" @click="onApply('/pages/apply/main?type=ONLINE')">线上入驻</button> -->
    <button v-if="!Token" class="btn btn-main btn-full btn-radius-6" open-type="getUserInfo" @getuserinfo="onRegister">线下入驻</button>
    <button v-else class="btn btn-main btn-full btn-radius-6" @click="onApply('/pages/apply/offpay/main?type=OFFLINE')">线下入驻</button>
    <button v-if="!Token" class="btn btn-main-reverse btn-full btn-radius-6" open-type="getUserInfo" @getuserinfo="onRegister">扫码绑定</button>
    <button v-else class="btn btn-main-reverse btn-full btn-radius-6"  @click="onScanQrCode">扫码绑定</button>
  </div>
</template>

<script>
import { navigateTo, scanCode, httpRequest, reLaunch, showToast, reRegister } from '@/utils/adapter';

export default {
  data() {
    return {
    };
  },
  computed: {
    Token() {
      return this.$store.state.token;
    },
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  methods: {
    navi(status) {
      if (status === 'AUDITED') {
        reLaunch({ url: '/pages/account/index/main' });
      } else if (status === 'UNAUDITED') {
        navigateTo({ url: '/pages/hint/word/main?num=0' });
      } else if (status === 'AUDIT_FAILED') {
        navigateTo({ url: '/pages/hint/word/main?num=1' });
      }
    },
    getReseller() {
      httpRequest({
        url: 'reseller/',
        method: 'get',
        success: (res) => {
          if (res.data[0]) {
            this.$store.commit('SET_RESELLER', res.data[0]);
            if (res.data[0].status === 'AUDITED') {
              reLaunch({ url: '/pages/account/index/main' });
            }
          }
        },
      });
    },
    onRegister(e) {
      if (!this.Token) {
        this.$store.commit('SET_USERINFO', e.mp.detail.userInfo);
        reRegister(e.mp.detail.userInfo);
      }
    },
    onApply(url) {
      this.navi(this.Reseller.status);
      // 加上这句以免 this.Reseller 为空
      navigateTo({ url });
    },
    onScanQrCode() {
      scanCode({
        success: (res) => {
          console.log('QRcode:', res);
          httpRequest({
            url: `reseller/${res.result}/bind/`,
            data: {},
            method: 'POST',
            success: (res2) => {
              if (res2.statusCode > 199 && res2.statusCode < 300) {
                showToast({ title: `您已成功绑定店铺：${res2.data.name}` });
                this.$store.commit('SET_RESELLER', res2.data);
                setTimeout(() => {
                  this.navi(res2.data.status);
                }, 500);
              }
            },
          });
        },
      });
    },
  },
  onShow() {
    console.log('token:', this.Token);
    if (this.Token) {
      this.getReseller();
    }
  },
};
</script>

<style scoped>
._vh100{
  height:100vh;
}
</style>
