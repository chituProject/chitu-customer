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
import { formatPercent } from "@/utils/index";

export default {
  components: {
    navBar
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
      }
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
      });
    },
    navCallback(e) {
      uni.setNavigationBarTitle({
        title: this.navs[e].title
      });
      this.activeIndex = e;
    }
  },
  onLoad(option) {
    this.getData(option.id);
  }
};
</script>

<style lang="scss" scoped></style>
