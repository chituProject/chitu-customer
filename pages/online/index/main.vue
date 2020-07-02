<template>
  <container>
    <loading-animation :show-animation="showAnimation" />
    <div class="container">
      <div class="background" />
      <div class="page_container">
        <div class="title">赤兔精选</div>
        <div class="contain">
          <offpay-select
            class="input-text"
            :value="type1"
            :list="list1"
            value-key="value"
            label-key="label"
            placeholder="按YTD排序"
            @change="change1"
          >
          </offpay-select>
          <offpay-select
            class="input-text"
            :value="type2"
            :list="list2"
            value-key="value"
            label-key="label"
            placeholder=""
            @change="change2"
          >
          </offpay-select>
          <offpay-select
            class="input-text"
            :value="type3"
            :list="list3"
            value-key="value"
            label-key="label"
            placeholder=""
            @change="change3"
          >
          </offpay-select>
        </div>
        <view
          class="list"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <!-- ref="sibList" @isRefresh='isRefresh' @scrolltolowerFn="scrolltolowerFn" 此三个必须写 -->
          <sib-list
            ref="sibList"
            :is-not-more="finished"
            :floter-text="notMoreText"
            :scroll-height="height"
            @isRefresh="isRefresh"
            @scrolltolowerFn="scrolltolowerFn"
          >
            <!-- 内部block可自定义 -->
            <block slot="sibScrollList" class="">
              <view class="table">
                <view class="tr" style="position: fixed">
                  <view class="th">基金经理</view>
                  <view class="th th1">基金</view>
                  <view class="th th1">YTD</view>
                  <view class="th">最近三年</view>
                  <view class="th">滚动一年胜率</view>
                  <view class="th">夏普比率</view>
                  <view class="th th1">策略</view>
                </view>
                <view
                  v-for="(item, index) in list"
                  :key="item.id"
                  class="tr"
                  :class="{ tr1: index == 0 }"
                >
                  <view class="td">{{ item.manager }}</view>
                  <view class="td">{{ item.name }}</view>
                  <view class="td">{{
                    Math.floor(item.ytd * 100) / 100 + "%"
                  }}</view>
                  <view class="td">{{
                    Math.floor(item.three_year_profit * 100) / 100 + "%"
                  }}</view>
                  <view class="td">{{
                    Math.floor(item.roll_year_win * 100) / 100 + "%"
                  }}</view>
                  <view class="td">{{
                    Math.floor(item.sharpe_ratio * 100) / 100 + "%"
                  }}</view>
                  <view class="td">{{ strategyStatus[item.strategy] }}</view>
                </view>
              </view>
            </block>
          </sib-list>
        </view>
        <view>
          <view class="table">
            <view v-for="(item, index) in list4" :key="item.id" class="tr">
              <view class="td">{{ item.manager }}</view>
              <view class="td">{{ item.name }}</view>
              <view class="td">{{
                Math.floor(item.ytd * 100) / 100 + "%"
              }}</view>
              <view class="td">{{
                Math.floor(item.three_year_profit * 100) / 100 + "%"
              }}</view>
              <view class="td">{{
                Math.floor(item.roll_year_win * 100) / 100 + "%"
              }}</view>
              <view class="td">{{
                Math.floor(item.sharpe_ratio * 100) / 100 + "%"
              }}</view>
              <view class="td">{{ strategyStatus[item.strategy] }}</view>
            </view>
          </view>
        </view>
        <view style="position: fixed;bottom: 0;display: flex" class="bottom">
          <view class="buttons" @click="nav('/pages/analysis/simulate')"
            >构建模拟组合</view
          >
          <view class="buttons" @click="nav('/pages/analysis/across')"
            >指标横向比较</view
          >
        </view>

        <!--        <div v-for="(item,i) in list" :key="i" >-->
        <!--          {{item}}-->
        <!--        </div>-->
        <!--        <div-->
        <!--          v-if="finished"-->
        <!--          style="text-align:center;"-->
        <!--          :class="{ empty: finished }"-->
        <!--        >-->
        <!--          <p class="explain">没有更多了</p>-->
        <!--        </div>-->
      </div>
    </div>
  </container>
</template>

<script>
/* eslint-disable no-underscore-dangle */

import { mapGetters } from "vuex";
import { navigateTo, getQuery } from "@/utils/adapter";
import { authMixin } from "@/utils/mixins";
import loadingAnimation from "@/components/loadingAnimation";
import OffpaySelect from "@/components/apply/select";
import sibList from "@/components/sib-list/sib-list.vue";
import strategyStatus from "@/static/data/status.json";
// import addmp from "@/components/module/addMp";

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
      strategyStatus,
      triggered: false,
      showAnimation: true,
      // addMp: false,
      notMoreText: "",
      height: "640rpx",
      finished: false,
      list: [],
      list4: [],
      page_num: 1,
      page_size: 20,
      type1: "按YTD排序",
      list1: [
        "按YTD排序",
        "按三年滚动收益率排序",
        "按任意12个月正回报率排序",
        "按夏普比率排序"
      ],
      type2: "从高到低",
      list2: ["从高到低", "从低到高"],
      type3: "全部策略",
      list3: [
        "全部策略",
        "量化",
        "固收",
        "宏观对冲",
        "纯多头",
        "多空",
        "复合",
        "其他"
      ],
      strategys: {
        全部策略: "",
        量化: "quantification",
        固收: "fixed__income",
        宏观对冲: "macro__hedging",
        纯多头: "pure__bull",
        多空: "long__short",
        复合: "combination",
        其他: "other"
      }
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
  watch: {
    hasLoggedIn(val) {
      if (val) {
        this.fetchHomepage(this.hideAnimation);
      }
    }
  },
  mounted() {
    console.log(this.isIpx);
    if (this.isIpx) {
      this.height = "780rpx";
    }
    this.query = getQuery(this);
    // this.initData();
  },
  onShow() {},
  methods: {
    // 刷新touch监听
    touchstart(e) {
      this.$refs.sibList.refreshStart(e);
    },
    touchmove(e) {
      this.$refs.sibList.refreshMove(e);
    },
    touchend(e) {
      this.$refs.sibList.refreshEnd(e);
    },
    isRefresh() {
      this.page_num = 1;
      this.list = [];
      this.fetchHomepage(this.$refs.sibList.endAfter());
    },
    async scrolltolowerFn() {
      // 模拟请求
      if (!this.finished) {
        uni.showLoading({
          title: "加载中...",
          mask: true
        });
        this.page_num += 1;
        await this.fetchHomepage();
        uni.hideLoading();
      }
    },
    change1(item) {
      this.type1 = item;
      this.list = [];
      this.fetchHomepage();
    },
    change2(item) {
      this.type2 = item;
      this.list = [];
      this.fetchHomepage();
    },
    change3(item) {
      this.type3 = item;
      this.list = [];
      this.fetchHomepage();
    },
    onRefresh() {
      console.log("reached bottom");
      if (!this.finished) {
        this.page_num += 1;
        this.fetchHomepage();
      }
    },
    nav(url) {
      // navigateTo({ url: 'pages/analysis/across' });
      // uni.navigateTo({url:url})
      navigateTo({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    fetchHomepage(callback) {
      const params = {
        page_num: this.page_num,
        page_size: this.page_size,
        ordering: "",
        strategy: this.strategys[this.type3]
      };
      if (this.list1.indexOf(this.type1) == 0) {
        if (this.list2.indexOf(this.type2) == 0) {
          params.ordering += "-ytd";
        } else {
          params.ordering += "ytd";
        }
      }
      if (this.list1.indexOf(this.type1) == 1) {
        if (this.list2.indexOf(this.type2) == 0) {
          params.ordering += "-three_year_profit";
        } else {
          params.ordering += "three_year_profit";
        }
      }
      if (this.list1.indexOf(this.type1) == 2) {
        if (this.list2.indexOf(this.type2) == 0) {
          params.ordering += "-roll_year_win";
        } else {
          params.ordering += "roll_year_win";
        }
      }
      if (this.list1.indexOf(this.type1) == 3) {
        if (this.list2.indexOf(this.type2) == 0) {
          params.ordering += "-sharpe_ratio";
        } else {
          params.ordering += "sharpe_ratio";
        }
      }
      this.list4 = [];
      return this.$request({
        method: "GET",
        url: "fund_archive/",
        data: params
      }).then(([_, res]) => {
        // eslint-disable-next-line no-unused-expressions
        const rows = res.data.results;
        this.loading = false;
        this.next = res.data.next;
        if (this.next === null) {
          this.finished = true;
          this.notMoreText = "我是有底线的...";
        }
        if (rows == null || rows.length === 0) {
          this.finished = true;
          this.notMoreText = "我是有底线的...";
        }
        rows.forEach(item => {
          if (item.type === "MANAGER") {
            this.list.push(item);
          } else {
            this.list4.push(item);
          }
        });
        // if (res.data.results[i].type === 'MANAGER') {
        //
        // } else {
        //     this.index_funds.push(res.data.results[i])
        // }

        // eslint-disable-next-line no-unused-expressions
        typeof callback === "function" && callback();
      });
    }
    // initData() {
    // “添加到我的小程序”
    // if (this.options.scene !== 1089) {
    //   this.addMp = true;
    // }
    // }
  },
  onShareAppMessage() {
    wx.showShareMenu({
      withShareTicket: true
    });
    return {
      title: "赤兔小程序",
      path: "/pages/online/index/main"
    };
  }
};
</script>

<style scoped lang="scss">
.container {
  align-items: flex-start;
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
  border: 1px solid #dadada;
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
  margin-top: 95upx;
}
.th {
  flex-shrink: 0;
}
.th,
.td {
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
  word-wrap: break-word;
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
  background-color: #dadada;
}
.th1 {
  line-height: 85upx;
}
.bottom {
  width: 100%;
  height: 98upx;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(#f5f5f5, #f5f5f5);
  background-blend-mode: normal, normal;
  box-shadow: 0px -1px 1px 0px rgba(187, 187, 187, 0.3);
  display: flex;
  justify-content: space-around;
}
.buttons {
  color: #9a1f27;
  font-size: 34upx;
  line-height: 98upx;
}
</style>
