<template>
  <div>
    <van-notify id="van-notify" />
    <loading-animation :show-animation="showAnimation" />
    <div class="background-white" />
    <div v-if="confirmStage !== 3" class="title">
      选择基金
      <van-button
        style="margin: 0 12px"
        color="#9a1f27"
        size="small"
        @click="selectFundsConfirm"
        >确认基金选择</van-button
      >
    </div>
    <div
      v-show="confirmStage > 1"
      class="favorite btn-main-reverse btn-radius background-white"
    >
      <div class="flex">
        <div class="fs-14 line-36 main-color">收藏</div>
        <van-switch
          active-color="#9a1f27"
          :value="checkedFavorite"
          @input="onChangeFavorite"
        />
      </div>

      <van-button size="small" color="#9a1f27" @click="acrossClear"
        >清空当前选择</van-button
      >
    </div>
    <van-checkbox-group
      v-if="confirmStage !== 3"
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

    <template v-if="confirmStage > 0 && confirmStage < 3">
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
              :key="item"
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

    <template v-if="confirmStage > 1">
      <div class="title">基金业绩</div>
      <v-table
        v-if="fundAchievementTable.length > 0"
        :columns="fundAchievementHeader"
        :list="fundAchievementTable"
      ></v-table>
      <div class="title">基金档案</div>
      <v-table
        v-if="fundArchiveTable.length > 0"
        :columns="fundArchiveHeader"
        :list="fundArchiveTable"
      ></v-table>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { navigateTo, notify } from "@/utils/adapter";
import { authMixin } from "@/utils/mixins";
import loadingAnimation from "@/components/loadingAnimation";
import vTable from "@/components/table";

export default {
  components: {
    loadingAnimation,
    vTable
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
      fundachievementsStr: "",
      fundarchiveStr: "",
      metricsStr: "",
      fundAchievementTable: [],
      fundAchievementHeader: [
        {
          title: "基金名称",
          key: "id"
        }
      ],
      fundArchiveTable: [],
      fundArchiveHeader: [
        {
          title: "基金名称",
          key: "id"
        }
      ],
      checkedFavorite: false
    };
  },
  computed: {
    ...mapGetters("user", ["collect"]),
    ...mapGetters("app", ["hasLoggedIn"])
  },
  watch: {
    hasLoggedIn(val) {
      if (val) {
        this.getData(this.hideAnimation);
      }
    }
  },
  onShow() {
    if (this.hasLoggedIn) this.getData(this.hideAnimation);
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
          this.manager_funds = [];
          this.index_funds = [];
          for (let i = 0; i < res.data.results.length; ++i) {
            if (res.data.results[i].type === "MANAGER") {
              this.manager_funds.push(res.data.results[i]);
            } else {
              this.index_funds.push(res.data.results[i]);
            }
          }
          this.fundList = res.data.results;
          console.log("collect:", this.collect);
          if (this.collect.id > -1 && this.collect.type === "HC") {
            this.$request({
              method: "GET",
              url: `customer_collect/${this.collect.id}/`
            }).then(([_, res2]) => {
              this.fundAchievementHeader = [
                {
                  title: "基金名称",
                  key: "id"
                }
              ];
              this.fundArchiveHeader = [
                {
                  title: "基金名称",
                  key: "id"
                }
              ];
              res2.data.fund_comparison.title.achievement_title.map(data => {
                const tableCol = {
                  title: data,
                  key: data
                };
                this.fundAchievementHeader.push(tableCol);
              });
              res2.data.fund_comparison.title.data_title.map(data => {
                const tableCol = {
                  title: data,
                  key: data
                };
                this.fundArchiveHeader.push(tableCol);
              });

              this.updateArchiveTable(res2.data.fund_comparison.data);
              this.updateAchievementTable(res2.data.fund_comparison.data);
              this.confirmStage = 3;
              this.checkedFavorite = true;
            });
          }
        })
        .finally(() => {
          typeof callback === "function" && callback();
        });
    },
    selectFundsConfirm() {
      if (this.checkedFunds.length < 2) {
        notify("请选择至少两个基金");
        return;
      }
      this.confirmStage = 1;
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
      this.confirmStage = 2;
      let fundachievementsStr = "";
      let fundarchiveStr = "";
      let f1 = 0;
      let f2 = 0;
      this.fundAchievementHeader = [
        {
          title: "基金名称",
          key: "id"
        }
      ];
      this.fundArchiveHeader = [
        {
          title: "基金名称",
          key: "id"
        }
      ];
      this.checkedMetrics.map(data => {
        if (this.fund_achievement.indexOf(data) > -1) {
          fundachievementsStr += f1 === 0 ? `${data}` : `,${data}`;
          const tableCol = {
            title: data,
            key: data
          };
          this.fundAchievementHeader.push(tableCol);
          f1 += 1;
        } else {
          fundarchiveStr += f2 === 0 ? `${data}` : `,${data}`;
          const tableCol = {
            title: data,
            key: data
          };
          this.fundArchiveHeader.push(tableCol);
          f2 += 1;
        }
      });
      this.fundarchiveStr = fundarchiveStr;
      this.fundachievementsStr = fundachievementsStr;
      this.$request({
        method: "GET",
        url: `fund_archive/get_fund_data/?id=${
          this.idsStr
        }&fund_data=${fundarchiveStr}&fund_achievement=${fundachievementsStr}`
      }).then(([_, res]) => {
        this.updateArchiveTable(res.data.result);
        this.updateAchievementTable(res.data.result);
      });
    },
    updateArchiveTable(dataArray) {
      this.fundArchiveTable = [];
      dataArray.map(data => {
        const tableArchiveRow = {
          id: data.fund_name
        };
        this.fundArchiveHeader.map(header => {
          tableArchiveRow[header.title] = data.fund_data[header.title]
            ? data.fund_data[header.title]
            : "无";
        });
        this.fundArchiveTable.push(tableArchiveRow);
      });
    },
    updateAchievementTable(dataArray) {
      this.fundAchievementTable = [];
      dataArray.map(data => {
        const tableAchievementRow = {
          id: data.fund_name
        };
        this.fundAchievementHeader.map(header => {
          let a = data.fund_achievement[header.title];
          if (
            header.title === "月收益率" ||
            header.title === "回撤" ||
            header.title === "成立以来收益" ||
            header.title === "最近一年收益" ||
            header.title === "最近二年收益" ||
            header.title === "最近三年收益" ||
            header.title === "最近五年收益" ||
            header.title === "最近一年年化" ||
            header.title === "最近二年年化" ||
            header.title === "最近三年年化" ||
            header.title === "最近五年年化"
          ) {
            a = `${(parseFloat(a) * 100).toFixed(2)}%`;
          }
          if (a) {
            tableAchievementRow[header.title] = a;
          }
        });
        this.fundAchievementTable.push(tableAchievementRow);
      });
    },
    acrossClear() {
      this.confirmStage = 0;
      this.checkedMetrics = [];
      this.fundAchievementTable = [];
      this.fundArchiveTable = [];
      this.$store.commit("user/SET_COLLECTID", "", -1);
    },
    onChangeFavorite() {
      if (!this.checkedFavorite) {
        const data = {
          type: "HC",
          data: {
            id: this.idsStr,
            fund_data: this.fundarchiveStr,
            fund_achievement: this.fundachievementsStr
          }
        };
        this.$request({
          method: "POST",
          url: "customer_collect/",
          data
        }).then(([_, res]) => {
          this.$store.commit("user/SET_COLLECTID", "HC", res.data.id);
          this.checkedFavorite = true;
        });
      } else {
        this.$request({
          method: "DELETE",
          url: `customer_collect/${this.collect.id}/`
        }).then(([_, __]) => {
          this.$store.commit("user/SET_COLLECTID", "", -1);
          this.checkedFavorite = false;
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.title {
  font-size: 36upx;
  font-weight: bold;
  text-align: left;
  margin: 20upx 0 40upx;
  padding: 0 30upx;
}
.favorite {
  z-index: 10000;
  position: fixed;
  top: 0;
  right: 24upx;
}
</style>
