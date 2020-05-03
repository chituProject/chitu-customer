<template>
  <div class="container page-padding">
    <div class="background"></div>
    <div style="margin-top: 24%;">
      <hr style="margin:0;border-top:1px solid #ecebeb;height:0px;">
      <div class="flex" style="background-color:#f9f9f9;height:36px;padding:15px 12px;" @click="navBankcard()">
        <div v-if="BankCards.length>0">
          <div class="flex">
            <img v-if="bankList[BankCards[BankId].bank]" class="icon-12h" :src="bankList[BankCards[BankId].bank].src" style="margin-top:-22px;margin-right:12px;">
            <div>
              <div class="fs-14 grey39-color">{{BankCards[BankId].bank}} 尾号{{BankCards[BankId].card_tail}}</div>
              <div class="fs-12 grey66-color">预计2小时内到账</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="fs-14 grey39-color">去添加银行卡</div>
          <div class="fs-12 grey66-color">预计2小时内到账</div>
        </div>
        <div class="arrow-right"></div>
      </div>
      <div class="box background-white wrapper" >
        <div class="text">提现金额</div>
        <div class="_priceInput flex">
          <div class="_adjust">￥</div>
          <input maxlength="9" @input="inputNormailize" type="digit" step="0.01" class="_input" v-model="price"/>
        </div>
        <hr style="margin-left:0;margin-right:0;">
        <p class="explain">可提现金额{{Amount | formatPrice}},<span class="color-main" @click="topUpAll">全部提现</span></p>
        <p class="explain">提现金额需大于手续费（¥{{ serviceFee | formatPrice }}）</p>
        <form @submit="confirmTopup" report-submit='true'>
          <button v-if="disable || !isValid" :class="{_opacity:!isValid}" class="btn btn-main btn-full btn-radius-6 button">确认提现</button>
          <button v-else :class="{_opacity:!isValid}" class="btn btn-main btn-full btn-radius-6 button" form-type="submit">确认提现</button>
        </form>
      </div>
    </div>
    <modal :price="deformatPrice" :service-fee="serviceFee" :visible="showModal" @confirm="doTopup" @cancel="showModal = false; disable = false"></modal>
  </div>
</template>

<script>
import { navigateTo, redirectTo, httpRequest, getQuery, cleanFormId } from '@/utils/adapter';
import Modal from './modal';
import Bank from '../../../static/data/bank.json';

// 提现手续费5毛
const SERVICE_FEE = 50;

export default {
  components: {
    Modal,
  },
  data() {
    return {
      query: {},
      withdralType: ['EARNEST', 'OFFPAY', 'REBATE', 'ALL'],
      bankList: Bank,
      price: '',
      disable: false,
      isValid: false,
      showModal: false,
    };
  },
  computed: {
    Amount() {
      return this.query.amount || 0;
    },
    BankCards() {
      return this.$store.state.bankCards;
    },
    BankId() {
      return this.$store.state.bankId;
    },
    Reseller() {
      return this.$store.state.reseller;
    },
    serviceFee: () => SERVICE_FEE,
    deformatPrice() {
      return Number(parseFloat(this.price * 100).toPrecision(15));
    },
  },
  methods: {
    inputNormailize(e) {
      const setPrice = price => this.$nextTick(() => { this.price = price; });
      const serviceFeeFloat = this.serviceFee / 100;
      if (e.target.value === '.') {
        setPrice('0.');
      } else {
        const reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
        if (reg.test(e.target.value)) {
          setPrice(this.price.replace(reg, '$2$3$4'));
          const p = parseFloat(e.target.value, 10);
          if (p <= serviceFeeFloat || p > this.Amount / 100) {
            this.isValid = false;
          } else {
            this.isValid = true;
          }
        } else {
          setPrice('');
          this.isValid = false;
        }
      }
    },
    navBankcard() {
      if (this.BankCards && this.BankCards.length) {
        navigateTo({ url: '/pages/bankcard/list/main' });
      } else {
        navigateTo({ url: '/pages/apply/sicpay/main?scene=EDIT' });
      }
    },
    topUpAll() {
      if (this.Amount > 0) {
        this.price = this.Amount / 100;
        this.isValid = true;
      }
    },
    confirmTopup(e) {
      this.disable = true;
      this.$store.dispatch('addFormId', e.target.formId);
      if (!this.isValid) {
        this.disable = false;
        return;
      }
      if (this.BankCards.length === 0) {
        this.disable = false;
        this.navBankcard();
        return;
      }
      cleanFormId();
      this.showModal = true;
    },
    doTopup() {
      this.showModal = false;
      this.disable = true;
      if (!this.isValid) {
        this.disable = false;
        return;
      }
      if (this.BankCards.length === 0) {
        this.disable = false;
        this.navBankcard();
        return;
      }
      httpRequest({
        url: 'withdrawal/',
        method: 'POST',
        data: {
          type: 'OFFPAY_OFFLINE', // this.withdralType[this.query.type],
          mode: 'SICPAY',
          amount: this.deformatPrice,
        },
        success: (res) => {
          this.disable = false;
          if (res.statusCode > 199 && res.statusCode < 300) {
            redirectTo({ url: `/pages/topup/result/main?id=${res.data.id}` });
          }
        },
      });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    this.query = getQuery(this);
    if (this.Reseller && this.Reseller.default_card_no) {
      const card = {
        bank: this.Reseller.default_card_bank,
        card_tail: this.Reseller.default_card_no.slice(-4),
        bank_type: this.Reseller.sicpay_type === 'PRIVATE' ? '对私账户' : '对公账户',
      };
      this.$store.commit('SET_BANKCARDS', [card]);
    }
  },
};
</script>

<style scoped>
._opacity{
  opacity:0.6;
}
._priceInput{
  margin:20px 0px 0px 0px;
}
._input{
  font-size:30px;
  caret-color:#fb5e5e;
  height: 54px;
  color:#fb5e5e;
  text-align: left;
}
._adjust{
  line-height: 54px;
  margin-right:12px;
  font-size: 27px;
  color: #393939;
}
.text {
  font-size: 17px;
  color: #393939;
}
.wrapper {
  max-width: 384px;
  padding:17.5px 20px;
  border-radius: 3px;
}
.button {
  margin: 45px 0px;
  width:100%;
}
</style>
