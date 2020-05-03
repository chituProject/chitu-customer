<template>
  <div>
    <div class="flex _input-warpper">
      <input type="number" class="input-text" placeholder="手机号码*"
             v-model.trim="phoneData" maxlength="11" @input="changePhone"/>
      <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
              class="btn btn-main btn-normal _btn-right">
        点击获取手机号
      </button>
    </div>
    <div class="flex _input-warpper">
      <input type="number" class="input-text" placeholder="手机验证码*" v-model.trim="code"
             maxlength="4" @input="changeCode"/>
      <button @click.prevent.stop="sendSMS" class="btn btn-normal _btn-right"
              :class="{'btn-grey': disableSMS, 'btn-main': !disableSMS,}">
        {{btnText}}
      </button>
    </div>
  </div>
</template>

<script>
import { isPhone } from '@/utils/index';
import { reLogin, vibrateShort, httpRequest } from '@/utils/adapter';

export default {
  props: {
    phone: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      phoneData: '',
      btnText: '获取验证码',
      timer: null,
      code: '',
      disable: false,
      disableSMS: false,
    };
  },
  watch: {
    phone(val) {
      this.phoneData = val;
    },
  },
  mounted() {
    this.phoneData = this.phone;
  },
  methods: {
    getPhoneNumber(e) {
      reLogin(() => this.decrypt(e));
    },
    decrypt(e) {
      httpRequest({
        url: 'reseller/decrypt/',
        method: 'GET',
        data: {
          encryptedData: e.mp.detail.encryptedData,
          iv: e.mp.detail.iv,
        },
        success: (res) => {
          // console.log(res.data);
          if (res.statusCode > 199 && res.statusCode < 300) {
            this.phoneData = res.data.purePhoneNumber;
            this.$emit('input-phone', this.phoneData);
          } else {
            reLogin();
          }
        },
      });
    },
    sendSMS() {
      vibrateShort();
      if (this.disableSMS) {
        return;
      }
      this.disableSMS = true;
      if (!isPhone(this.phoneData)) {
        this.disableSMS = false;
        return;
      }
      httpRequest({
        url: 'reseller/verify_code/',
        method: 'POST',
        data: {
          phone: this.phoneData,
        },
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            const num = 60;
            if (!this.timer) {
              this.count = num;
              this.btnText = `剩余${this.count}秒`;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= num) {
                  this.count -= 1;
                  this.btnText = `剩余${this.count}秒`;
                } else {
                  this.disableSMS = false;
                  this.btnText = '获取验证码';
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.disableSMS = false;
          }
        },
      });
    },
    changeCode() {
      this.$emit('input-code', +this.code);
    },
    changePhone() {
      this.$emit('input-phone', this.phoneData);
    },
  },
};
</script>

<style scoped>
._input-warpper{
  width: calc(100vw - 30px);
  margin: 15px 0;
}
.input-text{
  font-size: 14px;
  padding-left:12px;
  width: calc(100vw - 24px);
  height: 44px;
  background-color: #fff;
  border: solid 1px #d8d8d8;
}
._btn-right{
  max-width: 140px;
  padding: 0 6px;
  margin: 0 6px;
  border-radius:6px;
}
</style>
