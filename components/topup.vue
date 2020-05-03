<template>
  <div class="card">
    <div class="fs-14 grey39-color">
      {{title[idx]}}
    </div>
    <div class="fs-25 amount">{{AmountStr}}</div>
    <form class="flex-justify_end"  @submit="submit" report-submit='true'>
      <div>
        <button v-if="(disabled || amount === 0) && idx === 0"  :class="{_adjust2}" class="btn btn-grey btn-small btn-radius-6">提现</button>
        <button v-else-if="idx === 0" class="btn btn-main btn-small btn-radius-6" form-type="submit">提现</button>
        <button v-else-if="(disabled || amount === 0)" :class="{_adjust2}" class="btn btn-main btn-small btn-radius-6" form-type="submit">明细</button>
        <button v-else :class="{_adjust2}" class="btn btn-main btn-small btn-radius-6" form-type="submit">明细</button>
      </div>
    </form>
  </div>
</template>

<script>
import { navigateTo } from '@/utils/adapter';
import { formatPrice } from '@/utils/index';

export default {
  data() {
    return {
      title: ['可提现金额 (元)', '线下收款金额 (元)', '已入账收益 (元)', '待入账 (元)'],
    };
  },
  props: [
    'disabled',
    'amount',
    'idx',
  ],
  computed: {
    AmountStr() {
      return formatPrice(this.amount);
    },
  },
  methods: {
    submit(e) {
      // navigateTo({ url: `/pages/topup/add/main?amount=${this.amount}&type=${this.idx}` });
      this.$store.dispatch('addFormId', e.target.formId);
      if (this.idx === 1) {
        navigateTo({ url: '/pages/offline/amount/main' });
      }
      // else if (this.idx === 2) {
      //   navigateTo({ url: '/pages/offline/entry/main' });
      // } else if (this.idx === 3) {
      //   navigateTo({ url: '/pages/offline/pending/main' });
      // }
      else if (this.amount > 0) {
        navigateTo({ url: `/pages/topup/add/main?amount=${this.amount}&type=${this.idx}` });
      }
    },
  },
};
</script>

<style>
._adjust1{
  margin: 70rpx 0 6rpx;
}
._adjust2{
  margin: 0 0 6rpx;
}
._adjust3{
  margin: 38rpx 0 6rpx;
}
.card{
  margin: 24rpx 24rpx 0 24rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 40rpx 30rpx 0 30rpx;
}
.amount {
  margin-top: 20rpx;
  /*font-size: 19px;*/
  line-height: 49rpx;
  color: #f56250;
}
</style>
