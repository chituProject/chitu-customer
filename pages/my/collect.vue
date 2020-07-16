<template>
  <div>
    <loading-animation :show-animation="showAnimation" />
    <div class="background" />
    <div class="title">模拟组合</div>
    <view
      v-if="list_SM.length > 0"
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
              <view class="th">滚动一年</view>
              <view class="th">夏普比率</view>
            </view>
            <view
              v-for="(item, index) in list_SM"
              :key="item.id"
              class="tr"
              :class="{ tr1: index == 0 }"
              @click="switchTab('/pages/analysis/simulate', 'SM', item.id)"
            >
              <view class="td">{{ "组合" + item.id }}</view>
              <view class="td">{{ formatPercent(item.ytd) }}</view>
              <view class="td">{{
                formatPercent(item.three_year_profit)
              }}</view>
              <view class="td">{{ formatPercent(item.roll_year) }}</view>
              <view class="td">{{ item.sharpe_ratio }}</view>
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
        @click="switchTab('/pages/analysis/across', 'HC', item.id)"
      />
    </van-cell-group>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

import { mapGetters } from "vuex";
import { formatPercent } from "@/utils/index";
import loadingAnimation from "@/components/loadingAnimation";
import sibList from "@/components/sib-list/sib-list.vue";

export default {
  components: {
    loadingAnimation,
    sibList
  },
  data() {
    return {
      showAnimation: true,
      notMoreText: "",
      height: "640rpx",
      finished: false,
      list_HC: [],
      list_SM: [],
      page_num: 1,
      page_size: 20
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
    switchTab(url, type, id) {
      const collect = {
        type,
        id
      };
      this.$store.commit("user/SET_COLLECTID", collect);
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
      this.list_HC = [];
      this.list_SM = [];
      return this.$request({
        method: "GET",
        url: "customer_collect/",
        data: params
      })
        .then(([_, res]) => {
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
        })
        .finally(() => {
          typeof callback === "function" && callback();
        });
    }
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
