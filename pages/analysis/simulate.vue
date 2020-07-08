<template>
  <container>
    <van-notify id="van-notify" />
    <loading-animation :show-animation="showAnimation" />
    <div class="container">
      <div class="background" />
      <div class="page_container">
        <div class="contain">
          <offpay-select
            style="margin-top: 10upx"
            :value="type1"
            :list="list1"
            label-key="name"
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
          v-for="(item, index) in selectedFunds"
          :key="index"
          style="padding: 0 30upx"
        >
          <div class="item">
            <div class="item_font">{{ item.name }}</div>
            <div class="item_font">{{ item.investment + "万" }}</div>
            <div class="item_font">{{ item.propotion }}</div>
            <!--            <div class="item_font" style="font-size: 30upx">x</div>-->
            <van-icon name="cross" @click="del(index)" />
          </div>
        </div>
      </div>
      <div style="width: 100%">
        <div
          v-if="show"
          style="display: flex;margin-left: 20upx;margin-top: 10upx"
        >
          <van-button
            round
            color="#ac2d38"
            size="small"
            @click="(show = true), (show1 = false)"
            >累计</van-button
          >
          <van-button
            round
            type="default"
            size="small"
            style="margin-left: 20upx"
            @click="(show1 = true), (show = false)"
            >年化</van-button
          >
        </div>
        <div
          v-if="show1"
          style="display: flex;margin-left: 20upx;margin-top: 10upx"
        >
          <van-button
            round
            type="default"
            size="small"
            @click="(show = true), (show1 = false)"
            >累计</van-button
          >
          <van-button
            round
            color="#ac2d38"
            size="small"
            style="margin-left: 20upx"
            @click="(show1 = true), (show = false)"
            >年化</van-button
          >
        </div>
        <div style="background: #fff;margin-top: 10upx">
          <div class="ratio" style="padding-top: 30upx">
            <div>近一个月</div>
            <div class="ratios">+9.56%</div>
          </div>
          <van-divider />
          <div class="ratio">
            <div>今年以来</div>
            <div class="ratios">+9.58%</div>
          </div>
          <van-divider />
          <div class="ratio">
            <div>最近一年</div>
            <div class="ratios">+9.58%</div>
          </div>
          <van-divider />
          <div class="ratio">
            <div>最近三年</div>
            <div class="ratios">+9.58%</div>
          </div>
          <van-divider />
          <div class="ratio">
            <div>最近五年</div>
            <div class="ratios">+9.58%</div>
          </div>
          <van-divider />
          <div class="ratio">
            <div>夏普比率</div>
            <div class="ratios">+9.58%</div>
          </div>
          <van-divider />
        </div>

        <div
          style="margin-top: 25upx;background: #FFFFFF;width: 100%;padding: 25upx"
        >
          <div style="display: flex;">
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
          </div>

          <div class="qiun-charts">
            <canvas
              id="canvasLineA"
              canvas-id="canvasLineA"
              class="charts"
              @touchstart="touchLineA"
            ></canvas>
            <!--            <uni-ec-canvas-->
            <!--              class="uni-ec-canvas"-->
            <!--              id="line-chart"-->
            <!--              ref="canvas"-->
            <!--              canvas-id="lazy-load-chart"-->
            <!--              :ec="ec"-->
            <!--            ></uni-ec-canvas>-->
          </div>
          <!--          <div style="display:flex;height: 30upx;background: #fafafa;border-radius: 20upx;padding: 15upx;margin-left: 15upx">-->
          <!--            <p style="line-height: 30upx;color: #9a1f27">-->
          <!--              {{ data1 || '选择指数' }}-->
          <!--            </p>-->
          <!--            <div class="arrow-down" style="margin-left: 15upx"></div>-->
          <!--          </div>-->
          <van-popup :show="popup" position="bottom">
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
          </van-popup>
        </div>
      </div>
    </div>
  </container>
</template>
<script>
/* eslint-disable no-underscore-dangle */

import { mapGetters } from "vuex";
import { navigateTo, getQuery, notify } from "@/utils/adapter";
import { authMixin } from "@/utils/mixins";
import loadingAnimation from "@/components/loadingAnimation";
import OffpaySelect from "@/components/apply/selectObject";
import uCharts from "@/components/u-charts/u-charts.js";

let _self;
let canvaLineA = null;

export default {
  components: {
    loadingAnimation,
    // eslint-disable-next-line vue/no-unused-components
    OffpaySelect
  },
  mixins: [authMixin],
  data() {
    return {
      cWidth: "",
      cHeight: "",
      data: "",
      data1: "",
      popup: false,
      popup2: false,
      currentDate: new Date(),
      show1: false,
      show: true,
      name: "",
      triggered: false,
      showAnimation: true,
      // addMp: false,
      notMoreText: "",
      height: "560rpx",
      finished: false,
      list: [],
      list1: [],
      page_num: 1,
      type1: "-11",
      selectedFund: {},
      selectedFunds: [],
      investment: 0,
      total: 0,
      ratios: [],
      chartData: {
        categories: ["2012", "2013", "2014", "2015", "2016", "2017"],
        series: [
          {
            name: "成交量A",
            data: [35, 20, 25, 37, 4, 20],
            color: "#000000"
          },
          {
            name: "成交量B",
            data: [70, 40, 65, 100, 44, 68]
          },
          {
            name: "成交量C",
            data: [100, 80, 95, 150, 112, 132]
          }
        ]
      },
      pixelRatio: 1,
      serverData: ""
    };
  },
  onLoad() {
    _self = this;
    this.cWidth = uni.upx2px(700);
    this.cHeight = uni.upx2px(500);
    this.getServerData();
    // this.$refs.canvas.init(this.initChart)
  },
  computed: {
    ...mapGetters("app", ["hasLoggedIn", "isIpx"]),
    ...mapGetters("user", ["user", "userInfo"])
  },
  watch: {
    hasLoggedIn(val) {
      if (val) {
        this.getData(this.hideAnimation);
      }
    },
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
    this.query = getQuery(this);
    if (this.hasLoggedIn) {
      this.getData(this.hideAnimation);
      // setTimeout(()=>{
      //     this.getServerData()
      // },1000) // 两秒之后延迟加载
    }

    // _self.showLineA("canvasLineA",this.chartData);
  },
  mounted() {
    // this.$nextTick(()=>{
    //     this.showLineA(this.chartData)
    // })
  },
  methods: {
    // initChart(canvas, width, height, canvasDpr) {
    //     console.log(canvas, width, height, canvasDpr)
    //       chart = echarts.init(canvas, null, {
    //         width: width,
    //         height: height,
    //         devicePixelRatio: canvasDpr
    //     })
    //     canvas.setChart(chart)
    //     chart.setOption(this.option)
    //     return chart
    // },
    getServerData() {
      uni.request({
        url:
          "https://www.easy-mock.com/mock/5cc586b64fc5576cba3d647b/uni-wx-charts/chartsdata2",
        data: {},
        success: res => {
          console.log(res.data.data);
          // 下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
          this.serverData = res.data.data;
          const Column = { categories: [], series: [] };
          // 这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
          Column.categories = res.data.data.Column.categories;
          // 这里的series数据是后台做好的，如果您的数据没有和前面我注释掉的格式一样，请自行拼接数据
          Column.series = res.data.data.Column.series;
          this.showColumn("canvasLineA", Column);
        },
        fail: () => {
          console.log("网络错误，小程序端请检查合法域名");
        }
      });
    },
    showColumn(canvasId, chartData) {
      canvaLineA = new uCharts({
        $this: _self,
        canvasId,
        type: "column",
        legend: true,
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true
        },
        yAxis: {},
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            width:
              (_self.cWidth * _self.pixelRatio * 0.45) /
              chartData.categories.length
          }
        }
      });
    },
    touchLineA(e) {
      canvaLineA.showToolTip(e, {
        format(item, category) {
          return `${category} ${item.name}:${item.data}`;
        }
      });
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
      console.log(val);
      return val;
    },
    del(index) {
      this.ratios.splice(index, 1);
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
      this.loading = true;
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
          this.simulationTable = res.data.results;
          this.simulationTableChart.setOption({
            title: {
              text: "净值"
            },
            xAxis: {
              data: this.simulationTable.map(item => {
                return item.time;
              })
            },
            series: {
              data: this.simulationTable.map(item => {
                return parseFloat(item.net_worth);
              })
            }
          });
        })
        .finally(() => {
          this.confirmStage += 1;
          this.loading = false;
        });
    },
    change1(item, index) {
      this.type1 = item;
      this.selectedFund = this.list[index];
    },
    nav(url) {
      navigateTo({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    getData(callback) {
      return this.$request({
        method: "GET",
        url: "fund_archive/"
      }).then(([_, res]) => {
        // eslint-disable-next-line no-unused-expressions
        this.list = res.data.results;
        res.data.results.forEach(item => {
          this.list1.push(item.name);
        });
        typeof callback === "function" && callback();
      });
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
.empty {
  margin-top: 1vh;
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
  margin-top: 10upx;
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
.item_font {
  color: #333;
}
.ratio {
  display: flex;
  justify-content: space-between;
  padding: 0 110upx;
  background: #fff;
  color: #999999;
  font-size: 30upx;
}
.ratios {
  color: #f74c3f;
}
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts {
  width: 700upx;
  height: 500upx;
  background-color: #ffffff;
}
.charts {
  width: 700upx;
  height: 500upx;
  background-color: #ffffff;
}
</style>
