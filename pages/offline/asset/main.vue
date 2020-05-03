<template>
  <div class="container page-padding">
    <div class="background"></div>

    <div class="full-vw" style="z-index: 1;">
      <div class="item">
        <div class="flex-justify_between order-wrapper">
          <div class="flex-column-center">
            <span class="fs-14 grey99-color">总余额</span>
            <div class="fs-16">
              <span class="fs-14 money-prefix">¥</span>
              {{ (count.withdrawal_amount + count.unrecorded_amount) | formatPrice}}
            </div>
          </div>
          <div class="flex-column-center">
            <div class="fs-14 grey99-color">线下收款金额</div>
            <div class="fs-16">
              <span class="fs-14 money-prefix">¥</span>
              {{ count.payment_amount | formatPrice}}
            </div>
          </div>
          <div class="flex-column-center">
            <div class="fs-14 grey99-color">累计提现金额</div>
            <div class="fs-16">
              <span class="fs-14 money-prefix">¥</span>
              {{ count.payment_amount - count.withdrawal_amount - count.unrecorded_amount  | formatPrice}}
            </div>
          </div>
        </div>
      </div>
      <topup :amount="count.withdrawal_amount" :idx="0"></topup>
      <topup :amount="count.payment_amount" :idx="1"></topup>
      <!-- <topup :amount="count.recorded_amount" :idx="2"></topup>
      <topup :amount="count.unrecorded_amount" :idx="3"></topup> -->
    </div>
  </div>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import topup from '@/components/topup';

export default {
  data() {
    return {
      count: {
        withdrawal_amount: 0,
        payment_amount: 0,
        recorded_amount: 0,
        unrecorded_amount: 0,
      },
    };
  },
  components: {
    topup,
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  methods: {
    getAmount() {
      httpRequest({
        url: 'reseller/reseller_index/',
        method: 'GET',
        data: {
          uuid: this.Reseller.uuid,
        },
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            this.count = res.data;
          }
        },
      });
    },
  },
  onShow() {
    this.getAmount();
  },
};
</script>

<style scoped>
  .order-wrapper {
    margin: 40rpx 30rpx 20rpx;
  /* padding: 15px 0 0;*/
  }
  .flex-column-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .item{
    margin: 0 24rpx;
    border-radius: 12rpx;
  }
  .money-prefix {
    margin-right: 10rpx;
  }
</style>
