<template>
  <div class="container background-white">
    <div class="divider"></div>
    <div class="content box">
      <div class="flex group">
        <div class="label">提现金额</div>
        <div class="text">{{ withdrawal.amountStr }}</div>
      </div>
      <div class="flex group">
        <div class="label">提现类型</div>
        <div class="text">{{ topupName[withdrawal.type] }}</div>
      </div>
      <div class="flex group">
        <div class="label">发起时间</div>
        <div class="text">{{ withdrawal.createdAt }}</div>
      </div>
      <div class="flex group">
        <div class="label">银行卡尾号</div>
        <div class="text">{{ withdrawal.bank }}({{ withdrawal.card_tail }})</div>
      </div>
      <div class="flex group">
        <div class="label">手续费</div>
        <div class="text">{{ withdrawal.serviceFeeStr }}</div>
      </div>
      <div class="line"></div>
      <div class="flex-justify_start">
        <div class="fs-13 grey66-color">处理进度</div>
        <div style="margin-left:50px;">
          <div class="flex-justify_start" style="align-items:normal;">
            <img class="icon-15" src="/static/img/icons/check_main.svg">
            <div class="line-vertical" style="background-color:#f56350;">
            </div>
            <div class="fs-14 color-main _adjust">发起提现申请</div>
          </div>
          <div class="flex-justify_start" style="align-items:normal;margin-top:-1px;">
            <img class="icon-15" src="/static/img/icons/check_grey.svg">
            <div class="line-vertical" style="background-color:#999;">
            </div>
            <div class="fs-14 grey39-color _adjust">平台处理</div>
          </div>
          <div class="flex-justify_start" style="align-items:normal;margin-top:-1px;">
            <img class="icon-15" src="/static/img/icons/check_grey.svg">
            <div class="fs-14 grey39-color _adjust-2">提现成功</div>
          </div>
        </div>
      </div>
      <div class="flex" style="margin-top:35%;">
        <div class="btn btn-grey-reverse btn-small btn-radius-6" @click="navBack()">完成</div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigateBack, getQuery, httpRequest } from '@/utils/adapter';
import { formatPrice, formatTime } from '@/utils/index';
import Constants from '../../../static/data/constants.json';

export default {
  data() {
    return {
      Query: {},
      withdrawal: {
        createdAt: '2018年9月30日0:00',
      },
      topupName: Constants.topupName,
    };
  },
  methods: {
    navBack() {
      navigateBack({ delta: 1 });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    this.Query = getQuery(this);
    httpRequest({
      url: `withdrawal/${this.Query.id}/`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode > 199 && res.statusCode < 300) {
          this.withdrawal = res.data;
          this.withdrawal.amountStr = formatPrice(res.data.amount);
          this.withdrawal.createdAt = formatTime(res.data.created_at);
          this.withdrawal.serviceFeeStr = formatPrice(res.data.service_fee);
        }
      },
    });
  },
};
</script>

<style scoped>
  ._adjust {
    margin:0px 67px 0 18px;
  }
  ._adjust-2 {
    margin:0px 67px 0 12px;
  }
  .content {
    padding: 20px 12px 0px 12px;
    width: 100%;
  }
  .line {
    background-color: #dedede;
    height: 1px;
    width: 100%;
    margin-bottom: 25px;
  }
  .line-vertical {
    margin-top:14px;
    margin-left:-8px;
    height:75px;
    width:2px;
  }
  .divider {
    width: 100%;
    background-color: #f5f5f5;
    height: 11px;
  }
  .group {
    margin-bottom: 16px;
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
