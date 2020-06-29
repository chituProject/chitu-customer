<template>
  <container>
    <loading-animation :show-animation="showAnimation" />
    <view class="container">
      <view class="background" />
      <view class="page_container">
        <view class="contain">
          <offpay-select
            :value="type1"
            :list="list"
            value-key="id"
            label-key="name"
            placeholder=""
            @change="change1"
          >
          </offpay-select>
        </view>
      </view>
    </view>
  </container>
</template>
<script>
    /* eslint-disable no-underscore-dangle */

    import { mapGetters } from "vuex";
    import { navigateTo, getQuery } from "@/utils/adapter";
    import { authMixin } from "@/utils/mixins";
    import loadingAnimation from "@/components/loadingAnimation";
    import OffpaySelect from "@/components/apply/selectObject";
    import sibList from "@/components/sib-list/sib-list.vue";

    export default {
        components: {
            loadingAnimation,
            // eslint-disable-next-line vue/no-unused-components
            OffpaySelect,
            sibList
        },
        mixins: [authMixin],
        data() {
            return {
                triggered: false,
                showAnimation: true,
                // addMp: false,
                notMoreText: '',
                height: '560rpx',
                finished: false,
                list: [],
                page_num: 1,
                type1: ""
            };
        },
        computed: {
            ...mapGetters("app", [
                "options",
                "systemInfo",
                "wechatInfo",
                "hasLoggedIn",
                "isIpx"
            ]),
            ...mapGetters("user", ["user", "userInfo"])
        },
        onShow() {
            this.query = getQuery(this);
            this.getData(this.hideAnimation);
        },
        methods: {
            change1(item) {
                // this.type1 = item;
                // this.list = [];
                // this.fetchHomepage();
            },
            nav(url) {
                navigateTo({ url });
            },
            hideAnimation() {
                this.showAnimation = false;
            },
            getData (callback) {
                return this.$request({
                    method: "GET",
                    url: "fund_archive/"
                }).then(([_, res]) => {
                    // eslint-disable-next-line no-unused-expressions
                    this.list = res.data.results;
                    typeof callback === "function" && callback();
                });
            },
            initData() {
                // “添加到我的小程序”
                // if (this.options.scene !== 1089) {
                //   this.addMp = true;
                // }
            }
        },
        onShareAppMessage() {
            wx.showShareMenu({
                withShareTicket: true
            });
            return {
                title: "购物即免单！优质生活，这次我请！",
                path: "/pages/online/index/main"
            };
        }
    };
</script>

<style scoped lang="scss">
  .container {
    align-items: flex-start;
  }
  .page_container {
    /*padding: 30upx;*/
  }
  .fixed {
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
  .title {
    font-size: 32upx;
    color: #393939;
    padding: 0 30upx;
    margin-bottom: 10upx;
    /*position: fixed;*/
    /*top: 30upx;*/
  }
  .contain {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30upx;
    margin-bottom: 10upx;
    /*position: fixed;*/
    /*top: 82upx*/
  }
  .input-text {
    font-size: 28upx;
    height: 60upx;
    margin-right: 25upx;
    margin-bottom: 10upx;
    /*background-color: #fff;*/
    /*border: solid 1px #fafafa;*/
  }
  .empty {
    margin-top: 1vh;
  }
  .table {
    border:1px solid #dadada;
    border-right: 0;
    border-bottom: 0;
    /*width: 98%;*/
  }
  .tr {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .tr1 {
    margin-top: 95upx
  }
  .th {
    flex-shrink: 0;
  }
  .th,.td {
    padding: 6upx;
    border-bottom: 1px solid #dadada;
    border-right: 1px solid #dadada;
    text-align: center;
    height: 80upx;
    line-height: 40upx;
    /*width:100%*/
    /*width: auto;*/
    width: 94upx;
    /*overflow: hidden;*/
    word-wrap:break-word;
    /*display: -webkit-box;*/
    /*-webkit-box-orient:vertical;*/
    /*-webkit-line-clamp: 2;*/
    text-overflow: ellipsis;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  /*.td {*/
  /*  width: 86upx;*/
  /*  overflow: hidden;*/
  /*}*/
  .th {
    font-weight: 400;
    background-color: #dadada
  }
  .th1 {
    line-height: 85upx;
  }
  .bottom {
    width: 100%;
    height: 98upx;
    background-image: linear-gradient(
        #ffffff,
        #ffffff),
    linear-gradient(
        #f5f5f5,
        #f5f5f5);
    background-blend-mode: normal,
    normal;
    box-shadow: 0px -1px 1px 0px
    rgba(187, 187, 187, 0.3);
    display: flex;
    justify-content: space-between;
  }
  .buttons {
    padding: 20upx 85upx;
    color: #9a1f27;
    font-size: 34upx;
  }
</style>
