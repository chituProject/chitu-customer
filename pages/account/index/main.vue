<template>
  <div class="container">
    <div class="background"></div>

    <div class="bg-blend">
      <div class="full-vw flex-justify_start" style="align-items:center">
        <div class="userinfo-avatar">
          <open-data type="userAvatarUrl"></open-data>
        </div>
        <div>
          <open-data class="user-name" type="userNickName" lang="zh_CN"></open-data>
          <div class="offpay-count flex"><img src="/static/img/icons/reseller.png" style="width:12px;height:13px;margin-right:6px;">{{Reseller.name}}</div>
        </div>
      </div>
    </div>

    <div class="full-vw" @click="nav('/pages/offline/asset/main')" style="margin-top:112px;z-index: 1;">
      <div class="item">
        <div class="flex">
          <p>我的账户</p>
          <div class="flex-justify_between">
            <p class="view-all-orders">查看详情</p>
            <!-- <div class="arrow-right"></div> -->
          </div>
        </div>
        <div class="flex-justify_start order-wrapper">
          <div class="flex-column-center width-3">
            <div class="fs-25">
              {{ (count.withdrawal_amount + count.unrecorded_amount) | formatPrice}}
            </div>
            <span class="fs-14 grey99-color">总余额 (元)</span>
          </div>
          <div class="flex-column-center width-3">
            <div class="fs-25">
              {{ count.withdrawal_amount | formatPrice }}
            </div>
            <div class="fs-14 grey99-color">可提现 (元)</div>
          </div>
          <div class="flex-column-center width-3">
            <div class="fs-25">
              {{ count.unrecorded_amount | formatPrice }}
            </div>
            <div class="fs-14 grey99-color">待入账 (元)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="full-vw" @click="nav('/pages/account/myfans/main')">
      <div class="item">
        <div class="flex">
          <p>我的粉丝</p>
          <div class="flex-justify_between">
            <p class="view-all-orders">查看更多</p>
            <!-- <div class="arrow-right"></div> -->
          </div>
        </div>
        <div class="flex-justify_start order-wrapper">
          <div class="flex-column-center width-3">
            <div class="fs-28 grey39-color">
              {{fansStats.ACTIVATED + fansStats.INACTIVATED}}
            </div>
            <span class="fs-14 grey99-color">粉丝总数</span>
          </div>
          <div class="flex-column-center width-3">
            <div class="fs-28 grey39-color">
              {{fansStats.INACTIVATED}}
            </div>
            <div class="fs-14 grey99-color">未激活粉丝</div>
          </div>
          <div class="flex-column-center width-3">
            <div class="fs-28 grey39-color">
              {{fansStats.ACTIVATED}}
            </div>
            <div class="fs-14 grey99-color">激活粉丝</div>
          </div>
        </div>
        <!-- TODO: 邀请链接现在是假的，因此先注释掉
        <div class="flex-justify_center" style="margin:33px auto 0;" @click.stop="nav('/pages/account/qrcode/main')">
          <div class="white-color share-btn">邀请链接/二维码</div>
        </div> -->
      </div>
    </div>

    <div class="divider"></div>


    <div class="full-vw">
      <div class="item">
        <div>
          <p>合伙人服务</p>
        </div>

        <div class="flex-justify_start">
          <div class="flex-column-center width-3" @click="nav('/pages/topup/list/main')">
            <div class="icon-wrapper">
              <img class="icon-3" src="/static/img/icons/ticket.svg">
            </div>
            <div class="fs-14 grey99-color">提现记录</div>
          </div>
          <div class="flex-column-center width-3" @click="nav('/pages/bankcard/list/main')">
            <div class="icon-wrapper">
              <img class="icon-3" src="/static/img/icons/wallet.svg">
            </div>
            <div class="fs-14 grey99-color">提现账户管理</div>
          </div>
          <button class="flex-column-center width-3 service-button" show-message-card="true" open-type="contact">
            <div class="icon-wrapper">
              <img class="icon-3" src="/static/img/icons/customer_service.svg">
            </div>
            <div class="fs-14 grey99-color">客户服务</div>
          </button>
          <!-- TODO: 引流优惠券产品还没有做完
          <div class="flex-column-center">
            <div class="icon-wrapper">
              <img class="icon-3" src="/static/img/icons/ticket.svg">
            </div>
            <div class="fs-14 grey99-color">引流优惠券</div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
import { navigateTo, httpRequest } from '@/utils/adapter';

export default {
  data() {
    return {
      fansStats: {
        ACTIVATED: 0,
        INACTIVATED: 0,
      },
      count: {
        withdrawal_amount: 0,
        payment_amount: 0,
        recorded_amount: 0,
        unrecorded_amount: 0,
      },
    };
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
  },
  watch: {
    Reseller(val) {
      if (val && val.uuid) {
        this.getAmount();
      }
    },
  },
  methods: {
    nav(url) {
      navigateTo({ url });
    },
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
    init() {
      httpRequest({
        method: 'GET',
        url: 'reseller_fans/count/',
        success: (res) => {
          this.fansStats = res.data;
        },
      });
      console.log('state', this.$store.state);
    },
  },
  onShow() {
    this.init();
    if (this.Reseller && this.Reseller.uuid) {
      this.getAmount();
    }
  },
};
</script>

<style scoped>

  .width-3 {
    width: 224rpx;
  }

  .service-button {
    background: #ffffff;
  }

  p {
    font-size: 30rpx;
    color: #393939;
    line-height: 30rpx;
  }

  .item{
    margin: 0 12rpx;
    border-radius: 12rpx;
  }

  .bg-blend{
    position: absolute;
    z-index: 0;
    width: 100%;
    background-image: linear-gradient(-39deg,
    #ff4843 0%,
    #ff803c 100%),
  linear-gradient(
    #ffffff,
    #ffffff);
    padding-top: 24rpx;
    padding-bottom: 120rpx;
  }

  .userinfo-avatar {
    overflow:hidden;
    width: 120rpx;
    height: 120rpx;
    margin: 30rpx 24rpx;
    border-radius: 20rpx;
  }

  .user-name {
    font-size: 30rpx;
    color: white;
    line-height: 30rpx;
  }

  .offpay-count {
    font-size: 26rpx;
    color: #fff;
    line-height: 26rpx;
    margin-top: 20rpx;
    align-items: center;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
  }

  .icon-3 {
    width: 48rpx;
    height: 44rpx;
    margin: 50rpx auto 20rpx;
  }

  .share-btn{
    color: #fff;
    font-size: 30rpx;
    background: #f56250;
    padding: 26rpx 36rpx;
    border-radius: 80rpx;
    white-space: nowrap;
  }

  .divider {
    width: 100%;
    background-color: #f5f5f5;
    height: 22rpx;
  }

  .view-all-orders {
    font-size: 24rpx;
    color: #666666;
    line-height: 24rpx;
  }

  .order-wrapper {
    margin: 72rpx 0 0;
    padding: 30rpx 0 0;
  }

  .flex-column-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

