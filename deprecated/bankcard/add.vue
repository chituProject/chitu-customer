<template>
  <div class="container">
    <div class="background"></div>

    <div class="box" style="background-color:#fff;margin-top:17.5px;">
      <div class="box flex-justify_start _adjust" style="padding:28px 12px 20px;">
        <h3 style="width:64px;">持卡人</h3>
        <input type="text" placeholder="请输入持卡人姓名" v-model.trim="Reseller.username" maxlength="18"/>
      </div>
      <hr>
      <div class="box flex-justify_start _adjust">
        <h3 style="width:64px;">卡号</h3>
        <input type="number" placeholder="请输入银行卡号" v-model.trim="card" maxlength="19"/>
      </div>
      <hr>
      <!-- <div class="box flex-justify_start _adjust">s
      <h3 style="width:64px;">卡类型</h3>
      <div class="fs-14 grey66-color">{{cardBank}} {{cardType}}</div>
    </div>
    <hr> -->
      <div class="box flex-justify_start _adjust">
        <h3 style="width:64px;margin-right:12px;">身份证号</h3>
        <input type="idcard" placeholder="请输入身份证号" v-model.trim="Reseller.idcard" maxlength="18"/>
      </div>
      <hr>
      <div class="box flex-justify_start _adjust">
        <h3 style="width:64px;margin-right:12px;">手机号</h3>
        <div class="box flex">
          <input type="number" placeholder="请输入银行卡预留手机号码" v-model.trim="phone" maxlength="11" style="width:150px;"/>
          <button @click="sendSMS" :class="{'btn-grey': disableSMS, 'btn-main': !disableSMS,}" class="btn btn-xs btn-radius-6" style="margin:0 12px 0 0;border:0;">{{btnText}}</button>
        </div>
      </div>
      <hr>
      <div class="box flex-justify_start _adjust" style="margin-top:6px;margin-bottom:8px;">
        <h3 style="width:64px">验证码</h3>
        <input type="number" style="width:150px;" placeholder="请输入验证码" v-model.trim="code" maxlength="4"/>
      </div>
    </div>
    <form class="box" style="padding:45px 12px;" @submit="submitForm" report-submit='true'>
      <button :disabled="disableForm" form-type="submit" class="btn btn-main btn-full btn-radius-6">下一步</button>
    </form>
  </div>
</template>

<script>
import { isChinese, isIdcard, isPhone, isBankCard, isSmscode } from '@/utils/index';
import { httpRequest, redirectTo, cleanFormIds } from '@/utils/adapter';
import Banks from '../../../static/data/banks.json';

export default {
  data() {
    return {
      btnText: '获取验证码',
      timer: null,
      count: 0,
      banks: Banks,
      card: '',
      cardBank: '不详',
      cardType: '储蓄卡',
      code: '',
      disableSMS: false,
      disableForm: false,
    };
  },
  components: {
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  methods: {
    getBank(card) {
      for (const key in this.banks) {
        if (Object.prototype.hasOwnProperty.call(this.banks, key)) {
          if (card.substring(0, key.length) === key) {
            this.cardBank = this.banks[key].bank;
            this.cardType = this.banks[key].type;
            break;
          }
        }
      }
    },
    checkUserValid() {
      if (!isChinese(this.Reseller.username)) {
        return false;
      }
      if (!isIdcard(this.Reseller.idcard)) {
        return false;
      }
      if (!isPhone(this.phone)) {
        return false;
      }
      return true;
    },
    checkBankValid() {
      if (!isBankCard(this.card)) {
        return false;
      }
      if (!isSmscode(this.code)) {
        return false;
      }
      return true;
    },
    sendSMS() {
      this.disableSMS = true;
      if (!isPhone(this.phone)) {
        this.disableSMS = false;
        return;
      }
      httpRequest({
        url: 'bankcard/verify_code/',
        method: 'POST',
        data: {
          phone: this.phone,
        },
        success: (res) => {
          console.log(res);
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
    submitForm(e) {
      this.$store.dispatch('addFormId', e.target.formId);
      this.disableForm = true;
      if (!this.checkUserValid()) {
        this.disableForm = false;
        return;
      }
      if (!this.checkBankValid()) {
        this.disableForm = false;
        return;
      }
      if (this.cardBank === '不详') {
        this.getBank(this.card);
      }
      httpRequest({
        url: 'bankcard/',
        method: 'POST',
        data: {
          code: this.code,
          name: this.Reseller.username,
          card: this.card,
          bank: this.cardBank,
          bank_type: this.cardType,
          phone: this.phone,
          idcard: this.Reseller.idcard,
        },
        success: (res) => {
          console.log(res);
          this.disableForm = false;
          if (res.statusCode > 199 && res.statusCode < 300) {
            cleanFormIds();
            redirectTo({ url: `/pages/hint/button/main?bank=${this.cardBank}&type=${this.cardType}` });
          }
        },
      });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
};
</script>

<style scoped>
._adjust{
  padding-left:12px;
  height:40px;
}
</style>
