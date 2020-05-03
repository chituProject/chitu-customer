<template>
  <div class="container page-padding">
    <div style="width: 100%;height: 100vh;position: fixed;top:0;background-color: #2D3132;z-index: -1;"></div>
    <p v-if="BankCards.length===0" style="height:250px;line-height:410px;">
      您还未添加过银行卡哦～
    </p>
    <div v-else class="box">
      <div v-for="(card,i) in BankCards" :id="i" :key="i" class="bankcard flex" :style="{ 'background-color': bank[card.bank]?bank[card.bank].color:'#aaa', 'margin-left': selectId===i ? -delta+'px': '0px', 'margin-right': selectId===i ? delta+'px': '0px',}" @click="select(i)" @touchstart.prevent="touchS" @touchmove.prevent.stop="touchM" @touchend.prevent="touchE">
        <div class="icon-warp">
          <img v-if="bank[card.bank]" class="icon-22" :src="bank[card.bank].src" style="margin-top:3.5px;">
        </div>
        <div style="flex:1">
          <div class="fs-15 white-color">{{card.bank}}&nbsp;{{card.bank_type}}</div>
          <div class="fs-14 white-color">尾号{{card.card_tail}}</div>
        </div>
        <img v-if="BankId === i && (selectId!==i || delta === 0)" style="margin-right:10px;opacity:0.5;" src="/static/img/icons/check.svg" class="icon-15">
        <div @click.stop="deleteCard" v-show="selectId===i && delta>0" :id="card.uuid" class="delete" :style="{ 'margin-left': -delta+'px', 'margin-right': delta + 'px',}">删除</div>
      </div>
    </div>
    <div @click="navAdd" class="flex" style="height:46px;width:100vw;background-color:#313536;margin-bottom:32.5px;">
      <div style="color:#7f8082;font-size:14px;margin-left:27px;">+添加银行卡</div>
      <img style="width:9px;height:13px;margin-right:27px;" src="/static/img/icons/right.png">
    </div>
  </div>
</template>

<script>
import { httpRequest, showModal, navigateBack, navigateTo } from '@/utils/adapter';
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
    select(id) {
      this.$store.commit('SET_SELECTED_BANK', id);
      navigateBack({ delta: 1 });
    },
    navAdd() {
      navigateTo({ url: '/pages/bankcard/add/main' });
    },
    deleteCard(e) {
      const that = this;
      console.log(e);
      showModal({
        title: '您确定要删除此银行卡吗？',
        content: '',
        success(res) {
          if (res.confirm) {
            httpRequest({
              url: `bankcard/${e.target.id}/`,
              data: {},
              method: 'DELETE',
              success: (res2) => {
                if (res2.statusCode >= 200 && res2.statusCode < 300) {
                  that.delta = 0;
                  that.selectId = -1;
                  that.getBankCards();
                }
              },
            });
          }
        },
      });
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
      httpRequest({
        url: 'bankcard/',
        method: 'GET',
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            console.log('get bankcards', res.data);
            this.$store.commit('SET_BANKCARDS', res.data);
          }
        },
      });
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
</style>
