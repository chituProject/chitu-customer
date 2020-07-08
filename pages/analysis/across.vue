<template>
  <container>
    <van-notify id="van-notify" />
    <loading-animation :show-animation="showAnimation" />
    <div class="container">
      <div class="background" />
      <div class="page_container">
        <div class="title">
          选择基金
          <van-button
            style="margin: 0 12px"
            color="#9a1f27"
            size="small"
            @click="selectFundsConfirm"
            >确认基金选择</van-button
          >
        </div>
        <van-checkbox-group
          :value="checkedFunds"
          @change="handleCheckedFundsChange"
        >
          <div
            class="flex-justify_around"
            style="align-items:flex-start; width: 100vw;"
          >
            <div>
              <div class="fs-18 line-30 main-color" style="margin:12px 0;">
                赤兔精选基金
              </div>
              <van-checkbox
                v-for="fund in manager_funds"
                :key="fund.id"
                style="padding:8upx;"
                :name="fund.id"
                >{{ fund.name }}</van-checkbox
              >
            </div>
            <div>
              <div class="fs-18 line-30 main-color" style="margin:12px 0;">
                指数基金
              </div>
              <van-checkbox
                v-for="fund in index_funds"
                :key="fund.id"
                style="padding:8upx;"
                :name="fund.id"
                >{{ fund.name }}</van-checkbox
              >
            </div>
          </div>
        </van-checkbox-group>

        <template v-if="confirmStage > 0">
          <div class="title">
            选择指标
            <van-button
              style="margin: 0 12px"
              color="#9a1f27"
              size="small"
              @click="selectMetricsConfirm"
              >确认指标选择</van-button
            >
          </div>
          <van-checkbox-group
            :max="20"
            :value="checkedMetrics"
            @change="handleCheckedMetricsChange"
          >
            <div
              class="flex-justify_around"
              style="align-items:flex-start; width: 100vw;"
            >
              <div v-if="fund_data">
                <div class="fs-18 line-30 main-color" style="margin:12px 0;">
                  基金档案
                </div>
                <van-checkbox
                  v-for="item in fund_data"
                  :key="name"
                  style="padding:8upx;"
                  :name="item"
                  >{{ item }}</van-checkbox
                >
              </div>
              <div v-if="fund_achievement">
                <div class="fs-18 line-30 main-color" style="margin:12px 0;">
                  基金业绩
                </div>
                <van-checkbox
                  v-for="item in fund_achievement"
                  :key="index"
                  style="padding:8upx;"
                  :name="item"
                  >{{ item }}</van-checkbox
                >
              </div>
            </div>
          </van-checkbox-group>
        </template>

        <template v-if="fundAchievementTable.length > 0 && confirmStage > 1">
          <div class="title">基金业绩</div>
          <div class="table">
            <div class="tr">
              <div
                v-for="(header, i) in fundAchievementHeader"
                :key="i"
                class="th"
              >
                {{ header }}
              </div>
            </div>
            <div
              v-for="(fundAchievement, index) in fundAchievementTable"
              :key="index"
              class="tr"
              :class="{ tr1: index == 0 }"
            >
              <div v-for="item in fundAchievement" :key="item" class="td">
                {{ item }}
              </div>
            </div>
          </div>
        </template>

        <template v-if="fundArchiveTable.length > 0 && confirmStage > 1">
          <div class="title">基金档案</div>
          <div class="table">
            <div class="tr">
              <div v-for="(header, i) in fundArchiveHeader" :key="i" class="th">
                {{ header }}
              </div>
            </div>
            <div
              v-for="(fundArchive, index) in fundArchiveTable"
              :key="index"
              class="tr"
              :class="{ tr1: index == 0 }"
            >
              <div v-for="item in fundArchive" :key="item" class="td">
                {{ item }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </container>
</template>
<script>
import { mapGetters } from "vuex";
import { navigateTo, getQuery, notify } from "@/utils/adapter";
import { authMixin } from "@/utils/mixins";
import loadingAnimation from "@/components/loadingAnimation";

export default {
  components: {
    loadingAnimation
  },
  mixins: [authMixin],
  data() {
    return {
      showAnimation: true,
      confirmStage: 0,
      fundList: [],
      manager_funds: [],
      index_funds: [],
      checkedFunds: [],
      checkedMetrics: [],
      fund_achievement: [],
      fund_data: [],
      idsStr: "",
      metricsStr: "",
      fundAchievementTable: [],
      fundAchievementHeader: ["基金名称"],
      fundArchiveTable: [],
      fundArchiveHeader: ["基金名称"]
    };
  },
  computed: {},
  onShow() {
    this.query = getQuery(this);
    this.getData(this.hideAnimation);
  },
  methods: {
    handleCheckedFundsChange(e) {
      this.confirmStage = 0;
      this.checkedFunds = e.detail;
    },
    handleCheckedMetricsChange(e) {
      console.log(e.detail);
      this.confirmStage = 1;
      this.checkedMetrics = e.detail;
    },
    nav(url) {
      navigateTo({ url });
    },
    hideAnimation() {
      this.showAnimation = false;
    },
    getData(callback) {
      this.$request({
        method: "GET",
        url: "fund_archive/"
      })
        .then(([_, res]) => {
          for (let i = 0; i < res.data.results.length; ++i) {
            if (res.data.results[i].type === "MANAGER") {
              this.manager_funds.push(res.data.results[i]);
            } else {
              this.index_funds.push(res.data.results[i]);
            }
          }
          this.fundList = res.data.results;
        })
        .finally(() => {
          typeof callback === "function" && callback();
        });
    },
    selectFundsConfirm() {
      if (this.checkedFunds.length < 2) {
        notify("请选择至少两个基金");
      }
      this.confirmStage += 1;
      let idsStr = "";
      this.checkedFunds.map((data, index) => {
        idsStr += index === 0 ? `${data}` : `,${data}`;
      });
      this.idsStr = idsStr;
      this.$request({
        method: "GET",
        url: `fund_archive/get_fund/?id=${idsStr}`
      }).then(([_, res]) => {
        this.fund_achievement = res.data.fund_achievement;
        this.fund_data = res.data.fund_data;
      });
    },
    selectMetricsConfirm() {
      this.confirmStage += 1;
      let fundachievementsStr = "";
      let fundarchiveStr = "";
      let f1 = 0;
      let f2 = 0;
      this.fundAchievementHeader = ["基金名称"];
      this.fundArchiveHeader = ["基金名称"];
      this.checkedMetrics.map(data => {
        if (this.fund_achievement.indexOf(data) > -1) {
          fundachievementsStr += f1 === 0 ? `${data}` : `,${data}`;
          this.fundAchievementHeader.push(data);
          f1 += 1;
        } else {
          fundarchiveStr += f2 === 0 ? `${data}` : `,${data}`;
          this.fundArchiveHeader.push(data);
          f2 += 1;
        }
      });
      this.$request({
        method: "GET",
        url: `fund_archive/get_fund_data/?id=${
          this.idsStr
        }&fund_data=${fundarchiveStr}&fund_achievement=${fundachievementsStr}`
      }).then(([_, res]) => {
        this.fundAchievementTable = [];
        this.fundArchiveTable = [];
        res.data.result.map(data => {
          let tmp = [data.fund_name];
          this.fundAchievementHeader.map(header => {
            let a = data.fund_achievement[header];
            if (
              header === "月收益率" ||
              header === "回撤" ||
              header === "成立以来收益" ||
              header === "最近一年收益" ||
              header === "最近二年收益" ||
              header === "最近三年收益" ||
              header === "最近五年收益" ||
              header === "最近一年年化" ||
              header === "最近二年年化" ||
              header === "最近三年年化" ||
              header === "最近五年年化"
            ) {
              a = `${(parseFloat(a) * 100).toFixed(2)}%`;
            }
            if (a) tmp.push(a);
          });
          this.fundAchievementTable.push(tmp);
          tmp = [data.fund_name];
          this.fundArchiveHeader.map(header => {
            if (data.fund_data[header]) tmp.push(data.fund_data[header]);
          });
          console.log("table", this.fundAchievementTable);
          this.fundArchiveTable.push(tmp);
        });
      });
    }
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
  font-size: 36upx;
  font-weight: bold;
  text-align: left;
  margin: 20upx 0 40upx;
  padding: 0 30upx;
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
</style>
