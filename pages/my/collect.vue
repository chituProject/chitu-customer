<template>
  <div>
    <loading-animation :show-animation="showAnimation" />
    <div class="background" />
    <div class="title">模拟组合</div>
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
            <view class="tr" style="position: absolute">
              <view class="th">组合名</view>
              <view class="th th1">YTD</view>
              <view class="th">最近三年</view>
              <view class="th th1">策略</view>
            </view>
            <view
              v-for="(item, index) in list_HC"
              :key="item.id"
              class="tr"
              :class="{ tr1: index == 0 }"
              @click="switchTab(`/pages/analysis/simulate?id=${item.id}`)"
            >
              <view class="td">{{ item.name }}</view>
              <view class="td">{{ formatPercent(item.ytd) }}</view>
              <view class="td">{{
                formatPercent(item.three_year_profit)
              }}</view>
              <view class="td">{{ strategyStatus[item.strategy] }}</view>
            </view>
          </view>
        </block>
      </sib-list>
    </view>
    <div class="title">横向比较</div>
    <van-cell-group v-for="item in list_HC" :key="item.id">
      <van-cell
        :title="`横向比较${item.id}`"
        size="large"
        is-link
        link-type="switchTab"
        :url="`/pages/analysis/across?id=${item.id}`"
      />
    </van-cell-group>
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
</template>

<script>
/* eslint-disable no-underscore-dangle */

import { mapGetters } from "vuex";
import { formatPercent } from "@/utils/index";
import loadingAnimation from "@/components/loadingAnimation";
import sibList from "@/components/sib-list/sib-list.vue";
import strategyStatus from "@/static/data/status.json";

export default {
  components: {
    loadingAnimation,
    sibList
  },
  data() {
    return {
      strategyStatus,
      showAnimation: true,
      notMoreText: "",
      height: "640rpx",
      finished: false,
      list_HC: [],
      list_SM: [],
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
    ...mapGetters("app", ["isIpx"])
  },
  mounted() {
    if (this.isIpx) {
      this.height = "780upx";
    }
    this.fetchHomepage(this.hideAnimation);
  },
  methods: {
    formatPercent,
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
      this.list_HC = [];
      this.list_SM = [];
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
      this.list_HC = [];
      this.list_SM = [];
      this.fetchHomepage();
    },
    change2(item) {
      this.type2 = item;
      this.list_HC = [];
      this.list_SM = [];
      this.fetchHomepage();
    },
    change3(item) {
      this.type3 = item;
      this.list_HC = [];
      this.list_SM = [];
      this.fetchHomepage();
    },
    onRefresh() {
      console.log("reached bottom");
      if (!this.finished) {
        this.page_num += 1;
        this.fetchHomepage();
      }
    },
    switchTab(url) {
      uni.switchTab({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    fetchHomepage(callback) {
      const params = {
        page_num: this.page_num,
        page_size: this.page_size,
        ordering: ""
      };
      if (this.list1.indexOf(this.type1) === 0) {
        if (this.list2.indexOf(this.type2) === 0) {
          params.ordering += "-ytd";
        } else {
          params.ordering += "ytd";
        }
      }
      if (this.list1.indexOf(this.type1) === 1) {
        if (this.list2.indexOf(this.type2) === 0) {
          params.ordering += "-three_year_profit";
        } else {
          params.ordering += "three_year_profit";
        }
      }
      if (this.list1.indexOf(this.type1) === 2) {
        if (this.list2.indexOf(this.type2) === 0) {
          params.ordering += "-roll_year_win";
        } else {
          params.ordering += "roll_year_win";
        }
      }
      if (this.list1.indexOf(this.type1) === 3) {
        if (this.list2.indexOf(this.type2) === 0) {
          params.ordering += "-sharpe_ratio";
        } else {
          params.ordering += "sharpe_ratio";
        }
      }
      this.list_HC = [];
      this.list_SM = [];
      return this.$request({
        method: "GET",
        url: "customer_collect/",
        data: params
      }).then(([_, res]) => {
        const rows = res.data.results;
        this.loading = false;
        this.next = res.data.next;
        if (this.next === null || rows == null || rows.length === 0) {
          this.finished = true;
          this.notMoreText = "我是有底线的...";
        }
        rows.forEach(item => {
          if (item.type === "HC") {
            this.list_HC.push(item);
          } else {
            this.list_SM.push(item);
          }
        });

        // eslint-disable-next-line no-unused-expressions
        typeof callback === "function" && callback();
      });
    }
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
  overflow-x: hidden;
  align-items: flex-start;
}
.title {
  font-size: 36upx;
  font-weight: bold;
  text-align: left;
  margin: 0 0 40upx;
  padding: 20upx 30upx 0;
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
</style>
