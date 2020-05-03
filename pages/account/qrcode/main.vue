<template>
  <container>
    <title-bar :title="'我的粉丝'" :pageStackAmount="pageStackAmount"></title-bar>
    <loading-animation :showAnimation="showAnimation"></loading-animation>
    <div class="background"></div>

    <div class="full-vw" style="z-index: 1;">
      <div class="item">
        <div class="flex">
          <p>平台分享</p>
        </div>

        <div class="flex-justify_between order-wrapper">
          <div class="flex-column-center">
            <img :src="Reseller. offline_QRcode" class="qrcode">
            <div class="fs-14 grey99-color qrcode-btn">分享平台二维码</div>
          </div>
          <div class="flex-column-center">
            <img class="linkage" src="/static/img/linkage.jpg">
            <div class="fs-14 grey99-color qrcode-btn">复制公众号嵌入链接</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <p>热销商品分享</p>
    </div>

    <div class="item" v-for="(product,index) in goodsList" :key="index">
      <div class="card-img">
        <img :src="product.goods.main_picture" :style="{'height': '200px'}">
      </div>
      <div class="card-main">
        <div class="card-title"> {{ product.goods.full_title }} </div>
        <div class="flex-justify_between">
          <div class="card-description"> {{ product.goods.description }} </div>
          <button class="fs-14 grey99-color qrcode-btn">复制公众号文章链接</button>
        </div>
        <div class="flex-justify_between">
          <div class="flex-justify_start">
            <div class="card-price color-main">
              ¥ <span class="price-main">{{ product.goods.default_sku && product.goods.default_sku.price ? product.goods.default_sku.price / 100 : 0 }}</span>
            </div>
          </div>
            <button class="fs-14 grey99-color qrcode-btn">获取分享二维码</button>
        </div>
      </div>
    </div>

  </container>
</template>

<script>
import { httpRequest } from '@/utils/adapter';
import navBarFixed from '@/components/navBarFixed';
import GoodsList from '../../../static/data/goods.json';


export default {
  data() {
    return {
    // imgH: this.systemInfo.windowWidth - 30,
    // imgW: this.systemInfo.windowWidth * 0.44,
      goodsList: GoodsList,
      showAnimation: true,
      fans: [],
      tabs: ['全部粉丝', '未激活粉丝', '激活粉丝'],
      tabParam: ['', 'INACTIVATED', 'ACTIVATED'],
      activeIndex: 0,
      activatedFanNum: 0,
      inactivatedFanNum: 0,
    };
  },
  components: {
    navBarFixed,
  },
  computed: {
    Reseller() {
      return this.$store.state.reseller;
    },
    systemInfo() {
      return this.$store.state.systemInfo;
    },
  },
  methods: {
    fetchData() {
      httpRequest({
        method: 'GET',
        url: 'reseller_fans/count/',
        success: (res) => {
          this.activatedFanNum = res.data.ACTIVATED;
          this.inactivatedFanNum = res.data.INACTIVATED;
          this.getList(this.activeIndex);
        },
      });
    },
    navCallback(e) {
      this.fans = [];
      this.activeIndex = e;
      this.getList(e);
    },
    getList(index) {
      const data = {
        status: this.tabParam[index],
      };
      httpRequest({
        url: 'reseller_fans/',
        method: 'GET',
        data,
        success: (res) => {
          if (res.statusCode > 199 && res.statusCode < 300) {
            this.fans = res.data;
          }
        },
      });
    },
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  onShow() {
    this.fetchData();
  },
};
</script>

<style scoped>
  .width-item{
    width: 33vw;
  }

  .item {
    padding: 36rpx 24rpx 36rpx 24rpx;
    margin: 40rpx 30rpx 0;
    background-color: white;
    flex: 1;
    align-items: center;
    border-radius: 12rpx;
  }

  .flex-column-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .userinfo-avatar {
    overflow:hidden;
    width: 78rpx;
    height: 78rpx;
    border-radius: 40rpx;
  }
  .icon-main{
    color: #f56250;
    font-size: 38rpx;
    -webkit-text-stroke-width:0;
    margin-right: 10rpx;
  }

 .qrcode-wrapper {
    margin: 72rpx 30rpx 0;
  /* padding: 15px 0 0;*/
  }

  .qrcode-btn {
    text-align: center;
    color: #f56250;
    width: 260rpx;
    height: 50rpx;
    border-radius: 8rpx;
    background-color: white;
    border-color: #f56250;
    border-width: 2rpx;
    border-style: solid;
  }

  .qrcode{
    margin-top: 40rpx;
    width: 240rpx;
    height: 240rpx;
  }
  .linkage{
    margin: 20rpx;
    margin-top: 60rpx;
    width: 200rpx;
    height: 200rpx;
  }
/**/
  .card {
    margin: 20rpx 30rpx 0 30rpx;
  }

  .card-img {
    max-width: 100%;
    /*display: block;*/
    border-radius: 10rpx 10rpx 0 0;
    /* box-shadow: 3px 3px 15px 4px rgba(165, 133, 102, 0.1); */
    justify-content:center;
    display:flex;
  }

  .card-main {
    padding: 20rpx;
  }

  .card-title {
    overflow: hidden;
    font-size: 30rpx;
    max-height: 56rpx;
    line-height: 36rpx;
    color: #000;
    padding: 14rpx 0;
  }

  .card-description {
    padding-top: 10rpx;
    white-space:normal;
    width: 330rpx;
    height: 64rpx;
    overflow: hidden;
    font-size: 26rpx;
    line-height: 32rpx;
    color: #aaa;
   /* padding: 7px 0;*/
  }

  .card-tag {
    z-index: 1;
    font-size: 22rpx;
    border: 1rpx solid #f56250;
    padding: 0 9rpx 0 0;
    border-radius: 2rpx;
    margin: 10rpx 0 10rpx 10rpx;
    line-height: 28rpx;
    height: 28rpx;
  }

  .card-tag-title {
    display: inline-block;
    padding: 0 9rpx;
    line-height: 28rpx;
    height: 28rpx;
  }

  .card-price {
    font-weight: bold;
    font-size: 32rpx;
    line-height: 48rpx;
  }

  .price-wrapper {
    align-items: baseline;
    z-index:1;
  }

  .click-animation:active {
    transform: scale(0.97);
  }

  .price-main {
    font-size: 40rpx;
  }

  .share-button {
    padding: 0 20rpx;
    line-height: 48rpx;
    font-size: 28rpx;
    text-align: center;
    border-radius: 10rpx;
    margin-left: 20rpx;
    border: #f56250 1rpx solid;
  }

</style>
