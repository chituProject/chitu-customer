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
            :value="type"
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
            @change="change1"
          >
          </offpay-select>
          <offpay-select
            class="input-text"
            :value="type3"
            :list="list3"
            value-key="value"
            label-key="label"
            placeholder=""
            @change="change1"
          >
          </offpay-select>
        </div>
        <div>

        </div>
        <scroll-view
          scroll-y
          style="width: 100%; height: 400px;position: absolute;top: 163upx"
          :lower-threshold="100"
          :bindscrolltolower="onRefresh"
        >
          <t-table style="position: absolute">
            <t-tr>
              <t-th :width="60">基金经理</t-th>
              <t-th>基金</t-th>
              <t-th>YTD</t-th>
              <t-th>最近三年</t-th>
              <t-th>滚动一年胜率</t-th>
              <t-th>夏普比率</t-th>
              <t-th>策略</t-th>
            </t-tr>
            <t-tr v-for="item in list" :key="item.id">
              <t-td :width="60">{{ item.manager }}</t-td>
              <t-td>{{ item.name }}</t-td>
              <t-td>{{ item.name }}</t-td>
              <t-td>{{ item.name }}</t-td>
              <t-td>{{ item.name }}</t-td>
              <t-td>{{ item.name }}</t-td>
              <t-td>{{ item.name }}</t-td>
            </t-tr>
          </t-table>
        </scroll-view>

        <!--        <div v-for="(item,i) in list" :key="i" >-->
        <!--          {{item}}-->
        <!--        </div>-->
        <div
          v-if="finished"
          style="text-align:center;"
          :class="{ empty: finished }"
        >
          <p class="explain">没有更多了</p>
        </div>
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
import tTable from "@/components/t-table/t-table.vue";
import tTh from "@/components/t-table/t-th.vue";
import tTr from "@/components/t-table/t-tr.vue";
import tTd from "@/components/t-table/t-td.vue";
// import addmp from "@/components/module/addMp";

export default {
  components: {
    loadingAnimation,
    // eslint-disable-next-line vue/no-unused-components
    OffpaySelect,
    tTable,
    tTh,
    tTr,
    tTd
    // addmp
  },
  mixins: [authMixin],
  data() {
    return {
      triggered: false,
      showAnimation: true,
      // addMp: false,
      finished: false,
      list: [],
      page_num: 1,
      type: "按YTD排序",
      list1: [
        "按YTD排序",
        "按三年滚动收益率排序",
        "按任意12个月正回报率排序",
        "按夏普比率排序"
      ],
      type2: "从高到低",
      list2: ["从高到低", "从低到高"],
      type3: "全部策略",
      list3: ["全部策略", "多策略混合", "量化"]
    };
  },
  computed: {
    ...mapGetters("app", [
      "options",
      "systemInfo",
      "wechatInfo",
      "hasLoggedIn"
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
    this.query = getQuery(this);
    this.initData();
  },
  onShow() {},
  methods: {
    change1(item) {
      console.log(item);
      this.type = item;
    },
    onRefresh() {
      console.log("reached bottom");
      if (!this.finished) {
        this.page_num += 1;
        this.fetchHomepage();
      }
    },
    nav(url) {
      navigateTo({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    fetchHomepage(callback) {
      return this.$request({
        method: "GET",
        url: "fund_archive/",
        data: {
          page_num: this.page_num
        }
      }).then(([_, res]) => {
        // eslint-disable-next-line no-unused-expressions
        const rows = res.data.results;
        this.loading = false;
        this.next = res.data.next;
        if (this.next === null) {
          this.finished = true;
          return;
        }
        if (rows == null || rows.length === 0) {
          // 加载结束
          this.finished = true;
          return;
        }
        this.list = this.list.concat(rows);
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

<style scoped>
.container {
  align-items: flex-start;
}
.page_container {
  /*padding: 30upx;*/
}
.title {
  font-size: 32upx;
  color: #393939;
  padding: 0 30upx;
  margin-bottom: 10upx;
  position: fixed;
  top: 30upx;
}
.contain {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  margin-bottom: 10upx;
  position: fixed;
  top: 82upx
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
</style>
