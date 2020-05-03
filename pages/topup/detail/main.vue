<template>
  <div class="container background-white">
    <div class="background"></div>
    <div class="flex" style="flex-direction: column; align-items: center">
      <div class="icon">￥</div>
      <div class="title grey39-color">提现到—{{withdrawal.bank}}({{withdrawal.card_tail}})</div>
      <div class="money grey39-color"><span class="fs-16">¥</span>{{withdrawal.amountStr}}</div>
    </div>
    <div class="content box">
      <div class="line"></div>
      <!-- <div class="flex group">
        <div class="label">提现类型</div>
        <div class="text">{{topupName[withdrawal.type]}}</div>
      </div> -->
      <div class="flex group">
        <div class="label">提现金额</div>
        <div class="text">{{withdrawal.amountStr}}</div>
      </div>
      <div class="flex group">
        <div class="label">提现手续费</div>
        <div class="text">{{withdrawal.serviceFeeStr}}</div>
      </div>
      <div class="flex group">
        <div class="label">发起时间</div>
        <div class="text">{{ withdrawal.createdAt }}</div>
      </div>
      <div class="flex group">
        <div class="label">到账时间</div>
        <div class="text">{{ withdrawal.transferredAt ? withdrawal.transferredAt : '无' }}</div>
      </div>
      <div class="flex group">
        <div class="label">提现银行</div>
        <div class="text">{{withdrawal.bank}}({{withdrawal.card_tail}})</div>
      </div>
      <div class="flex group">
        <div class="label">提现单号</div>
        <div class="text">{{withdrawal.id}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpRequest, getQuery } from '@/utils/adapter';
import { formatPrice, formatTime } from '@/utils/index';
import Constants from '../../../static/data/constants.json';

export default {
  data() {
    return {
      withdrawal: {
        createdAt: {
          y: '2018',
          m: '09',
          d: '30',
          time: '0:00',
        },
      },
      topupName: Constants.topupName,
    };
  },
  methods: {
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    const Query = getQuery(this);
    httpRequest({
      url: `withdrawal/${Query.id}/`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode > 199 && res.statusCode < 300) {
          this.withdrawal = res.data;
          this.withdrawal.amountStr = formatPrice(res.data.amount);
          this.withdrawal.serviceFeeStr = formatPrice(res.data.service_fee);
          this.withdrawal.createdAt = formatTime(res.data.created_at);
          if (res.data.transferred_at) {
            this.withdrawal.transferredAt = formatTime(res.data.transferred_at);
          }
        }
      },
    });
  },
};
</script>

<style scoped>

  .icon {
    height: 37.5px;
    width: 37.5px;
    line-height: 37.5px;
    color: #f5ce42;
    font-size: 22px;
    border: 2px solid #fac950;
    border-radius: 39.5px;
    background-color: #f6e07a;
    margin-top: 37.5px;
    text-align: center;
  }

  .title {
    margin: 15px 0 20px 0;
    font-size: 15px;
    line-height: 15px;
  }

  .money {
    font-size: 25px;
    line-height: 25px;
  }

  .content {
    padding: 74px 22.5px 5px 22.5px;
    width: 100%;
  }

  .line {
    background-color: #dedede;
    height: 1px;
    width: 100%;
    margin-bottom: 25px;
  }

  .group {
    margin-bottom: 20px;
  }

  .label {
    color: #999;
    font-size: 14px;
    line-height: 14px;
    flex: 1;
  }

  .text {
    color: #393939;
    font-size: 14px;
    line-height: 14px;
    flex: 3;
  }

</style>
