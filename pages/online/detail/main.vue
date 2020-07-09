<template>
  <div>
    <div class="background" />
    <navBar
      :navs="navs"
      :active-index="activeIndex"
      @indexChanged="navCallback"
    ></navBar>

    <van-cell-group>
      <van-cell title="基金名称" :value="model.name" size="large" />
      <van-cell title="基金经理" :value="model.manager" size="large" />
      <van-cell
        title="基金类别"
        :value="model.type === 'MANAGER' ? '经理基金' : '指数基金'"
        size="large"
      />
      <van-cell
        title="基金策略"
        :value="fund_strategy_name[model.strategy]"
        size="large"
      />
    </van-cell-group>
    <div v-show="activeIndex === 0" style="margin-top: 50upx;">
      <van-tabs type="card" color="#a5323a" animated="true">
        <van-tab title="累计" style="margin-top: 20upx;">
          <van-cell-group>
            <van-cell
              title="近一个月"
              :value="formatPercent(latest_achievement.monthly_yield)"
              size="large"
            />
            <van-cell
              title="今年以来"
              :value="Math.floor(model.ytd * 100) / 100 + '%'"
              size="large"
            />
            <van-cell
              title="最近一年"
              :value="formatPercent(latest_achievement.one_year_profit)"
              size="large"
            />
            <van-cell
              title="最近二年"
              :value="formatPercent(latest_achievement.two_year_profit)"
              size="large"
            />
            <van-cell
              title="最近三年"
              :value="formatPercent(latest_achievement.three_year_profit)"
              size="large"
            />
            <van-cell
              title="最近五年"
              :value="formatPercent(latest_achievement.five_year_profit)"
              size="large"
            />
            <van-cell
              title="夏普比率"
              :value="model.sharpe_ratio"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="年化">
          <van-cell-group>
            <van-cell
              title="最近一年"
              :value="formatPercent(latest_achievement.one_year_annualized)"
              size="large"
            />
            <van-cell
              title="最近二年"
              :value="formatPercent(latest_achievement.two_year_annualized)"
              size="large"
            />
            <van-cell
              title="最近三年"
              :value="formatPercent(latest_achievement.three_year_annualized)"
              size="large"
            />
            <van-cell
              title="最近五年"
              :value="formatPercent(latest_achievement.five_year_annualized)"
              size="large"
            />
          </van-cell-group>
        </van-tab>
      </van-tabs>

      <div style="justify-content: flex-end;display: flex;margin: 30upx 10upx">
        数据更新至{{ latest_achievement.time }}
      </div>

      <view class="qiun-columns">
        <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
          <view class="qiun-title-dot-light">净值</view>
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
        <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
          <view class="qiun-title-dot-light">回撤</view>
        </view>
        <view class="qiun-charts">
          <canvas
            id="canvaColumn"
            canvas-id="canvaColumn"
            class="charts"
            disable-scroll="true"
            @touchstart="touchColumn"
            @touchmove="moveColumn"
            @touchend="touchEndColumn"
          ></canvas>
        </view>
      </view>

      <v-table
        v-if="tableData.length > 0"
        :columns="tableColumns"
        :list="tableData"
        :height="500"
      ></v-table>
    </div>
    <div v-show="activeIndex === 1" style="margin-top: 50upx;">
      <van-tabs type="card" color="#a5323a" animated="true">
        <van-tab title="概述" style="margin-top: 20upx;">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.general_infomation"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="运营" style="margin-top: 20upx;">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.operation"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="条款">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.article"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="组合特征">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.combination"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="多头">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.long_positions"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="空头">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.short_positions"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="总体仓位">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in model.designed_exposure"
              :key="index"
              :title="item.key"
              :value="item.value"
              size="large"
            />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar.vue";
import { formatPercent, formatTimeMonth } from "@/utils/index";
import uCharts from "@/components/u-charts/u-charts.js";
import vTable from "@/components/table.vue";

let _self;
let canvaLineA = null;
let canvaColumn = null;

export default {
  components: {
    navBar,
    vTable
  },
  data() {
    return {
      activeIndex: 0,
      navs: [{ title: "业绩信息" }, { title: "基金档案" }],
      model: {
        fund_achievement: {
          count: 0,
          data: []
        }
      },
      latest_achievement: {
        monthly_yield: 0,
        one_year_annualized: 0,
        two_year_annualized: 0,
        three_year_annualized: 0,
        five_year_annualized: 0
      },
      fund_strategy_name: {
        quantification: "量化",
        fixed__income: "固收",
        macro__hedging: "宏观对冲",
        pure__bull: "纯多头",
        long__short: "多空",
        combination: "复合",
        other: "其他"
      },
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      chartData: {},
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
        },
        {
          title: "滚动12月",
          key: "roll_year",
          $width: "80px"
        },
        {
          title: "滚动18月",
          key: "roll_eighteen_month",
          $width: "80px"
        },
        {
          title: "滚动12月>0",
          key: "roll_12_gt_0",
          $width: "90px"
        },
        {
          title: "滚动12月>10%",
          key: "roll_12_gt_10",
          $width: "100px"
        },
        {
          title: "滚动18月>0",
          key: "roll_18_gt_0",
          $width: "90px"
        },
        {
          title: "滚动18月>10%",
          key: "roll_18_gt_10",
          $width: "100px"
        },
        {
          title: "夏普比率",
          key: "sharpe_ratio",
          $width: "60px"
        },
        {
          title: "成立以来收益",
          key: "profit",
          $width: "90px"
        },
        {
          title: "最近一年收益",
          key: "one_year_profit",
          $width: "90px"
        },
        {
          title: "最近一年年化",
          key: "one_year_annualized",
          $width: "90px"
        },
        {
          title: "最近两年收益",
          key: "two_year_profit",
          $width: "90px"
        },
        {
          title: "最近两年年化",
          key: "two_year_annualized",
          $width: "90px"
        },
        {
          title: "最近三年收益",
          key: "three_year_profit",
          $width: "90px"
        },
        {
          title: "最近三年年化",
          key: "three_year_annualized",
          $width: "90px"
        },
        {
          title: "最近五年收益",
          key: "five_year_profit",
          $width: "90px"
        },
        {
          title: "最近五年年化",
          key: "five_year_annualized",
          $width: "90px"
        }
      ]
    };
  },
  methods: {
    formatPercent,
    getData(id) {
      this.$request({
        method: "GET",
        url: `fund_archive/${id}/`
      }).then(([_, res]) => {
        this.model = res.data;
        this.latest_achievement = this.model.fund_achievement.data[
          this.model.fund_achievement.data.length - 1
        ];
        const chartData = {
          categories: [],
          series: [
            {
              name: res.data.name,
              data: [],
              color: "#9a1f27"
            }
          ]
        };
        const chartDataColumn = {
          categories: [],
          series: [
            {
              name: res.data.name,
              data: [],
              color: "#9a1f27"
            }
          ]
        };
        this.model.fund_achievement.data.map(mm => {
          const tableRow = {
            id: formatTimeMonth(mm.time),
            net_worth: mm.net_worth,
            monthly_yield: formatPercent(mm.monthly_yield),
            fallback: formatPercent(mm.fallback),
            roll_year: formatPercent(mm.roll_year),
            roll_eighteen_month: formatPercent(mm.roll_eighteen_month),
            roll_12_gt_0: formatPercent(mm.roll_12_gt_0),
            roll_12_gt_10: formatPercent(mm.roll_12_gt_10),
            roll_18_gt_0: formatPercent(mm.roll_18_gt_0),
            roll_18_gt_10: formatPercent(mm.roll_18_gt_10),
            sharpe_ratio: mm.sharpe_ratio,
            profit: formatPercent(mm.profit),
            one_year_profit: formatPercent(mm.one_year_profit),
            one_year_annualized: formatPercent(mm.one_year_annualized),
            two_year_profit: formatPercent(mm.two_year_profit),
            two_year_annualized: formatPercent(mm.two_year_annualized),
            three_year_profit: formatPercent(mm.three_year_profit),
            three_year_annualized: formatPercent(mm.three_year_annualized),
            five_year_profit: formatPercent(mm.five_year_profit),
            five_year_annualized: formatPercent(mm.five_year_annualized)
          };
          this.tableData.push(tableRow);
          if (mm.time.substr(5, 2) === "01") {
            chartData.categories.push(formatTimeMonth(mm.time));
            chartDataColumn.categories.push(formatTimeMonth(mm.time));
          } else {
            chartData.categories.push("");
            chartDataColumn.categories.push("");
          }
          chartData.series[0].data.push(mm.net_worth);
          chartDataColumn.series[0].data.push(Math.abs(mm.fallback));
        });
        this.chartData = chartData;
        this.chartDataColumn = chartDataColumn;
        this.initChart();
      });
    },
    navCallback(e) {
      uni.setNavigationBarTitle({
        title: this.navs[e].title
      });
      this.activeIndex = e;
    },
    initChart() {
      _self = this;
      this.cWidth = uni.upx2px(750);
      this.cHeight = uni.upx2px(500);
      this.showLineA("canvasLineA", this.chartData);
      this.showColumn("canvaColumn", this.chartDataColumn);
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
    showColumn(canvasId, chartData) {
      canvaColumn = new uCharts({
        $this: _self,
        canvasId,
        type: "column",
        legend: { show: false },
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        animation: true,
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
          dashLength: 4,
          format: val => {
            return `${val.toFixed(2)}`;
          }
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            type: "group",
            width:
              (_self.cWidth * _self.pixelRatio * 0.45) /
              chartData.categories.length
          }
        }
      });
    },
    touchColumn(e) {
      canvaColumn.scrollStart(e);
    },
    moveColumn(e) {
      canvaColumn.scroll(e);
    },
    touchEndColumn(e) {
      canvaColumn.scrollEnd(e);
      canvaColumn.showToolTip(e, {
        format(item, category) {
          if (typeof item.data === "object") {
            return `${category} ${item.name}:${item.data.value}`;
          }
          return `${category} ${item.name}:${item.data}`;
        }
      });
    }
  },
  onLoad(option) {
    this.getData(option.id);
  }
};
</script>

<style lang="scss" scoped>
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
</style>
