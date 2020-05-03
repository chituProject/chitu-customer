<template>
  <div class="container page-padding">
    <div style="width: 100%;height: 100vh;position: fixed;top:0;background-color: #2D3132;z-index: -1;"></div>
    <p v-if="BankCards.length===0" style="height:250px;line-height:410px;">
      请联系我们的工作人员添加银行卡
    </p>
    <div v-else class="box">
      <div v-for="(card,i) in BankCards" :id="i" :key="i" class="bankcard flex" :style="{ 'background-color': bank[card.bank]?bank[card.bank].color:'#aaa', 'margin-left': selectId===i ? -delta+'px': '0px', 'margin-right': selectId===i ? delta+'px': '0px',}" @touchstart.prevent="touchS" @touchmove.prevent.stop="touchM" @touchend.prevent="touchE">
        <div class="icon-warp">
          <img v-if="bank[card.bank]" class="icon-22" :src="bank[card.bank].src" style="margin-top:3.5px;">
        </div>
        <div style="flex:1">
          <div class="fs-15 white-color">{{card.bank}}&nbsp;{{card.bank_type}}</div>
          <div class="fs-14 white-color">尾号{{card.card_tail}}</div>
        </div>
        <img v-if="BankId === i && (selectId!==i || delta === 0)" style="margin-right:10px;opacity:0.5;" src="/static/img/icons/check.svg" class="icon-15">
      </div>
    </div>
    <div class="flex addcard">
      <div style="color:#7f8082;font-size:14px;margin-left:27px;">请联系客服添加或修改支付账户信息</div>
      <!-- <img style="width:9px;height:13px;margin-right:27px;" src="/static/img/icons/right.png"> -->
    </div>
  </div>
</template>

<script>
import { navigateTo } from '@/utils/adapter';
import Bank from '../../../static/data/bank.json';

export default {
  data() {
    return {
      bank: Bank,
      delta: 0,
      selectId: -1,
    };
  },
  components: {
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
    BankCards() {
      return this.$store.state.bankCards;
    },
    BankId() {
      return this.$store.state.bankId;
    },
  },
  methods: {
    navAdd() {
      navigateTo({ url: '/pages/apply/sicpay/main?scene=EDIT' });
    },
    touchS(e) {
      console.log(e.currentTarget.id);
      if (e.touches.length === 1) {
        // 设置触摸起始点水平方向位置
        this.startX = e.touches[0].clientX;
        // 设置当前点击的银行卡
        this.selectId = parseInt(e.currentTarget.id, 10);
      }
    },
    // 滑动中事件
    touchM(e) {
      if (e.touches.length === 1) {
        // 手指移动时水平方向位置
        const moveX = e.touches[0].clientX;
        // 手指起始点位置与移动期间的差值
        const disX = this.startX - moveX;
        if (disX > 0 && disX < 50) {
          this.delta = disX;
        } else if (disX >= 50) {
          this.delta = 50;
        } else if (disX < 0) {
          this.delta = 0;
        }
        // console.log(disX);
      }
    },
    touchE() {
      if (this.delta > 25) {
        this.delta = 50;
      } else {
        this.delta = 0;
      }
    },
    getBankCards() {
      if (this.Reseller && this.Reseller.default_card_no) {
        const card = {
          bank: this.Reseller.default_card_bank,
          card_tail: this.Reseller.default_card_no.slice(-4),
          bank_type: this.Reseller.sicpay_type === 'PRIVATE' ? '对私账户' : '对公账户',
        };
        this.$store.commit('SET_BANKCARDS', [card]);
      }
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    this.getBankCards();
  },
};
</script>

<style scoped>
.bankcard{
  height:100px;
  margin-bottom:12px;
  border-radius: 6px;
}
.icon-warp{
  margin: 2px 11px;
  opacity:0.85;
  width: 29px;
  height: 30px;
  border-radius: 30px;
  background-color: #fff;
  text-align: center;
}
.delete{
  text-align: center;
  line-height: 100px;
  color:#f93442;
  font-size:15px;
  background: white;
  /* border-top-right-radius: 6px;
  border-bottom-right-radius: 6px; */
  width:64px;
  height:100px;
  position:absolute;
  right:-48px;
}
.addcard {
  height:46px;
  width:100vw;
  background-color:#313536;
  margin-bottom:32.5px;
}
</style>
