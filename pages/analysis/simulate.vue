<template>
  <div>
    <van-notify id="van-notify" />
    <loading-animation :show-animation="showAnimation" />
    <div class="container">
      <div class="background" />
      <div class="contain">
        <offpay-select
          style="margin-top: 10upx"
          :value="type1"
          :list="list1"
          placeholder="请选择基金"
          @change="change1"
        >
        </offpay-select>
        <input v-model="investment" type="number" class="input" />
        <span class="wan">万</span>
        <div class="add" @click="addFund">添加</div>
        <van-button size="small" color="#9a1f27" @click="simulationConfirm"
          >确认</van-button
        >
      </div>
      <div
        v-show="confirmStage > 0"
        class="favorite btn-main-reverse btn-radius background-white"
      >
        <div class="fs-18 main-color">收藏此比较</div>
        <van-switch
          active-color="#9a1f27"
          :value="checkedFavorite"
          @input="onChangeFavorite"
        />
        <van-button size="small" color="#9a1f27" @click="simulationClear"
          >清空当前选择</van-button
        >
      </div>
      <div
        v-for="(item, index) in selectedFunds"
        :key="index"
        style="padding: 0 30upx"
      >
        <div class="item">
          <div class="grey39-color">{{ item.name }}</div>
          <div class="grey39-color">{{ item.investment + "万" }}</div>
          <div class="grey39-color">{{ item.propotion }}</div>
          <van-icon name="cross" @click="del(index)" />
        </div>
      </div>
    </div>
    <div style="margin-top: 25upx;background: #FFFFFF;width: 100%;">
      <!-- <div style="display: flex;">
            <div
              style="display:flex;height: 30upx;background: #fafafa;border-radius: 20upx;padding: 15upx"
              @click="popup1showbtn"
            >
              <p style="line-height: 30upx;color: #9a1f27;">
                {{ data || "请选择时间" }}
              </p>
              <div class="arrow-down" style="margin-left: 15upx"></div>
            </div>
            <div
              style="display:flex;height: 30upx;background: #fafafa;border-radius: 20upx;padding: 15upx;margin-left: 15upx"
              @click="popup2 = true"
            >
              <p style="line-height: 30upx;color: #9a1f27">
                {{ data1 || "请选择时间" }}
              </p>
              <div class="arrow-down" style="margin-left: 15upx"></div>
            </div>
          </div> -->

      <view v-if="chartData.series[0].data.length > 0" class="qiun-columns">
        <view class="flex qiun-bg-white qiun-title-bar qiun-common-mt">
          <view class="qiun-title-dot-light">净值</view>
          <view @click="saveToAlbum('canvasLineA')">导出本图</view>
        </view>
        <view class="qiun-charts">
          <canvas
            id="canvasLineA"
            canvas-id="canvasLineA"
            class="charts"
            disable-scroll="true"
            @touchstart="touchLineA"
            @touchmove="moveLineA"
            @touchend="touchEndLineA"
          ></canvas>
        </view>
      </view>

      <v-table
        v-if="tableData.length > 0"
        :columns="tableColumns"
        :list="tableData"
        :height="500"
      ></v-table>

      <!-- <van-popup :show="popup" position="bottom">
        <van-datetime-picker
          type="year-month"
          :value="currentDate"
          title="选择年月"
          :formatter="formatter"
          @confirm="onInput"
          @cancel="popup = false"
        />
      </van-popup>
      <van-popup :show="popup2" position="bottom">
        <van-datetime-picker
          type="year-month"
          :value="currentDate"
          title="选择年月"
          :formatter="formatter"
          @confirm="onInput1"
          @cancel="popup2 = false"
        />
      </van-popup> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { notify } from "@/utils/adapter";
import { formatPercent, formatTimeMonth } from "@/utils/index";
import { authMixin } from "@/utils/mixins";
import loadingAnimation from "@/components/loadingAnimation";
import OffpaySelect from "@/components/apply/selectObject";
import uCharts from "@/components/u-charts/u-charts.js";
import vTable from "@/components/table.vue";

let _self;
let canvaLineA = null;

export default {
  components: {
    loadingAnimation,
    OffpaySelect,
    vTable
  },
  mixins: [authMixin],
  data() {
    return {
      confirmStage: 0,
      cWidth: "",
      cHeight: "",
      data: "",
      data1: "",
      // popup: false,
      // popup2: false,
      currentDate: new Date(),
      showAnimation: true,
      list: [],
      list1: [],
      type1: "-11",
      selectedFund: {},
      selectedFunds: [],
      investment: 0,
      total: 0,
      simulationData: [],
      chartData: {},
      pixelRatio: 1,
      tableData: [],
      tableColumns: [
        {
          title: "月份",
          key: "id",
          $width: "60px"
        },
        {
          title: "净值",
          key: "net_worth",
          $width: "60px"
        },
        {
          title: "月收益率",
          key: "monthly_yield",
          $width: "60px"
        },
        {
          title: "回撤",
          key: "fallback",
          $width: "60px"
        }
      ],
      checkedFavorite: false
    };
  },
  onLoad() {
    _self = this;
    this.cWidth = uni.upx2px(700);
    this.cHeight = uni.upx2px(500);
    this.initChart();
  },
  computed: {
    ...mapGetters("user", ["collectId"])
  },
  watch: {
    selectedFunds: {
      handler() {
        let sum = 0;
        this.selectedFunds.map(row => {
          sum += row.investment * 1.0;
        });
        this.selectedFunds.map(row => {
          row.weight = row.investment / sum;
          row.propotion = `${(row.weight * 100).toFixed(2)}%`;
        });
      },
      immediate: true
    }
  },
  onShow() {
    this.getData(this.hideAnimation);
  },
  methods: {
    initChart() {
      _self = this;
      this.cWidth = uni.upx2px(750);
      this.cHeight = uni.upx2px(500);
    },
    showLineA(canvasId, chartData) {
      canvaLineA = new uCharts({
        $this: _self,
        canvasId,
        type: "line",
        fontSize: 10,
        legend: { show: true },
        dataLabel: false,
        dataPointShape: true,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        categories: chartData.categories,
        series: chartData.series,
        enableScroll: true,
        xAxis: {
          disableGrid: true,
          itemCount: 12,
          scrollAlign: "right"
        },
        yAxis: {
          gridType: "dash",
          gridColor: "#CCCCCC",
          dashLength: 3,
          splitNumber: 6,
          min: 0,
          format: val => {
            return `${val.toFixed(2)}`;
          }
        },
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          line: {
            type: "straight"
          }
        }
      });
    },
    touchLineA(e) {
      canvaLineA.scrollStart(e);
    },
    moveLineA(e) {
      canvaLineA.scroll(e);
    },
    touchEndLineA(e) {
      canvaLineA.scrollEnd(e);
      // 下面是toolTip事件，如果滚动后不需要显示，可不填写
      canvaLineA.showToolTip(e, {
        format(item, category) {
          return `${category} ${item.name}:${item.data}`;
        }
      });
    },
    simulationClear() {
      this.selectedFunds = [];
      this.chartData = [];
      this.tableData = [];
      this.$store.commit("user/SET_COLLECTID", -1);
    },
    onInput1(val) {
      this.popup2 = false;
      this.data1 = this.$moment(val.selectedFund).format("YYYY-MM");
    },
    onInput(val) {
      this.popup = false;
      this.data = this.$moment(val.selectedFund).format("YYYY-MM");
    },
    popup1showbtn() {
      this.popup = true;
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    del(index) {
      this.selectedFunds.splice(index, 1);
    },
    addFund() {
      if (!this.selectedFund.name) {
        notify("请选择基金");
        return;
      }
      if (this.investment <= 0) {
        notify("请输入投资金额");
        return;
      }
      this.confirmStage = 0;
      let flag = false;
      this.selectedFunds.map(item => {
        if (item.name === this.selectedFund.name) {
          notify("请不要重复添加同一基金");
          flag = true;
        }
      });
      if (flag) return;
      this.total += this.investment;
      this.selectedFund.investment = this.investment;
      this.selectedFunds.push(this.selectedFund);
    },
    simulationConfirm() {
      if (this.selectedFunds.length < 2) return;
      this.showAnimation = true;
      const data = [];
      this.selectedFunds.map(item => {
        const tmp = {
          fund_id: item.id,
          weight: item.weight
        };
        data.push(tmp);
      });
      this.$request({
        method: "POST",
        url: "fund_archive/simulation/",
        data
      })
        .then(([_, res]) => {
          this.simulationData = data;
          this.setChartTable(res.data.results);
        })
        .finally(() => {
          this.confirmStage += 1;
          this.showAnimation = false;
        });
    },
    change1(item, index) {
      this.type1 = item;
      this.selectedFund = this.list[index];
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    getData(callback) {
      return this.$request({
        method: "GET",
        url: "fund_archive/"
      }).then(([_, res]) => {
        this.list = res.data.results;
        res.data.results.forEach(item => {
          this.list1.push(item.name);
        });
        if (this.collectId > -1) {
          this.$request({
            method: "GET",
            url: `customer_collect/${this.collectId}`
          }).then(([_, res2]) => {
            this.confirmStage = 1;
            this.checkedFavorite = true;
            this.setChartTable(res2.data.fund_simulation.data);
            typeof callback === "function" && callback();
          });
        } else {
          typeof callback === "function" && callback();
        }
      });
    },
    setChartTable(list) {
      this.tableData = [];
      const chartData = {
        categories: [],
        series: [
          {
            name: "模拟组合",
            data: [],
            color: "#9a1f27"
          }
        ]
      };
      list.map(mm => {
        const tableRow = {
          id: formatTimeMonth(mm.time),
          net_worth: mm.net_worth,
          monthly_yield: formatPercent(mm.monthly_yield),
          fallback: formatPercent(mm.fallback)
        };
        this.tableData.push(tableRow);
        if (mm.time.substr(5, 2) === "01") {
          chartData.categories.push(formatTimeMonth(mm.time));
        } else {
          chartData.categories.push("");
        }
        chartData.series[0].data.push(mm.net_worth);
      });
      this.chartData = chartData;
      this.showLineA("canvasLineA", this.chartData);
    },
    onChangeFavorite() {
      if (!this.checkedFavorite) {
        const data = {
          type: "SM",
          data: this.simulationData
        };
        this.$request({
          method: "POST",
          url: "customer_collect/",
          data
        }).then(([_, res]) => {
          this.$store.commit("user/SET_COLLECTID", res.data.id);
          this.checkedFavorite = true;
        });
      } else {
        this.$request({
          method: "DELETE",
          url: `customer_collect/${this.collectId}/`
        }).then(() => {
          this.checkedFavorite = false;
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  align-items: flex-start;
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
  align-items: center;
  padding: 0 24upx;
  margin: 50upx 0 10upx;
  /*position: fixed;*/
}
.input-text {
  font-size: 28upx;
  height: 60upx;
  margin-right: 25upx;
  margin-bottom: 10upx;
  /*background-color: #fff;*/
  /*border: solid 1px #fafafa;*/
}
.input {
  width: 90upx;
  padding: 8upx 60upx 8upx 8upx;
  margin-top: 10upx;
  text-align: center;
  background-color: #f2f2f2;
  border: solid 1upx #e8e8e8;
  border-radius: 0 30upx 30upx 0;
}
.wan {
  font-size: 28upx;
  text-align: center;
  width: 80upx;
  margin-top: 20upx;
  margin-left: -80upx;
}
.add {
  width: 147upx;
  height: 59upx;
  line-height: 59upx;
  background-color: #ffffff;
  border-radius: 30upx;
  border: solid 1upx #fafafa;
  color: #9a1f27;
  font-size: 28upx;
  text-align: center;
  margin-left: 25upx;
}
.item {
  width: 400upx;
  height: 59upx;
  line-height: 59upx;
  padding: 5upx 23upx;
  background-color: #e6e6e6;
  border-radius: 30upx;
  margin-top: 13upx;
  display: flex;
  font-size: 28upx;
  justify-content: space-between;
}
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/

.qiun-columns {
  display: flex;
  flex-direction: column !important;
}
.qiun-common-mt {
  margin-top: 10upx;
}
.qiun-bg-white {
  background: #ffffff;
}
.qiun-title-bar {
  width: 96%;
  padding: 10upx 2%;
  flex-wrap: nowrap;
}
.qiun-title-dot-light {
  border-left: 10upx solid #9a1f27;
  padding-left: 10upx;
  font-size: 32upx;
  color: #000000;
}

.qiun-charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}

.charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}

.favorite {
  z-index: 10000;
  position: fixed;
  top: 24upx;
  right: 24upx;
}
</style>
